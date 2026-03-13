#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Generate a short random cache token
function generateCacheToken(): string {
  return Date.now().toString(36) + crypto.randomBytes(4).toString("hex");
}

// Hash a single file for content tracking
function hashFile(filePath: string): string {
  try {
    return crypto
      .createHash("md5")
      .update(fs.readFileSync(filePath))
      .digest("hex");
  } catch {
    return generateCacheToken();
  }
}

// Recursively collect static assets from /public
function getStaticFiles(): string[] {
  const publicDir = path.join(projectRoot, "public");
  const files: string[] = [];
  const ASSET_EXTS = new Set([
    ".js",
    ".css",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".ico",
    ".woff",
    ".woff2",
  ]);

  function scan(dir: string, rel = ""): void {
    try {
      for (const item of fs.readdirSync(dir)) {
        const abs = path.join(dir, item);
        const relItem = rel ? path.join(rel, item) : item;
        if (fs.statSync(abs).isDirectory()) {
          scan(abs, relItem);
        } else if (ASSET_EXTS.has(path.extname(item).toLowerCase())) {
          files.push(relItem);
        }
      }
    } catch {
      // ignore unreadable dirs
    }
  }

  scan(publicDir);
  return files;
}

// Write public/cache-buster.json
function writeCacheBusterJson(token: string): void {
  const staticFiles = getStaticFiles();
  const fileHashes: Record<string, string> = {};

  for (const file of staticFiles) {
    fileHashes[file] = hashFile(path.join(projectRoot, "public", file));
  }

  const config = {
    version: token,
    timestamp: new Date().toISOString(),
    hash: token,
    files: fileHashes,
  };

  const dest = path.join(projectRoot, "public", "cache-buster.json");
  fs.writeFileSync(dest, JSON.stringify(config, null, 2));
  console.log(
    `✅  cache-buster.json written  (${staticFiles.length} files tracked)`,
  );
}

// Write / update NEXT_PUBLIC_CACHE_TOKEN in .env.local
function updateEnvLocal(token: string): void {
  const envPath = path.join(projectRoot, ".env.local");
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

  const line = `NEXT_PUBLIC_CACHE_TOKEN=${token}`;

  if (/^NEXT_PUBLIC_CACHE_TOKEN=.*/m.test(content)) {
    content = content.replace(/^NEXT_PUBLIC_CACHE_TOKEN=.*/m, line);
  } else {
    // Append with a leading newline when the file is non-empty and doesn't end with one
    if (content && !content.endsWith("\n")) content += "\n";
    content += line + "\n";
  }

  fs.writeFileSync(envPath, content);
  console.log(`✅  NEXT_PUBLIC_CACHE_TOKEN=${token}  →  .env.local`);
}

function main(): void {
  console.log("🚀  Generating cache busting token…\n");

  const token = generateCacheToken();

  writeCacheBusterJson(token);
  updateEnvLocal(token);

  console.log("");
  console.log("📊  Cache Busting Summary");
  console.log(`    Token     : ${token}`);
  console.log(`    Timestamp : ${new Date().toISOString()}`);
  console.log("");
  console.log("✅  Cache busting prebuild completed!");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateCacheToken, main };
