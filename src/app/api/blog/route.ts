import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoriesOnly = searchParams.get('categories') === 'true';
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category')?.trim();
    const tag = searchParams.get('tag')?.trim();
    const featured = searchParams.get('featured');
    const exclude = searchParams.get('exclude');

    // Return categories list
    if (categoriesOnly) {
      const categories = await db.blogCategory.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { posts: { where: { status: 'published' } } },
          },
        },
      });
      return NextResponse.json({
        data: categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          postCount: c._count.posts,
        })),
      });
    }

    // PUBLIC endpoint: always filter to published only
    // The `status` query param is intentionally ignored to prevent data leakage
    const where: Record<string, unknown> = { status: 'published' };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    if (category) {
      where.categories = { some: { slug: category } };
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    if (exclude) {
      where.id = { not: exclude };
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          categories: {
            select: { id: true, name: true, slug: true },
          },
          tags: {
            select: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      }),
      db.blogPost.count({ where }),
    ]);

    const formattedPosts = posts.map((post) => ({
      ...post,
      categories: post.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      tags: post.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, slug: t.tag.slug })),
    }));

    return NextResponse.json({
      data: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
