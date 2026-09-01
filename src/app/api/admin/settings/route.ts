import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ALLOWED_SETTING_KEYS = new Set([
  'company_name',
  'email',
  'phone',
  'whatsapp',
  'address',
  'instagram',
  'linkedin',
  'github',
  'facebook',
  'twitter',
  'x',
  'footer_text',
  'hero_title',
  'hero_subtitle',
  'hero_cta',
  'about_text',
]);

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();

    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    return NextResponse.json({ data: settingsMap });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || !Array.isArray(settings) || settings.length === 0) {
      return NextResponse.json(
        { error: 'settings array is required' },
        { status: 400 }
      );
    }

    // Validate all keys against allowlist
    for (const item of settings) {
      if (!item.key || typeof item.key !== 'string') {
        return NextResponse.json(
          { error: 'Each setting must have a string key' },
          { status: 400 }
        );
      }
      if (!ALLOWED_SETTING_KEYS.has(item.key)) {
        return NextResponse.json(
          { error: `Invalid setting key: ${item.key}` },
          { status: 400 }
        );
      }
      if (typeof item.value !== 'string') {
        return NextResponse.json(
          { error: `Setting value for "${item.key}" must be a string` },
          { status: 400 }
        );
      }
    }

    // Block prototype pollution keys
    const blockedKeys = ['__proto__', 'constructor', 'prototype'];
    for (const item of settings) {
      if (blockedKeys.includes(item.key)) {
        return NextResponse.json(
          { error: 'Invalid setting key' },
          { status: 400 }
        );
      }
    }

    const results = await Promise.all(
      settings.map(async (item: { key: string; value: string }) => {
        return db.siteSetting.upsert({
          where: { key: item.key },
          update: { value: item.value.slice(0, 2000) },
          create: { key: item.key, value: item.value.slice(0, 2000) },
        });
      })
    );

    const updated = results.filter(Boolean);

    return NextResponse.json({
      data: { updated: updated.length },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
