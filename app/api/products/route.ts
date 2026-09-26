import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/storage';
import { Product } from '@/lib/types';

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = readStore();

    // Generate new ID
    const maxId = store.products.reduce((max, p) => Math.max(max, p.id), 0);
    const newProduct: Product = {
      id: maxId + 1,
      name: body.name || 'Nouveau bijou',
      name_ar: body.name_ar || body.name || 'مجوهرة جديدة',
      cat: body.cat || 'Colliers',
      cat_ar: body.cat_ar || 'قلادات',
      price: Number(body.price) || 890,
      badge: body.badge || '',
      badge_ar: body.badge_ar || '',
      rating: Number(body.rating) || 5.0,
      reviews: Number(body.reviews) || 1,
      img: body.img || '',
      images: Array.isArray(body.images) ? body.images : (body.img ? [body.img] : []),
      video: body.video || '',
      seed: body.seed || `bijou-${Date.now()}`,
      desc: body.desc || "Pièce d'exception façonnée en atelier.",
      desc_ar: body.desc_ar || "قطعة استثنائية مصنوعة في الورشة بدقة.",
      specs: body.specs || [["Matériau", "Acier 316L"], ["Plaquage", "Or 18K — PVD"]],
      specs_ar: body.specs_ar || [["المادة", "فولاذ 316L"], ["الطلاء", "ذهب 18K — PVD"]],
      inStock: body.inStock !== false,
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      sku: body.sku || `MD-COL-${maxId + 1}`,
      barcode: body.barcode || `6111000${String(maxId + 1).padStart(4, '0')}7`,
    };

    store.products.unshift(newProduct);
    writeStore(store);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const store = readStore();

    if (body.reorder && Array.isArray(body.products)) {
      store.products = body.products;
      writeStore(store);
      return NextResponse.json({ success: true, products: store.products });
    }

    const updated: Product = body;
    const idx = store.products.findIndex((p) => p.id === updated.id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    store.products[idx] = {
      ...store.products[idx],
      ...updated,
      price: Number(updated.price),
    };
    writeStore(store);

    return NextResponse.json(store.products[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const store = readStore();
    if (Array.isArray(body.reorderedProducts)) {
      store.products = body.reorderedProducts;
      writeStore(store);
      return NextResponse.json({ success: true, count: store.products.length });
    }
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const store = readStore();
    store.products = store.products.filter((p) => p.id !== id);
    // Also remove from flash if present
    store.flash = store.flash.filter((f) => f.id !== id);
    writeStore(store);

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
