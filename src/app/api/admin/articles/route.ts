import { NextRequest, NextResponse } from "next/server";
import { getDatabase_sync as getDatabase } from "@/lib/database";
import { z } from "zod";

// Schemas
const QuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  sort: z.string().default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

const ArticleCreateSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string(),
  content: z.string(),
  author: z.string(),
  publishedAt: z.string(),
  readTime: z.string(),
  url: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
  image: z.string(),
  slug: z.string(),
});

const ArticleUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  readTime: z.string().optional(),
  url: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  image: z.string().optional(),
});

// Helper functions
function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags);
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// GET - Get all articles or specific article
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const db = getDatabase();

    if (id) {
      const article = db.get("SELECT * FROM articles WHERE id = ?", [id]);
      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 },
        );
      }

      const parsedArticle = {
        ...article,
        tags: parseTags(article.tags),
        featured: Boolean(article.featured),
      };

      return NextResponse.json({
        success: true,
        data: parsedArticle,
      });
    }

    // Handle list view with pagination
    const queryValidation = QuerySchema.safeParse(
      Object.fromEntries(searchParams),
    );
    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    const { page, limit, search, sort, order } = queryValidation.data;

    // Build query
    let query = "SELECT * FROM articles WHERE 1=1";
    const params: unknown[] = [];

    // Add search filter
    if (search) {
      query += " AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Add sorting
    const validSortFields = [
      "title",
      "createdAt",
      "updatedAt",
      "publishedAt",
      "author",
    ];
    const sortField = validSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "asc" ? "ASC" : "DESC";
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Get total count for pagination
    const countQuery = query.replace(
      /SELECT \* FROM/,
      "SELECT COUNT(*) as total FROM",
    );
    const countResult = db.get(countQuery, params) as { total: number };
    const total = countResult.total;

    // Add pagination
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const articles = db.all(query, params) as Article[];

    // Parse JSON fields
    const parsedArticles = articles.map((article) => ({
      ...article,
      tags: parseTags(article.tags),
      featured: Boolean(article.featured),
    }));

    return NextResponse.json({
      success: true,
      data: {
        articles: parsedArticles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bodyValidation = ArticleCreateSchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: bodyValidation.error },
        { status: 400 },
      );
    }

    const articleData = bodyValidation.data;
    const db = getDatabase();

    // Generate unique ID
    const id = generateId();
    const now = new Date().toISOString();

    // Insert article
    const stmt = db.prepare(`
      INSERT INTO articles (
        id, title, excerpt, content, author, publishedAt, readTime,
        url, tags, featured, status, image, slug, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      articleData.title,
      articleData.excerpt,
      articleData.content,
      articleData.author,
      articleData.publishedAt,
      articleData.readTime,
      articleData.url,
      stringifyTags(articleData.tags),
      articleData.featured ? 1 : 0,
      articleData.status,
      articleData.image,
      articleData.slug,
      now,
      now,
    );

    const newArticle = db.get("SELECT * FROM articles WHERE id = ?", [
      id,
    ]) as Article;

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newArticle,
          tags: parseTags(newArticle.tags),
          featured: Boolean(newArticle.featured),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }
}

// PUT - Update article
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const bodyValidation = ArticleUpdateSchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: bodyValidation.error },
        { status: 400 },
      );
    }

    const updateData = bodyValidation.data;
    const db = getDatabase();

    // Check if article exists
    const existingArticle = db.get("SELECT * FROM articles WHERE id = ?", [
      updateData.id,
    ]) as Article;
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: unknown[] = [];

    if (updateData.title !== undefined) {
      updates.push("title = ?");
      params.push(updateData.title);
    }
    if (updateData.excerpt !== undefined) {
      updates.push("excerpt = ?");
      params.push(updateData.excerpt);
    }
    if (updateData.content !== undefined) {
      updates.push("content = ?");
      params.push(updateData.content);
    }
    if (updateData.author !== undefined) {
      updates.push("author = ?");
      params.push(updateData.author);
    }
    if (updateData.publishedAt !== undefined) {
      updates.push("publishedAt = ?");
      params.push(updateData.publishedAt);
    }
    if (updateData.readTime !== undefined) {
      updates.push("readTime = ?");
      params.push(updateData.readTime);
    }
    if (updateData.url !== undefined) {
      updates.push("url = ?");
      params.push(updateData.url);
    }
    if (updateData.tags !== undefined) {
      updates.push("tags = ?");
      params.push(stringifyTags(updateData.tags));
    }
    if (updateData.featured !== undefined) {
      updates.push("featured = ?");
      params.push(updateData.featured ? 1 : 0);
    }
    if (updateData.status !== undefined) {
      updates.push("status = ?");
      params.push(updateData.status);
    }
    if (updateData.image !== undefined) {
      updates.push("image = ?");
      params.push(updateData.image);
    }

    updates.push("updatedAt = ?");
    params.push(new Date().toISOString());
    params.push(updateData.id);

    const updateQuery = `UPDATE articles SET ${updates.join(", ")} WHERE id = ?`;
    db.run(updateQuery, params);

    const updatedArticle = db.get("SELECT * FROM articles WHERE id = ?", [
      updateData.id,
    ]) as Article;

    return NextResponse.json({
      success: true,
      data: {
        ...updatedArticle,
        tags: parseTags(updatedArticle.tags),
        featured: Boolean(updatedArticle.featured),
      },
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 },
    );
  }
}

// DELETE - Delete article
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 },
      );
    }

    const db = getDatabase();

    // Check if article exists
    const existingArticle = db.get("SELECT * FROM articles WHERE id = ?", [
      id,
    ]) as Article;
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Delete article
    db.run("DELETE FROM articles WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  url: string;
  tags: string;
  featured: number;
  status: string;
  image: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
