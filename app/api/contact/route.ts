import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/storage';
import { ContactMessage } from '@/lib/types';

export async function GET(req: NextRequest) {
  const store = readStore();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  // If a specific client is requesting, return their messages
  if (userId || email) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const filtered = store.contacts.filter((c) => {
      const matchUserId = userId && c.userId && c.userId === userId;
      const matchEmail = cleanEmail && c.email && c.email.toLowerCase().trim() === cleanEmail;
      return matchUserId || matchEmail;
    });
    return NextResponse.json(filtered);
  }

  return NextResponse.json(store.contacts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = readStore();

    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      date: new Date().toISOString(),
      name: (body.name || 'Client Maison Ovelzya').trim(),
      email: (body.email || '').trim().toLowerCase(),
      phone: body.phone ? body.phone.trim() : undefined,
      subject: (body.subject || 'Demande Privée').trim(),
      message: (body.message || '').trim(),
      read: false,
      userId: body.userId || undefined,
      orderNumber: body.orderNumber || undefined,
    };

    store.contacts.unshift(newMsg);
    writeStore(store);

    return NextResponse.json({ success: true, ...newMsg }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, read, reply }: { id: string; read?: boolean; reply?: string } = body;
    const store = readStore();
    const msg = store.contacts.find((c) => c.id === id);

    if (!msg) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    }

    if (read !== undefined) {
      msg.read = read;
    }

    if (reply !== undefined) {
      msg.reply = reply.trim();
      msg.repliedAt = new Date().toISOString();
      msg.read = true;
    }

    writeStore(store);
    return NextResponse.json(msg);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing message ID' }, { status: 400 });
    }
    const store = readStore();
    store.contacts = store.contacts.filter((c) => c.id !== id);
    writeStore(store);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

