import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";
import { getCachedResponse } from "@/lib/server-cache";

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

// Separate function for sitemap generation
async function generateSitemap(): Promise<NextResponse> {
  const baseUrl = "https://paludevhouse.site";
  const currentDate = new Date().toISOString();

  try {
    const db = await getDatabase();

    // Get published articles
    const articles = await db.all(
      "SELECT slug FROM articles WHERE status = ?",
      ["published"],
    );

    // Get active projects
    const projects = await db.all(
      "SELECT slug FROM projects WHERE status = ?",
      ["active"],
    );

    // Get active founders
    const founders = await db.all(
      "SELECT key FROM copywriting WHERE section = ? AND isActive = 1",
      ["founders"],
    );

    // Define public pages
    const publicPages: SitemapEntry[] = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/founders`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    // Generate dynamic article pages
    const articlePages: SitemapEntry[] = articles.map((article: any) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    // Generate dynamic project pages
    const projectPages: SitemapEntry[] = projects.map((project: any) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    // Generate dynamic founder pages
    const founderPages: SitemapEntry[] = founders.map((founder: any) => ({
      url: `${baseUrl}/founders/${founder.key}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    // Combine all pages
    const allPages = [
      ...publicPages,
      ...articlePages,
      ...projectPages,
      ...founderPages,
    ];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback to static sitemap if database fails
    const staticPages: SitemapEntry[] = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/founders`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }
}

// Add caching wrapper for the GET function
export async function GET(request: Request) {
  const response = await generateSitemap();

  // Use server-side caching without cache busting for SEO
  return getCachedResponse(
    request as any,
    JSON.stringify(response.body),
    "public, max-age=3600, stale-while-revalidate=7200",
  );
}
