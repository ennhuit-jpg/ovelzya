import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/storage';
import { FlashSaleItem } from '@/lib/types';

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.flash);
}

export async function PUT(req: NextRequest) {
  try {
    const flashList: FlashSaleItem[] = await req.json();
    const store = readStore();
    store.flash = flashList;
    writeStore(store);
    return NextResponse.json(store.flash);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
