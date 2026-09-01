import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/auth';

const MAX_FIELD_LENGTH = 500;
const VALID_STATUSES = ['new', 'contacted', 'in-progress', 'converted', 'closed'];

function sanitize(str: string, maxLen: number): string {
  return str.trim().slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 submissions per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { allowed } = rateLimit(`contact:${ip}`, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Sanitize and validate lengths
    const cleanName = sanitize(String(name), MAX_FIELD_LENGTH);
    const cleanEmail = sanitize(String(email), 255);
    const cleanMessage = sanitize(String(message), 5000);
    const cleanPhone = body.phone ? sanitize(String(body.phone), 30) : null;
    const cleanCompany = body.company ? sanitize(String(body.company), MAX_FIELD_LENGTH) : null;
    const cleanService = body.service ? sanitize(String(body.service), 100) : null;

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        { error: 'All required fields must have content' },
        { status: 400 }
      );
    }

    const inquiry = await db.contactInquiry.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        company: cleanCompany,
        service: cleanService,
        message: cleanMessage,
        status: 'new',
      },
    });

    // Return only safe fields (no internal ID in public response)
    return NextResponse.json(
      { data: { id: inquiry.id, status: inquiry.status } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}
