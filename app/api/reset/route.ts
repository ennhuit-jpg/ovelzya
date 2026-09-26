import { NextResponse } from 'next/server';
import { resetStore } from '@/lib/storage';

export async function POST() {
  const store = resetStore();
  return NextResponse.json({ success: true, message: 'Store reset to defaults', store });
}
