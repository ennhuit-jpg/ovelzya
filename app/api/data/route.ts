import { NextResponse } from 'next/server';
import { readStore } from '@/lib/storage';

export async function GET() {
  const store = readStore();
  return NextResponse.json({
    products: store.products,
    flash: store.flash,
    quotes: store.quotes,
    content: store.content,
  });
}
