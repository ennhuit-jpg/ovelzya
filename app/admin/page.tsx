'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';
import {
  Product,
  Order,
  ContactMessage,
  SiteContent,
  FlashSaleItem,
  OrderStatus,
  Language,
} from '@/lib/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_FLASH,
  INITIAL_CONTENT,
  INITIAL_ORDERS,
  INITIAL_CONTACTS,
} from '@/lib/initialData';

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [flash, setFlash] = useState<FlashSaleItem[]>(INITIAL_FLASH);
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [contacts, setContacts] = useState<ContactMessage[]>(INITIAL_CONTACTS);
  const [lang, setLang] = useState<Language>('fr');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          if (data.products) setProducts(data.products);
          if (data.flash) setFlash(data.flash);
          if (data.content) setContent(data.content);
        }

        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (Array.isArray(ordData)) setOrders(ordData);
        }

        const msgRes = await fetch('/api/contact');
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          if (Array.isArray(msgData)) setContacts(msgData);
        }
      } catch (err) {
        console.warn('Fallback to initial state in admin:', err);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProduct = async (updated: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      }
    } catch (e) {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  const handleCreateProduct = async (newProd: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
      }
    } catch (e) {
      const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
      const fallback = { ...newProd, id: maxId + 1 } as Product;
      setProducts((prev) => [fallback, ...prev]);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFlash((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleUpdateContent = async (updatedContent: Partial<SiteContent>) => {
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (e) {
      setContent((prev) => ({
        ...prev,
        ...updatedContent,
        settings: { ...prev.settings, ...(updatedContent.settings || {}) },
      }));
    }
  };

  const handleUpdateFlash = async (updatedFlash: FlashSaleItem[]) => {
    try {
      const res = await fetch('/api/flash', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFlash),
      });
      if (res.ok) {
        const data = await res.json();
        setFlash(data);
      }
    } catch (e) {
      setFlash(updatedFlash);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      }
    } catch (e) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }
  };

  const handleMarkContactRead = async (id: string, read: boolean) => {
    try {
      await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read }),
      });
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read } : c)));
    } catch (e) {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read } : c)));
    }
  };

  const handleResetData = async () => {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les données aux valeurs de démonstration ?')) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.store.products);
          setFlash(data.store.flash);
          setContent(data.store.content);
          setOrders(data.store.orders);
          setContacts(data.store.contacts);
          showToast('Données réinitialisées avec succès ✦');
        }
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
        setFlash(INITIAL_FLASH);
        setContent(INITIAL_CONTENT);
        setOrders(INITIAL_ORDERS);
        setContacts(INITIAL_CONTACTS);
        showToast('Données réinitialisées localement ✦');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f4f1ea]">
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#d4af37] text-black font-semibold text-xs sm:text-sm px-5 py-3 rounded shadow-2xl animate-toast">
          {toastMsg}
        </div>
      )}

      <AdminDashboard
        products={products}
        content={content}
        orders={orders}
        contacts={contacts}
        flash={flash}
        lang={lang}
        onUpdateProduct={handleUpdateProduct}
        onCreateProduct={handleCreateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateContent={handleUpdateContent}
        onUpdateFlash={handleUpdateFlash}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onMarkContactRead={handleMarkContactRead}
        onResetData={handleResetData}
        onCloseAdmin={() => router.push('/')}
        showToast={showToast}
      />
    </div>
  );
}
