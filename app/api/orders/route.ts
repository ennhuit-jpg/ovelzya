import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/storage';
import { Order, OrderStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  const store = readStore();
  const { searchParams } = new URL(req.url);
  const num = searchParams.get('num');

  if (num) {
    const found = store.orders.find((o) => o.num.toUpperCase() === num.trim().toUpperCase());
    if (!found) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(found);
  }

  return NextResponse.json(store.orders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = readStore();

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      num: body.num || `MD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: body.items || [],
      sub: Number(body.sub) || 0,
      disc: Number(body.disc) || 0,
      ship: Number(body.ship) || 0,
      cod: Number(body.cod) || 0,
      total: Number(body.total) || 0,
      payMethod: body.payMethod || 'Paiement à la livraison',
      email: body.email || '',
      name: body.name || '',
      phone: body.phone || '',
      street: body.street || '',
      city: body.city || '',
      status: 'reçue',
    };

    store.orders.unshift(newOrder);
    writeStore(store);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status }: { id: string; status: OrderStatus } = await req.json();
    const store = readStore();
    const order = store.orders.find((o) => o.id === id || o.num === id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    order.status = status;
    writeStore(store);

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }
    const store = readStore();
    store.orders = store.orders.filter((o) => o.id !== id && o.num !== id);
    writeStore(store);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

