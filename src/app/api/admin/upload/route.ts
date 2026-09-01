import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, resolve, extname } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = resolve(process.cwd(), 'public/uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Strict extension allowlist (SVG removed — XSS risk)
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']);

// MIME type to extension mapping for validation
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

// Magic bytes signatures
const MAGIC_BYTES: Record<string, number[]> = {
  jpg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  gif: [0x47, 0x49, 0x46],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
};

function checkMagicBytes(buf: Buffer, ext: string): boolean {
  const signature = MAGIC_BYTES[ext];
  if (!signature) return true; // unknown type, skip check
  return signature.every((byte, i) => buf[i] === byte);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Determine expected extension from MIME type
    const expectedExt = MIME_TO_EXT[file.type];
    if (!expectedExt) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      );
    }

    // Also validate the file extension from the filename
    const fileExt = extname(file.name).replace('.', '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(fileExt) || fileExt !== expectedExt) {
      return NextResponse.json(
        { error: 'File extension does not match content type' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes to prevent MIME spoofing
    if (!checkMagicBytes(buffer, fileExt)) {
      return NextResponse.json(
        { error: 'File content does not match declared type' },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate UUID-like filename with validated extension only
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const filename = `${timestamp}-${randomStr}.${fileExt}`;

    // Path traversal protection: resolve and verify
    const filepath = resolve(UPLOAD_DIR, filename);
    if (!filepath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json(
      { data: { url: publicUrl, filename, size: file.size, type: file.type } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
