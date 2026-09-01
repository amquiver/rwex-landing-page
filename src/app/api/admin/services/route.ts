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

export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug: providedSlug, description, icon, highlights, ctaText, sortOrder, isPublished } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const slug = providedSlug || generateSlug(title);

    // Check slug uniqueness
    const existing = await db.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 409 }
      );
    }

    const service = await db.service.create({
      data: {
        title,
        slug,
        description: description || null,
        icon: icon || null,
        highlights: highlights ? JSON.stringify(highlights) : null,
        ctaText: ctaText || null,
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ data: service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
