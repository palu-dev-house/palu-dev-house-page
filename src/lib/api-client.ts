// Server-side data fetching — queries the database directly.
// Safe to use in Server Components and at build time (no HTTP fetch).

import { getDatabase } from "@/lib/database";
import { defaultCopywriting } from "@/lib/copywriting-client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseJSON(value: string | null | undefined, fallback: any = null) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Copywriting
// ---------------------------------------------------------------------------

export async function getCopywritingData() {
  try {
    const db = await getDatabase();

    const rows = await db.all<{
      section: string;
      key: string;
      value: string;
      type: string;
    }>(
      "SELECT section, key, value, type FROM copywriting WHERE isActive = 1 ORDER BY section, order_index",
    );

    if (!rows || rows.length === 0) {
      console.warn("[db] copywriting table is empty — using defaults");
      return defaultCopywriting;
    }

    // Build a nested map: grouped[section][key] = parsed value
    const grouped: Record<string, Record<string, any>> = {};
    for (const row of rows) {
      if (!grouped[row.section]) grouped[row.section] = {};
      grouped[row.section][row.key] =
        row.type === "json" || row.type === "array"
          ? parseJSON(row.value, row.value)
          : row.value;
    }

    const g = grouped;
    const d = defaultCopywriting.landingPage;

    return {
      landingPage: {
        hero: {
          title: g.hero?.title ?? d.hero.title,
          subtitle: g.hero?.subtitle ?? d.hero.subtitle,
          description: g.hero?.description ?? d.hero.description,
          ctaPrimary: g.hero?.ctaPrimary ?? d.hero.ctaPrimary,
          ctaSecondary: g.hero?.ctaSecondary ?? d.hero.ctaSecondary,
          stats: g.hero?.stats ?? d.hero.stats,
        },
        story: {
          title: g.story?.title ?? d.story.title,
          content: g.story?.content ?? d.story.content,
        },
        about: {
          title: g.about?.title ?? d.about.title,
          subtitle: g.about?.subtitle ?? d.about.subtitle,
          origin: {
            title: g.about?.origin_title ?? d.about.origin.title,
            content: g.about?.origin_content ?? d.about.origin.content,
          },
          background: {
            title: g.about?.background_title ?? d.about.background.title,
            content: g.about?.background_content ?? d.about.background.content,
          },
          mission: {
            title: g.about?.mission_title ?? d.about.mission.title,
            content: g.about?.mission_content ?? d.about.mission.content,
          },
        },
        philosophy: {
          title: g.philosophy?.title ?? d.philosophy.title,
          subtitle: g.philosophy?.subtitle ?? d.philosophy.subtitle,
          items: g.philosophy?.items ?? d.philosophy.items,
        },
        focus: {
          title: g.focus?.title ?? d.focus.title,
          subtitle: g.focus?.subtitle ?? d.focus.subtitle,
          items: g.focus?.items ?? d.focus.items,
        },
        founders: {
          title: g.founders?.title ?? d.founders.title,
          subtitle: g.founders?.subtitle ?? d.founders.subtitle,
          items: g.founders?.items ?? d.founders.items,
        },
        projects: {
          title: g.projects?.title ?? d.projects.title,
          subtitle: g.projects?.subtitle ?? d.projects.subtitle,
          viewAll: g.projects?.viewAll ?? d.projects.viewAll,
        },
        articles: {
          title: g.articles?.title ?? d.articles.title,
          subtitle: g.articles?.subtitle ?? d.articles.subtitle,
          viewAll: g.articles?.viewAll ?? d.articles.viewAll,
          medium: g.articles?.medium ?? d.articles.medium,
        },
        contact: {
          title: g.contact?.title ?? d.contact.title,
          subtitle: g.contact?.subtitle ?? d.contact.subtitle,
          email: g.contact?.email ?? d.contact.email,
          phone: g.contact?.phone ?? d.contact.phone,
          location: g.contact?.location ?? d.contact.location,
        },
        footer: d.footer,
        navigation: d.navigation,
      },
      meta: {
        version: 1,
        lastUpdated: new Date().toISOString(),
        updatedBy: "system",
      },
    };
  } catch (err) {
    console.error("[db] getCopywritingData failed:", err);
    return defaultCopywriting;
  }
}

export async function getCopywritingSection(section: string) {
  try {
    const db = await getDatabase();
    const rows = await db.all<{ key: string; value: string; type: string }>(
      "SELECT key, value, type FROM copywriting WHERE section = ? AND isActive = 1 ORDER BY order_index",
      [section],
    );
    const result: Record<string, any> = {};
    for (const row of rows) {
      result[row.key] =
        row.type === "json" || row.type === "array"
          ? parseJSON(row.value, row.value)
          : row.value;
    }
    return result;
  } catch (err) {
    console.error(`[db] getCopywritingSection(${section}) failed:`, err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function getProjectsData() {
  try {
    const db = await getDatabase();
    const rows = await db.all(
      "SELECT * FROM projects WHERE status = ? ORDER BY featured DESC, completedAt DESC",
      ["active"],
    );
    return rows.map(parseProject);
  } catch (err) {
    console.error("[db] getProjectsData failed:", err);
    return [];
  }
}

export async function getFeaturedProjectsData(limit = 6) {
  try {
    const db = await getDatabase();
    const rows = await db.all(
      "SELECT * FROM projects WHERE status = ? AND featured = ? ORDER BY completedAt DESC LIMIT ?",
      ["active", 1, limit],
    );
    return rows.map(parseProject);
  } catch (err) {
    console.error("[db] getFeaturedProjectsData failed:", err);
    return [];
  }
}

export async function getProjectData(slug: string) {
  try {
    const db = await getDatabase();
    const row = await db.get(
      "SELECT * FROM projects WHERE slug = ? AND status = ?",
      [slug, "active"],
    );
    return row ? parseProject(row) : null;
  } catch (err) {
    console.error(`[db] getProjectData(${slug}) failed:`, err);
    return null;
  }
}

export async function getProjectSlugsData() {
  try {
    const db = await getDatabase();
    const rows = await db.all<{ slug: string }>(
      "SELECT slug FROM projects WHERE status = ?",
      ["active"],
    );
    return rows.map((r) => r.slug);
  } catch (err) {
    console.error("[db] getProjectSlugsData failed:", err);
    return [];
  }
}

function parseProject(p: any) {
  return {
    ...p,
    technologies: parseJSON(p.technologies, []),
    images: parseJSON(p.images, []),
    featured: Boolean(p.featured),
  };
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export async function getArticlesData(limit?: number) {
  try {
    const db = await getDatabase();
    const query = limit
      ? "SELECT * FROM articles WHERE status = ? ORDER BY publishedAt DESC LIMIT ?"
      : "SELECT * FROM articles WHERE status = ? ORDER BY publishedAt DESC";
    const params = limit ? ["published", limit] : ["published"];
    const rows = await db.all(query, params);
    return rows.map(parseArticle);
  } catch (err) {
    console.error("[db] getArticlesData failed:", err);
    return [];
  }
}

export async function getFeaturedArticlesData(limit = 6) {
  try {
    const db = await getDatabase();
    const rows = await db.all(
      "SELECT * FROM articles WHERE status = ? AND featured = ? ORDER BY publishedAt DESC LIMIT ?",
      ["published", 1, limit],
    );
    return rows.map(parseArticle);
  } catch (err) {
    console.error("[db] getFeaturedArticlesData failed:", err);
    return [];
  }
}

export async function getArticleData(slug: string) {
  try {
    const db = await getDatabase();
    const row = await db.get(
      "SELECT * FROM articles WHERE slug = ? AND status = ?",
      [slug, "published"],
    );
    return row ? parseArticle(row) : null;
  } catch (err) {
    console.error(`[db] getArticleData(${slug}) failed:`, err);
    return null;
  }
}

export async function getArticleSlugsData() {
  try {
    const db = await getDatabase();
    const rows = await db.all<{ slug: string }>(
      "SELECT slug FROM articles WHERE status = ?",
      ["published"],
    );
    return rows.map((r) => r.slug);
  } catch (err) {
    console.error("[db] getArticleSlugsData failed:", err);
    return [];
  }
}

function parseArticle(a: any) {
  return {
    ...a,
    tags: parseJSON(a.tags, []),
    featured: Boolean(a.featured),
  };
}

// ---------------------------------------------------------------------------
// Founders
// ---------------------------------------------------------------------------

export async function getFoundersData() {
  try {
    const db = await getDatabase();
    const rows = await db.all("SELECT * FROM founders ORDER BY createdAt ASC");
    return rows.map(parseFounder);
  } catch (err) {
    console.error("[db] getFoundersData failed:", err);
    return [];
  }
}

export async function getFounderData(slug: string) {
  try {
    const db = await getDatabase();
    const row = await db.get("SELECT * FROM founders WHERE slug = ?", [slug]);
    return row ? parseFounder(row) : null;
  } catch (err) {
    console.error(`[db] getFounderData(${slug}) failed:`, err);
    return null;
  }
}

function parseFounder(f: any) {
  return {
    ...f,
    background: parseJSON(f.background, []),
    social: parseJSON(f.social, {}),
  };
}
