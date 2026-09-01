import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
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
          _count: { select: { tags: true } },
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
    console.error('Error fetching admin blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug: providedSlug,
      excerpt,
      content,
      coverImage,
      author,
      readingTime,
      seoTitle,
      seoDescription,
      status,
      isFeatured,
      categoryIds,
      tagIds,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const slug = providedSlug || generateSlug(title);

    // Check slug uniqueness
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 409 }
      );
    }

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        author: author || null,
        readingTime: readingTime || 5,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        status: status || 'draft',
        isFeatured: isFeatured ?? false,
        categories: categoryIds
          ? {
              connect: (categoryIds as string[]).map((id) => ({ id })),
            }
          : undefined,
        tags: tagIds
          ? {
              create: (tagIds as string[]).map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        categories: { select: { id: true, name: true, slug: true } },
        tags: {
          select: { tag: { select: { id: true, name: true, slug: true } } },
        },
      },
    });

    const formattedPost = {
      ...post,
      categories: post.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      tags: post.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, slug: t.tag.slug })),
    };

    return NextResponse.json({ data: formattedPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
