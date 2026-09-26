import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/storage';
import { SiteContent } from '@/lib/types';

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.content);
}

export async function PUT(req: NextRequest) {
  try {
    const updatedContent: Partial<SiteContent> = await req.json();
    const store = readStore();

    store.content = {
      ...store.content,
      ...updatedContent,
      settings: {
        ...store.content.settings,
        ...(updatedContent.settings || {}),
      },
      hero: {
        ...store.content.hero,
        ...(updatedContent.hero || {}),
      },
      marquee: {
        ...store.content.marquee,
        ...(updatedContent.marquee || {}),
      },
      craft: {
        ...store.content.craft,
        ...(updatedContent.craft || {}),
      },
      flashBanner: {
        ...store.content.flashBanner,
        ...(updatedContent.flashBanner || {}),
      },
    };

    writeStore(store);
    return NextResponse.json(store.content);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
