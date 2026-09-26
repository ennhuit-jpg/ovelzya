'use client';

import React, { useSyncExternalStore } from 'react';
import { Home, Sparkles, Heart, ShoppingBag, MessageCircle } from 'lucide-react';
import { TRANSLATIONS } from '@/lib/translations';
import { Language } from '@/lib/types';

const emptySubscribe = () => () => {};

interface MobileBottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  waNumber: string;
  lang: Language;
}

export default function MobileBottomNav({
  activeView,
  setActiveView,
  cartCount,
  wishlistCount,
  openCart,
  waNumber,
  lang,
}: MobileBottomNavProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // If in admin dashboard, hide bottom navigation bar so admin controls have full viewport
  if (activeView === 'admin') return null;

  const displayCartCount = isMounted ? cartCount : 0;
  const displayWishlistCount = isMounted ? wishlistCount : 0;
  const t = (k: string) => TRANSLATIONS[lang]?.[k] || k;

  return (
    <nav
      aria-label="Navigation mobile rapide"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-[rgba(212,175,55,0.25)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Accueil */}
        <button
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition ${
            activeView === 'home'
              ? 'text-[#d4af37]'
              : 'text-[#9a958a] hover:text-[#f4f1ea]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-wider">
            {lang === 'en' ? 'Home' : (lang === 'ar' ? 'الرئيسية' : 'Accueil')}
          </span>
        </button>

        {/* 2. Collection */}
        <button
          onClick={() => {
            setActiveView('collection');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition ${
            activeView === 'collection'
              ? 'text-[#d4af37]'
              : 'text-[#9a958a] hover:text-[#f4f1ea]'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-wider">
            {lang === 'en' ? 'Jewelry' : (lang === 'ar' ? 'المجموعات' : 'Bijoux')}
          </span>
        </button>

        {/* 3. Wishlist */}
        <button
          onClick={() => {
            setActiveView('wishlist');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition ${
            activeView === 'wishlist'
              ? 'text-[#d4af37]'
              : 'text-[#9a958a] hover:text-[#f4f1ea]'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {displayWishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#d4af37] text-black text-[9px] font-bold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5">
                {displayWishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-wider">
            {lang === 'en' ? 'Wishlist' : (lang === 'ar' ? 'المفضلة' : 'Favoris')}
          </span>
        </button>

        {/* 4. Panier */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[#9a958a] hover:text-[#d4af37] transition"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {displayCartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#d4af37] text-black text-[9px] font-bold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5">
                {displayCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-wider">
            {lang === 'en' ? 'Cart' : (lang === 'ar' ? 'السلة' : 'Panier')}
          </span>
        </button>

        {/* 5. WhatsApp Conciergerie */}
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
            lang === 'en'
              ? 'Hello Maison Ovelzya ✦ I would like to speak with customer support.'
              : (lang === 'ar'
              ? 'مرحباً دار أوفيلزيا ✦ أريد التواصل مع خدمة العملاء.'
              : 'Bonjour Maison Ovelzya ✦ Je souhaite échanger avec la conciergerie.')
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-emerald-400 hover:text-emerald-300 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-wider text-emerald-400">
            WhatsApp
          </span>
        </a>
      </div>
    </nav>
  );
}
