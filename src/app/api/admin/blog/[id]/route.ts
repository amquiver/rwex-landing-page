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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await db.blogPost.findUnique({
      where: { id },
      include: {
        categories: { select: { id: true, name: true, slug: true } },
        tags: {
          select: { tag: { select: { id: true, name: true, slug: true } } },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check uniqueness
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.blogPost.findUnique({ where: { slug: body.slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const {
      title,
      slug,
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

    // Handle tag connections: delete old, create new
    if (tagIds !== undefined) {
      await db.blogPostTag.deleteMany({ where: { postId: id } });
    }

    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(author !== undefined && { author }),
        ...(readingTime !== undefined && { readingTime }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(status !== undefined && { status }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(categoryIds !== undefined && {
          categories: {
            set: [],
            connect: (categoryIds as string[]).map((cid) => ({ id: cid })),
          },
        }),
        ...(tagIds !== undefined && {
          tags: {
            create: (tagIds as string[]).map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
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

    return NextResponse.json({ data: formattedPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await db.blogPost.delete({ where: { id } });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
