import BetterSqlite3 from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "database.sqlite");

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Async-compatible wrapper around better-sqlite3 (which is synchronous)
// All methods return Promises so route files can safely use await.
export interface AsyncDatabase {
  all<T = any>(sql: string, params?: any[]): Promise<T[]>;
  get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
  run(sql: string, params?: any[]): Promise<BetterSqlite3.RunResult>;
  prepare(sql: string): BetterSqlite3.Statement;
  pragma(statement: string, options?: BetterSqlite3.PragmaOptions): any;
  exec(sql: string): void;
  close(): void;
}

let db: BetterSqlite3.Database | null = null;

function getRawDatabase(): BetterSqlite3.Database {
  if (!db) {
    db = new BetterSqlite3(DB_PATH);
    db.pragma("foreign_keys = ON");
    db.pragma("journal_mode = WAL");
    initializeDatabase(db);
  }
  return db;
}

// Returns an async-compatible wrapper — safe to use with or without await
export async function getDatabase(): Promise<AsyncDatabase> {
  const raw = getRawDatabase();

  return {
    all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
      return Promise.resolve(raw.prepare(sql).all(...params) as T[]);
    },
    get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
      return Promise.resolve(raw.prepare(sql).get(...params) as T | undefined);
    },
    run(sql: string, params: any[] = []): Promise<BetterSqlite3.RunResult> {
      // better-sqlite3 has no transactions via db.run('BEGIN') in the same way,
      // but we support raw BEGIN/COMMIT/ROLLBACK strings for compatibility.
      return Promise.resolve(raw.prepare(sql).run(...params));
    },
    prepare(sql: string): BetterSqlite3.Statement {
      return raw.prepare(sql);
    },
    pragma(statement: string, options?: BetterSqlite3.PragmaOptions): any {
      return raw.pragma(statement, options);
    },
    exec(sql: string): void {
      raw.exec(sql);
    },
    close(): void {
      raw.close();
      db = null;
    },
  };
}

// Also export a sync getter for routes that use the sync API (e.g. admin/articles)
export function getDatabase_sync(): BetterSqlite3.Database & {
  all<T = any>(sql: string, params?: any[]): T[];
  get<T = any>(sql: string, params?: any[]): T | undefined;
  run(sql: string, params?: any[]): BetterSqlite3.RunResult;
} {
  const raw = getRawDatabase();

  // Attach convenience helpers directly so existing sync callers keep working
  const wrapped = raw as any;
  wrapped.all = <T = any>(sql: string, params: any[] = []): T[] =>
    raw.prepare(sql).all(...params) as T[];
  wrapped.get = <T = any>(sql: string, params: any[] = []): T | undefined =>
    raw.prepare(sql).get(...params) as T | undefined;
  wrapped.run = (sql: string, params: any[] = []): BetterSqlite3.RunResult =>
    raw.prepare(sql).run(...params);

  return wrapped;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// ---------------------------------------------------------------------------
// Schema + seed
// ---------------------------------------------------------------------------

function initializeDatabase(database: BetterSqlite3.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS copywriting (
      id          TEXT PRIMARY KEY,
      section     TEXT NOT NULL,
      key         TEXT NOT NULL,
      value       TEXT NOT NULL DEFAULT '',
      type        TEXT NOT NULL DEFAULT 'text',
      order_index INTEGER NOT NULL DEFAULT 0,
      isActive    INTEGER NOT NULL DEFAULT 1,
      createdAt   TEXT NOT NULL,
      updatedAt   TEXT NOT NULL,
      UNIQUE(section, key)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      type        TEXT,
      featured    INTEGER DEFAULT 0,
      technologies TEXT,
      images      TEXT,
      status      TEXT DEFAULT 'active',
      slug        TEXT UNIQUE NOT NULL,
      demoUrl     TEXT,
      githubUrl   TEXT,
      client      TEXT,
      completedAt TEXT,
      createdAt   TEXT,
      updatedAt   TEXT
    );

    CREATE TABLE IF NOT EXISTS articles (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      excerpt     TEXT,
      content     TEXT,
      author      TEXT,
      publishedAt TEXT,
      readTime    TEXT,
      url         TEXT,
      tags        TEXT,
      featured    INTEGER DEFAULT 0,
      status      TEXT DEFAULT 'draft',
      image       TEXT,
      slug        TEXT UNIQUE NOT NULL,
      createdAt   TEXT,
      updatedAt   TEXT
    );

    CREATE TABLE IF NOT EXISTS founders (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      location   TEXT,
      image      TEXT,
      background TEXT,
      experience TEXT,
      website    TEXT,
      medium     TEXT,
      social     TEXT,
      slug       TEXT UNIQUE NOT NULL,
      createdAt  TEXT,
      updatedAt  TEXT
    );

    CREATE TABLE IF NOT EXISTS assets (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      filename      TEXT NOT NULL,
      path          TEXT NOT NULL,
      fullPath      TEXT,
      extension     TEXT,
      size          INTEGER DEFAULT 0,
      sizeFormatted TEXT,
      category      TEXT,
      mimeType      TEXT,
      lastModified  TEXT,
      createdAt     TEXT,
      updatedAt     TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_copywriting_section    ON copywriting(section);
    CREATE INDEX IF NOT EXISTS idx_copywriting_active     ON copywriting(isActive);
    CREATE INDEX IF NOT EXISTS idx_projects_featured      ON projects(featured);
    CREATE INDEX IF NOT EXISTS idx_projects_status        ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_slug          ON projects(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_featured      ON articles(featured);
    CREATE INDEX IF NOT EXISTS idx_articles_status        ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_slug          ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_founders_slug          ON founders(slug);
  `);

  seedInitialData(database);
}

function seedInitialData(database: BetterSqlite3.Database) {
  const now = new Date().toISOString();

  // ── Projects ────────────────────────────────────────────────────────────
  const projectCount = (
    database.prepare("SELECT COUNT(*) as count FROM projects").get() as {
      count: number;
    }
  ).count;

  if (projectCount === 0) {
    const insertProject = database.prepare(`
      INSERT INTO projects (id, title, description, type, featured, technologies, images,
        status, slug, demoUrl, githubUrl, client, completedAt, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const projects = [
      {
        id: "proj_001",
        title: "UMKM Manager",
        description:
          "Comprehensive management system for small and medium enterprises in Indonesia",
        type: "SaaS",
        featured: 1,
        technologies: JSON.stringify([
          "React",
          "Node.js",
          "PostgreSQL",
          "Tailwind CSS",
        ]),
        images: JSON.stringify(["/images/projects/umkm-manager.webp"]),
        status: "active",
        slug: "umkm-manager",
        demoUrl: "https://umkm-demo.example.com",
        githubUrl: "https://github.com/palu-dev-house/umkm-manager",
        client: "Local UMKM Association",
        completedAt: "2024-01-15",
      },
      {
        id: "proj_002",
        title: "E-Learning Platform",
        description:
          "Online learning platform designed for Indonesian students and educators",
        type: "Web App",
        featured: 1,
        technologies: JSON.stringify([
          "Next.js",
          "TypeScript",
          "MongoDB",
          "Socket.io",
        ]),
        images: JSON.stringify(["/images/projects/elearning.webp"]),
        status: "active",
        slug: "elearning-platform",
        demoUrl: "https://elearning-demo.example.com",
        githubUrl: "https://github.com/palu-dev-house/elearning",
        client: "Education Foundation",
        completedAt: "2024-02-20",
      },
    ];

    projects.forEach((p) =>
      insertProject.run(
        p.id,
        p.title,
        p.description,
        p.type,
        p.featured,
        p.technologies,
        p.images,
        p.status,
        p.slug,
        p.demoUrl,
        p.githubUrl,
        p.client,
        p.completedAt,
        now,
        now,
      ),
    );
  }

  // ── Articles ─────────────────────────────────────────────────────────────
  const articleCount = (
    database.prepare("SELECT COUNT(*) as count FROM articles").get() as {
      count: number;
    }
  ).count;

  if (articleCount === 0) {
    const insertArticle = database.prepare(`
      INSERT INTO articles (id, title, excerpt, content, author, publishedAt, readTime,
        url, tags, featured, status, image, slug, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const articles = [
      {
        id: "art_001",
        title: "Building Scalable Frontend Applications",
        excerpt:
          "Best practices for creating maintainable and scalable frontend applications.",
        content:
          "In this article, we explore the best practices for building frontend applications that can scale with your team and user base...",
        author: "Ferdy",
        publishedAt: "2024-03-10",
        readTime: "5 min",
        url: "https://medium.com/@ferdylimm9/building-scalable-frontend-applications",
        tags: JSON.stringify([
          "frontend",
          "react",
          "typescript",
          "architecture",
        ]),
        featured: 1,
        status: "published",
        image: "/images/articles/scalable-frontend.webp",
        slug: "building-scalable-frontend-applications",
      },
      {
        id: "art_002",
        title: "ERP Systems: Lessons from 4+ Years of Development",
        excerpt:
          "Key insights and challenges faced while developing enterprise resource planning systems.",
        content:
          "After spending over four years developing and maintaining ERP systems, I have learned valuable lessons about enterprise software...",
        author: "Ferdy",
        publishedAt: "2024-03-05",
        readTime: "8 min",
        url: "https://medium.com/@ferdylimm9/erp-systems-lessons",
        tags: JSON.stringify(["erp", "enterprise", "backend", "database"]),
        featured: 1,
        status: "published",
        image: "/images/articles/erp-systems.webp",
        slug: "erp-systems-lessons",
      },
    ];

    articles.forEach((a) =>
      insertArticle.run(
        a.id,
        a.title,
        a.excerpt,
        a.content,
        a.author,
        a.publishedAt,
        a.readTime,
        a.url,
        a.tags,
        a.featured,
        a.status,
        a.image,
        a.slug,
        now,
        now,
      ),
    );
  }

  // ── Founders ─────────────────────────────────────────────────────────────
  const founderCount = (
    database.prepare("SELECT COUNT(*) as count FROM founders").get() as {
      count: number;
    }
  ).count;

  if (founderCount === 0) {
    const insertFounder = database.prepare(`
      INSERT INTO founders (id, name, location, image, background, experience,
        website, medium, social, slug, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const founders = [
      {
        id: "founder_001",
        name: "Stiven",
        location: "Palu, Sulawesi",
        image: "/images/stiven.webp",
        background: JSON.stringify(["Business", "Blockchain", "Finance"]),
        experience:
          "Membangun enterprise applications dengan keahlian dalam business strategy, blockchain technology, dan financial systems.",
        website: "",
        medium: "https://medium.com/@stivenhendra",
        social: JSON.stringify({
          linkedin: "https://www.linkedin.com/in/stiven-suhendra/",
          github: "https://github.com/Stiv26",
          twitter: "",
        }),
        slug: "stiven",
      },
      {
        id: "founder_002",
        name: "Ferdy",
        location: "Medan, Sumatera",
        image: "/images/ferdy.webp",
        background: JSON.stringify([
          "Software Development",
          "ERP",
          "Psychology",
        ]),
        experience:
          "Senior Frontend Engineer dengan pengalaman 4+ tahun membangun enterprise apps, ERP systems, dan landing pages. Saat ini bekerja di perusahaan Malaysia.",
        website: "https://ferdylim.paludevhouse.site/",
        medium: "https://medium.com/@ferdylimm9",
        social: JSON.stringify({
          linkedin: "https://www.linkedin.com/in/ferdylimm9/",
          github: "https://github.com/ferdylimmm9",
          twitter: "https://x.com/dundundance_",
        }),
        slug: "ferdy",
      },
    ];

    founders.forEach((f) =>
      insertFounder.run(
        f.id,
        f.name,
        f.location,
        f.image,
        f.background,
        f.experience,
        f.website,
        f.medium,
        f.social,
        f.slug,
        now,
        now,
      ),
    );
  }

  // ── Copywriting ───────────────────────────────────────────────────────────
  const copyCount = (
    database.prepare("SELECT COUNT(*) as count FROM copywriting").get() as {
      count: number;
    }
  ).count;

  if (copyCount === 0) {
    const insertCopy = database.prepare(`
      INSERT INTO copywriting (id, section, key, value, type, order_index, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const entries: Array<{
      section: string;
      key: string;
      value: string;
      type: "text" | "json" | "array";
      order_index: number;
    }> = [
      // ── navi ──────────────────────────────────────────────────────────────
      {
        section: "navi",
        key: "brand",
        value: "Palu Dev House",
        type: "text",
        order_index: 0,
      },
      {
        section: "navi",
        key: "home",
        value: "Home",
        type: "text",
        order_index: 1,
      },
      {
        section: "navi",
        key: "about",
        value: "About",
        type: "text",
        order_index: 2,
      },
      {
        section: "navi",
        key: "projects",
        value: "Projects",
        type: "text",
        order_index: 3,
      },
      {
        section: "navi",
        key: "articles",
        value: "Articles",
        type: "text",
        order_index: 4,
      },
      {
        section: "navi",
        key: "contact",
        value: "Contact",
        type: "text",
        order_index: 5,
      },

      // ── hero ──────────────────────────────────────────────────────────────
      {
        section: "hero",
        key: "title",
        value: "Membangun Tools yang Tepat untuk Semua Orang di Indonesia",
        type: "text",
        order_index: 0,
      },
      {
        section: "hero",
        key: "subtitle",
        value: "Tech House dari Indonesia",
        type: "text",
        order_index: 1,
      },
      {
        section: "hero",
        key: "description",
        value:
          "Kami membangun tools yang tepat, berdampak, dan sederhana untuk semua orang di Indonesia.",
        type: "text",
        order_index: 2,
      },
      {
        section: "hero",
        key: "ctaPrimary",
        value: "Lihat Proyek Kami",
        type: "text",
        order_index: 3,
      },
      {
        section: "hero",
        key: "ctaSecondary",
        value: "Hubungi Kami",
        type: "text",
        order_index: 4,
      },
      {
        section: "hero",
        key: "stats",
        value: JSON.stringify([
          { value: "2", label: "Pendiri" },
          { value: "4+", label: "Tahun Pengalaman" },
          { value: "100%", label: "Tim Indonesia" },
          { value: "∞", label: "Semangat Teknologi" },
        ]),
        type: "array",
        order_index: 5,
      },

      // ── story ─────────────────────────────────────────────────────────────
      {
        section: "story",
        key: "title",
        value: "Cerita Kami",
        type: "text",
        order_index: 0,
      },
      {
        section: "story",
        key: "content",
        value: JSON.stringify([
          "Kisah Palu Dev House dimulai dari percakapan larut malam antara dua teman yang memiliki mimpi bersama: menggunakan teknologi untuk membuat perbedaan nyata di Indonesia.",
          "Stiven, dari Palu di Sulawesi Tengah, dan Ferdy, dari Medan di Sumatera Utara, bertemu saat studi computer science mereka. Meskipun berasal dari berbagai penjuru kepulauan, mereka menemukan frustrasi yang sama: teknologi hebat sering kali terlalu kompleks, terlalu mahal, atau bahkan tidak tersedia bagi orang yang paling membutuhkannya.",
          "Mereka bertanya pada diri sendiri: Bagaimana jika kita membangun teknologi secara berbeda? Bagaimana jika kita fokus menyelesaikan masalah nyata dengan solusi yang sederhana dan dapat diakses?",
          "Dari pertanyaan itu, Palu Dev House lahir. Dinamai sesuai kota dimana perjalanan kami dimulai, kami berkomitmen untuk membangun teknologi yang tepat, berdampak, dan sederhana untuk semua orang di Indonesia—dimulai dari tempat asal kami.",
        ]),
        type: "array",
        order_index: 1,
      },

      // ── about ─────────────────────────────────────────────────────────────
      {
        section: "about",
        key: "title",
        value: "Tentang Kami",
        type: "text",
        order_index: 0,
      },
      {
        section: "about",
        key: "subtitle",
        value:
          "Dua lulusan Computer Science dengan visi bersama untuk masa depan teknologi Indonesia",
        type: "text",
        order_index: 1,
      },
      {
        section: "about",
        key: "origin_title",
        value: "Asal Usul",
        type: "text",
        order_index: 2,
      },
      {
        section: "about",
        key: "origin_content",
        value:
          "Palu Dev House lahir dari persahabatan dua mahasiswa Computer Science dari berbagai penjuru Indonesia. Berawal dari diskusi larut malam tentang bagaimana teknologi dapat menyelesaikan masalah nyata, kami memutuskan untuk membangun sesuatu yang berarti bagi bangsa.",
        type: "text",
        order_index: 3,
      },
      {
        section: "about",
        key: "background_title",
        value: "Latar Belakang",
        type: "text",
        order_index: 4,
      },
      {
        section: "about",
        key: "background_content",
        value:
          "Dengan pengalaman di berbagai industri teknologi, kami memahami kesenjangan antara solusi enterprise dan kebutuhan bisnis lokal. Kami membawa pengetahuan global untuk memecahkan masalah Indonesia.",
        type: "text",
        order_index: 5,
      },
      {
        section: "about",
        key: "mission_title",
        value: "Misi",
        type: "text",
        order_index: 6,
      },
      {
        section: "about",
        key: "mission_content",
        value:
          "Membangun tools teknologi yang tepat, berdampak, dan sederhana untuk membantu bisnis dan individu di seluruh Indonesia berkembang di era digital.",
        type: "text",
        order_index: 7,
      },

      // ── philosophy ────────────────────────────────────────────────────────
      {
        section: "philosophy",
        key: "title",
        value: "Filosofi Kami",
        type: "text",
        order_index: 0,
      },
      {
        section: "philosophy",
        key: "subtitle",
        value: "Tiga prinsip yang memandu setiap baris kode yang kami tulis",
        type: "text",
        order_index: 1,
      },
      {
        section: "philosophy",
        key: "items",
        value: JSON.stringify([
          {
            title: "Tepat",
            description:
              "Memahami masalah sebelum menulis solusi. Setiap fitur harus memiliki tujuan yang jelas dan menyelesaikan kebutuhan nyata pengguna.",
          },
          {
            title: "Berdampak",
            description:
              "Teknologi harus menciptakan nilai nyata. Kami mengukur kesuksesan dari dampak positif yang dihasilkan, bukan dari kompleksitas teknis.",
          },
          {
            title: "Sederhana",
            description:
              "Solusi terbaik adalah yang paling sederhana. Kami percaya bahwa kemudahan penggunaan adalah kunci adopsi teknologi yang luas.",
          },
        ]),
        type: "array",
        order_index: 2,
      },

      // ── focus ─────────────────────────────────────────────────────────────
      {
        section: "focus",
        key: "title",
        value: "Fokus Kami",
        type: "text",
        order_index: 0,
      },
      {
        section: "focus",
        key: "subtitle",
        value:
          "Area spesialisasi yang kami geluti untuk memberikan solusi terbaik",
        type: "text",
        order_index: 1,
      },
      {
        section: "focus",
        key: "items",
        value: JSON.stringify([
          {
            title: "Enterprise Solutions",
            description:
              "Membangun sistem yang handal untuk kebutuhan bisnis yang lebih kompleks. ERP, CRM, dan sistem custom.",
            examples: ["ERP Systems", "Custom Apps", "Integrations"],
          },
          {
            title: "Digital Tools",
            description:
              "Menciptakan tools yang memudahkan produktivitas dan kolaborasi untuk bisnis kecil dan menengah.",
            examples: [
              "Productivity Apps",
              "Automation Tools",
              "Collaboration Platforms",
            ],
          },
        ]),
        type: "array",
        order_index: 2,
      },

      // ── founders ──────────────────────────────────────────────────────────
      {
        section: "founders",
        key: "title",
        value: "Kenali Para Pendiri",
        type: "text",
        order_index: 0,
      },
      {
        section: "founders",
        key: "subtitle",
        value:
          "Dua lulusan Computer Science dengan visi bersama untuk masa depan teknologi Indonesia",
        type: "text",
        order_index: 1,
      },
      {
        section: "founders",
        key: "items",
        value: JSON.stringify([
          {
            name: "Stiven",
            location: "Palu, Sulawesi",
            image: "/images/stiven.webp",
            background: ["Business", "Blockchain", "Finance"],
            experience:
              "Membangun enterprise applications dengan keahlian dalam business strategy, blockchain technology, dan financial systems.",
            website: "",
            medium: "https://medium.com/@stivenhendra",
            social: {
              linkedin: "https://www.linkedin.com/in/stiven-suhendra/",
              github: "https://github.com/Stiv26",
              twitter: "",
            },
          },
          {
            name: "Ferdy",
            location: "Medan, Sumatera",
            image: "/images/ferdy.webp",
            background: ["Software Development", "ERP", "Psychology"],
            experience:
              "Senior Frontend Engineer dengan pengalaman 4+ tahun membangun enterprise apps, ERP systems, dan landing pages. Saat ini bekerja di perusahaan Malaysia.",
            website: "https://ferdylim.paludevhouse.site/",
            medium: "https://medium.com/@ferdylimm9",
            social: {
              linkedin: "https://www.linkedin.com/in/ferdylimm9/",
              github: "https://github.com/ferdylimmm9",
              twitter: "https://x.com/dundundance_",
            },
          },
        ]),
        type: "array",
        order_index: 2,
      },

      // ── projects ──────────────────────────────────────────────────────────
      {
        section: "projects",
        key: "title",
        value: "Proyek Kami",
        type: "text",
        order_index: 0,
      },
      {
        section: "projects",
        key: "subtitle",
        value:
          "Solusi teknologi yang kami bangun untuk membantu bisnis dan komunitas",
        type: "text",
        order_index: 1,
      },
      {
        section: "projects",
        key: "viewAll",
        value: "Lihat Semua Proyek",
        type: "text",
        order_index: 2,
      },

      // ── articles ──────────────────────────────────────────────────────────
      {
        section: "articles",
        key: "title",
        value: "Artikel Terbaru",
        type: "text",
        order_index: 0,
      },
      {
        section: "articles",
        key: "subtitle",
        value:
          "Berbagi pengetahuan dan pengalaman dalam pengembangan teknologi",
        type: "text",
        order_index: 1,
      },
      {
        section: "articles",
        key: "viewAll",
        value: "Baca Semua Artikel",
        type: "text",
        order_index: 2,
      },
      {
        section: "articles",
        key: "medium",
        value: JSON.stringify({
          author: "Ferdy",
          mediumProfile: "https://medium.com/@ferdylimm9",
          articles: [
            {
              title: "Building Scalable Frontend Applications",
              excerpt:
                "Best practices for creating maintainable and scalable frontend applications.",
              url: "https://medium.com/@ferdylimm9",
              publishedAt: "2024-03-10",
              readTime: "5 min",
            },
            {
              title: "ERP Systems: Lessons from 4+ Years of Development",
              excerpt:
                "Key insights and challenges faced while developing enterprise resource planning systems for various industries.",
              url: "https://medium.com/@ferdylimm9",
              publishedAt: "2024-03-05",
              readTime: "8 min",
            },
          ],
        }),
        type: "json",
        order_index: 3,
      },

      // ── contact ───────────────────────────────────────────────────────────
      {
        section: "contact",
        key: "title",
        value: "Hubungi Kami",
        type: "text",
        order_index: 0,
      },
      {
        section: "contact",
        key: "subtitle",
        value:
          "Punya proyek atau ingin berkolaborasi? Kami ingin mendengar dari Anda.",
        type: "text",
        order_index: 1,
      },
      {
        section: "contact",
        key: "email",
        value: "paludevhouse@gmail.com",
        type: "text",
        order_index: 2,
      },
      {
        section: "contact",
        key: "phone",
        value: "+62 822-6874-7890",
        type: "text",
        order_index: 3,
      },
      {
        section: "contact",
        key: "location",
        value: "Sulawesi, Indonesia",
        type: "text",
        order_index: 4,
      },

      // ── footer ─────────────────────────────────────────────────────────────
      {
        section: "footer",
        key: "brand_name",
        value: "Palu Dev House",
        type: "text",
        order_index: 0,
      },
      {
        section: "footer",
        key: "brand_description",
        value: "Perusahaan teknologi dari Indonesia yang membangun tools dan aplikasi SaaS untuk membantu bisnis dan menyebarkan penggunaan teknologi di seluruh Indonesia.",
        type: "text",
        order_index: 1,
      },
      {
        section: "footer",
        key: "social_github",
        value: "https://github.com/palu-dev-house",
        type: "text",
        order_index: 2,
      },
      {
        section: "footer",
        key: "social_linkedin",
        value: "https://linkedin.com/company/paludevhouse",
        type: "text",
        order_index: 3,
      },
      {
        section: "footer",
        key: "social_twitter",
        value: "https://twitter.com/paludevhouse",
        type: "text",
        order_index: 4,
      },
      {
        section: "footer",
        key: "quicklinks_title",
        value: "Tautan Cepat",
        type: "text",
        order_index: 5,
      },
      {
        section: "footer",
        key: "contact_title",
        value: "Kontak",
        type: "text",
        order_index: 6,
      },
      {
        section: "footer",
        key: "copyright",
        value: "© {year} Palu Dev House. Semua hak dilindungi.",
        type: "text",
        order_index: 7,
      },

      // ── navigation ─────────────────────────────────────────────────────────
      {
        section: "navigation",
        key: "brand_name",
        value: "Palu Dev House",
        type: "text",
        order_index: 0,
      },
      {
        section: "navigation",
        key: "brand_tagline",
        value: "TECH HOUSE FROM INDONESIA",
        type: "text",
        order_index: 1,
      },
      {
        section: "navigation",
        key: "links",
        value: JSON.stringify([
          { href: "/", label: "Home" },
          { href: "#about", label: "About" },
          { href: "#focus", label: "Services" },
          { href: "/projects", label: "Projects" },
          { href: "/articles", label: "Articles" },
          { href: "#contact", label: "Contact" },
        ]),
        type: "array",
        order_index: 2,
      },
    ];

    entries.forEach((e, i) => {
      const id = `copy_${e.section}_${e.key}_${i}`;
      insertCopy.run(
        id,
        e.section,
        e.key,
        e.value,
        e.type,
        e.order_index,
        1,
        now,
        now,
      );
    });

    console.log("✅ Database seeded with initial copywriting data");
  }

  // ── Assets ──────────────────────────────────────────────────────────────
  const assetCount = (
    database.prepare("SELECT COUNT(*) as count FROM assets").get() as {
      count: number;
    }
  ).count;

  if (assetCount === 0) {
    const insertAsset = database.prepare(`
      INSERT INTO assets (id, name, filename, path, fullPath, extension, size, sizeFormatted, category, mimeType, lastModified, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleAssets = [
      {
        id: "asset_hero_bg_1",
        name: "Hero Background 1",
        filename: "hero-bg-1.webp",
        path: "/images/hero-bg-1.webp",
        fullPath: "/Users/ferdylim/Workspace/palu-dev-house/public/images/hero-bg-1.webp",
        extension: ".webp",
        size: 245760,
        sizeFormatted: "240 KB",
        category: "images",
        mimeType: "image/webp",
        lastModified: now,
      },
      {
        id: "asset_project_1",
        name: "ERP System Screenshot",
        filename: "erp-system.webp",
        path: "/images/erp-system.webp",
        fullPath: "/Users/ferdylim/Workspace/palu-dev-house/public/images/erp-system.webp",
        extension: ".webp",
        size: 163840,
        sizeFormatted: "160 KB",
        category: "images",
        mimeType: "image/webp",
        lastModified: now,
      },
      {
        id: "asset_project_2",
        name: "Digital Tools Dashboard",
        filename: "digital-tools.webp",
        path: "/images/digital-tools.webp",
        fullPath: "/Users/ferdylim/Workspace/palu-dev-house/public/images/digital-tools.webp",
        extension: ".webp",
        size: 196608,
        sizeFormatted: "192 KB",
        category: "images",
        mimeType: "image/webp",
        lastModified: now,
      },
      {
        id: "asset_founder_stiven",
        name: "Stiven Profile",
        filename: "stiven.webp",
        path: "/images/stiven.webp",
        fullPath: "/Users/ferdylim/Workspace/palu-dev-house/public/images/stiven.webp",
        extension: ".webp",
        size: 81920,
        sizeFormatted: "80 KB",
        category: "images",
        mimeType: "image/webp",
        lastModified: now,
      },
      {
        id: "asset_founder_ferdy",
        name: "Ferdy Profile",
        filename: "ferdy.webp",
        path: "/images/ferdy.webp",
        fullPath: "/Users/ferdylim/Workspace/palu-dev-house/public/images/ferdy.webp",
        extension: ".webp",
        size: 81920,
        sizeFormatted: "80 KB",
        category: "images",
        mimeType: "image/webp",
        lastModified: now,
      },
      {
        id: "asset_logo_primary",
        name: "Primary Logo",
        filename: "logo-primary.svg",
        path: "/images/logo-primary.svg",
        fullPath: "/Users/ferdylim/Workspace/palu-dev-house/public/images/logo-primary.svg",
        extension: ".svg",
        size: 4096,
        sizeFormatted: "4 KB",
        category: "icons",
        mimeType: "image/svg+xml",
        lastModified: now,
      },
      {
        id: "asset_placeholder",
        name: "Placeholder Image",
        filename: "placeholder.webp",
        path: "/images/placeholder.webp",
        fullPath: "/Users/ferdylim/Workspace/palu-dev-house/public/images/placeholder.webp",
        extension: ".webp",
        size: 16384,
        sizeFormatted: "16 KB",
        category: "images",
        mimeType: "image/webp",
        lastModified: now,
      },
    ];

    sampleAssets.forEach((asset) =>
      insertAsset.run(
        asset.id,
        asset.name,
        asset.filename,
        asset.path,
        asset.fullPath,
        asset.extension,
        asset.size,
        asset.sizeFormatted,
        asset.category,
        asset.mimeType,
        asset.lastModified,
        now,
        now,
      ),
    );

    console.log("✅ Database seeded with sample assets");
  }
}
