import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await db.blogPost.findUnique({
      where: { slug },
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
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const formattedPost = {
      ...post,
      categories: post.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      tags: post.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, slug: t.tag.slug })),
    };

    return NextResponse.json({ data: formattedPost });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
