import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'rwextech-session-secret-change-in-production-32ch'
);
const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

// ---------- password helpers ----------

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// ---------- jwt helpers ----------

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<{ sub: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { sub: payload.sub as string, role: payload.role as string };
  } catch {
    return null;
  }
}

// ---------- cookie helpers ----------

export function getSessionToken(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}

export async function createSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE,
  };
}

export function deleteSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}

// ---------- guard ----------

export async function authenticateRequest(
  request: Request
): Promise<{ userId: string } | null> {
  const token =
    request.headers
      .get('cookie')
      ?.split(';')
      .find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1];

  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  return { userId: payload.sub };
}

// ---------- rate limiter (in-memory) ----------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

// Cleanup stale entries every 5 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now();
      for (const [k, v] of rateLimitMap) {
        if (now > v.resetAt) rateLimitMap.delete(k);
      }
    },
    5 * 60 * 1000
  );
}
