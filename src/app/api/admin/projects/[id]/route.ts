import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check uniqueness
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.project.findUnique({ where: { slug: body.slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: 'A project with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const { title, slug, description, challenge, solution, results, category, clientName, clientUrl, technologies, coverImage, isFeatured, isPublished } = body;

    const project = await db.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(challenge !== undefined && { challenge }),
        ...(solution !== undefined && { solution }),
        ...(results !== undefined && { results }),
        ...(category !== undefined && { category }),
        ...(clientName !== undefined && { clientName }),
        ...(clientUrl !== undefined && { clientUrl }),
        ...(technologies !== undefined && { technologies }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: { images: true },
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
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

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete images first (or rely on cascade)
    await db.projectImage.deleteMany({ where: { projectId: id } });
    await db.project.delete({ where: { id } });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
