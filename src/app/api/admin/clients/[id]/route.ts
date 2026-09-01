import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const { name, logo, website, industry, isVisible } = body;

    const client = await db.client.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(logo !== undefined && { logo }),
        ...(website !== undefined && { website }),
        ...(industry !== undefined && { industry }),
        ...(isVisible !== undefined && { isVisible }),
      },
    });

    return NextResponse.json({ data: client });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
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

    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    await db.client.delete({ where: { id } });

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
