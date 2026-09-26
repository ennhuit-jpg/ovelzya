'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product, Language } from '@/lib/types';
import { ShoppingBag, X } from 'lucide-react';

interface SocialProofNotificationProps {
  products: Product[];
  lang: Language;
  intervalSec?: number;
  onSelectProduct: (productId: number) => void;
}

const BUYERS = [
  { name: 'Sarah B.', city: 'Casablanca (Anfa)', time_fr: 'il y a 4 min', time_ar: 'منذ 4 دقائق' },
  { name: 'Kawtar M.', city: 'Rabat (Agdal)', time_fr: 'il y a 9 min', time_ar: 'منذ 9 دقائق' },
  { name: 'Meryem T.', city: 'Marrakech (Guéliz)', time_fr: 'il y a 14 min', time_ar: 'منذ 14 دقيقة' },
  { name: 'Zineb C.', city: 'Tanger (Malabata)', time_fr: 'il y a 2 min', time_ar: 'منذ دقيقتين' },
  { name: 'Houda E.', city: 'Fès', time_fr: 'il y a 18 min', time_ar: 'منذ 18 دقيقة' },
  { name: 'Sofia L.', city: 'Casablanca (Gauthier)', time_fr: 'il y a 6 min', time_ar: 'منذ 6 دقائق' },
  { name: 'Nadia K.', city: 'Agadir', time_fr: 'il y a 11 min', time_ar: 'منذ 11 دقيقة' },
  { name: 'Ghita A.', city: 'Kénitra', time_fr: 'il y a 23 min', time_ar: 'منذ 23 دقيقة' },
];

export default function SocialProofNotification({
  products,
  lang,
  intervalSec = 15,
  onSelectProduct,
}: SocialProofNotificationProps) {
  const [currentNotification, setCurrentNotification] = useState<{
    product: Product;
    buyer: typeof BUYERS[0];
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);

  const triggerNotification = useCallback(() => {
    if (isDismissedByUser || !products || products.length === 0) return;

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomBuyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];

    setCurrentNotification({
      product: randomProduct,
      buyer: randomBuyer,
    });
    setIsVisible(true);

    // Hide after 5.5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5500);

    return hideTimer;
  }, [isDismissedByUser, products]);

  useEffect(() => {
    if (isDismissedByUser || !products || products.length === 0) return;

    // Show initial notification after 6 seconds
    const initialTimer = setTimeout(() => {
      triggerNotification();
    }, 6000);

    // Repeat every intervalSec
    const interval = setInterval(() => {
      triggerNotification();
    }, Math.max(8, intervalSec) * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [products, intervalSec, isDismissedByUser, triggerNotification]);

  if (!currentNotification || isDismissedByUser) return null;

  const { product, buyer } = currentNotification;
  const prodName = lang === 'ar' ? product.name_ar || product.name : product.name;
  const prodImg = product.img || `https://picsum.photos/seed/${product.seed}/100/100`;

  return (
    <div
      className={`fixed z-40 bottom-20 sm:bottom-6 ${
        lang === 'ar' ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
      } max-w-xs sm:max-w-sm transition-all duration-500 transform ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        onClick={() => {
          onSelectProduct(product.id);
          setIsVisible(false);
        }}
        className="bg-[#121212]/95 backdrop-blur-md border border-[#d4af37]/35 hover:border-[#d4af37] p-3 rounded-lg shadow-2xl shadow-black/80 flex items-center gap-3 cursor-pointer group transition duration-300"
      >
        {/* Product Thumbnail */}
        <div className="relative w-12 h-14 bg-[#1e1e1e] rounded overflow-hidden shrink-0 border border-[#333] group-hover:border-[#d4af37]/50 transition">
          <img
            src={prodImg}
            alt={prodName}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.seed}/100/100`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#d4af37] rounded-full flex items-center justify-center text-black">
            <ShoppingBag className="w-2.5 h-2.5 fill-current" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9a958a]">
            <span className="font-semibold text-white truncate">{buyer.name}</span>
            <span>·</span>
            <span className="truncate">{buyer.city}</span>
          </div>

          <p className="text-xs text-white font-medium truncate mt-0.5 group-hover:text-[#d4af37] transition">
            {lang === 'ar' ? `اشترت للتو: ${prodName}` : `A commandé : ${prodName}`}
          </p>

          <div className="flex items-center justify-between text-[10px] text-[#777] mt-1">
            <span>{lang === 'ar' ? buyer.time_ar : buyer.time_fr}</span>
            <span className="text-[#d4af37] font-semibold">{product.price} DH</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setIsDismissedByUser(true);
          }}
          className="text-[#666] hover:text-white p-1 transition shrink-0"
          title="Fermer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
