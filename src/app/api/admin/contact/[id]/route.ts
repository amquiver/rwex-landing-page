import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const VALID_STATUSES = new Set([
  'new',
  'contacted',
  'in-progress',
  'converted',
  'closed',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    const { name, email, phone, company, service, budget, message, status } = body;

    // Validate email if provided
    if (email !== undefined && email !== null && !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status !== undefined && !VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${[...VALID_STATUSES].join(', ')}` },
        { status: 400 }
      );
    }

    const inquiry = await db.contactInquiry.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).slice(0, 500) }),
        ...(email !== undefined && { email: String(email).slice(0, 255) }),
        ...(phone !== undefined && { phone: phone ? String(phone).slice(0, 30) : null }),
        ...(company !== undefined && { company: company ? String(company).slice(0, 500) : null }),
        ...(service !== undefined && { service: service ? String(service).slice(0, 100) : null }),
        ...(budget !== undefined && { budget: budget ? String(budget).slice(0, 100) : null }),
        ...(message !== undefined && { message: String(message).slice(0, 5000) }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ data: inquiry });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
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

    const existing = await db.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    await db.contactInquiry.delete({ where: { id } });

    return NextResponse.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
