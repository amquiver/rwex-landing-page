import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [inquiries, total] = await Promise.all([
      db.contactInquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.contactInquiry.count({ where }),
    ]);

    return NextResponse.json({
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array is required' },
        { status: 400 }
      );
    }

    if (!status || !['new', 'contacted', 'in-progress', 'converted', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const result = await db.contactInquiry.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });

    return NextResponse.json({
      data: { updated: result.count },
    });
  } catch (error) {
    console.error('Error updating inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiries' },
      { status: 500 }
    );
  }
}
