import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const published = searchParams.get('published') !== 'false';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const search = searchParams.get('search')?.trim();

    const where: Record<string, unknown> = {};

    if (published) {
      where.isPublished = true;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (category) {
      where.category = category;
    }

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
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
