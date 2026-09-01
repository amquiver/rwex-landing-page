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
    const search = searchParams.get('search')?.trim();

    const where: Record<string, unknown> = {};
    if (search) {
      where.title = { contains: search };
    }

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            select: { id: true, url: true, alt: true },
          },
          _count: { select: { images: true } },
        },
      }),
      db.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug: providedSlug, description, challenge, solution, results, category, clientName, clientUrl, technologies, coverImage, isFeatured, isPublished, images } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const slug = providedSlug || generateSlug(title);

    // Check slug uniqueness
    const existing = await db.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      );
    }

    const project = await db.project.create({
      data: {
        title,
        slug,
        description: description || null,
        challenge: challenge || null,
        solution: solution || null,
        results: results || null,
        category: category || 'web',
        clientName: clientName || null,
        clientUrl: clientUrl || null,
        technologies: technologies || null,
        coverImage: coverImage || null,
        isFeatured: isFeatured ?? false,
        isPublished: isPublished ?? true,
        images: images
          ? {
              create: (images as Array<{ url: string; alt?: string }>).map((img) => ({
                url: img.url,
                alt: img.alt || null,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
