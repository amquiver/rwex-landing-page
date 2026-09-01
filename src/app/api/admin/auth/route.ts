import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createSessionCookie, deleteSessionCookie, rateLimit, verifySessionToken } from '@/lib/auth';

// Verify an existing session (cookie-based)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    const user = await db.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    const { password: _pwd, ...userWithoutPassword } = user;
    return NextResponse.json({ data: userWithoutPassword });
  } catch {
    return NextResponse.json({ error: 'Authentication check failed' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Rate limit: 10 attempts per 15 minutes per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { allowed, retryAfterMs } = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Reject if no password is set — force password setup
    if (!user.password) {
      return NextResponse.json(
        { error: 'Account not configured. Contact system administrator.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const sessionCookie = await createSessionCookie(user.id);

    const { password: _pwd, ...userWithoutPassword } = user;

    const response = NextResponse.json({ data: userWithoutPassword }, { status: 200 });
    response.cookies.set(sessionCookie.name, sessionCookie.value, {
      httpOnly: sessionCookie.httpOnly,
      secure: sessionCookie.secure,
      sameSite: sessionCookie.sameSite,
      path: sessionCookie.path,
      maxAge: sessionCookie.maxAge,
    });

    return response;
  } catch (error) {
    console.error('Error during auth:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookie = deleteSessionCookie();
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
  return response;
}
