'use client';

import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { Product, Language } from '@/lib/types';
import { getProductLocalized } from '@/lib/productTranslations';

interface WishlistViewProps {
  wishlist: number[];
  products: Product[];
  onAddToCart: (productId: number, qty: number) => void;
  onRemoveFromWishlist: (productId: number) => void;
  onClearWishlist?: () => void;
  onViewProduct: (productId: number) => void;
  onExploreCollection: () => void;
  lang?: Language;
}

export default function WishlistView({
  wishlist,
  products,
  onAddToCart,
  onRemoveFromWishlist,
  onClearWishlist,
  onViewProduct,
  onExploreCollection,
  lang = 'fr',
}: WishlistViewProps) {
  const isAr = lang === 'ar';
  const isEn = lang === 'en';
  const wishItems = products.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    wishItems.forEach((item) => {
      onAddToCart(item.id, 1);
    });
  };

  return (
    <section className="wrap py-12 sm:py-16 min-h-[70vh]">
      {/* Header Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(212,175,55,0.25)] pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#d4af37] block font-semibold mb-1">
            {isEn ? 'Private Selection' : (isAr ? 'المختارات الخاصة' : 'Sélection Privée')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-semibold tracking-tight">
            {isEn ? 'My Wishlist' : (isAr ? 'قائمة الرغبات والمفضلة' : 'Ma Liste de Souhaits')}
          </h1>
          <p className="text-sm text-[#9a958a] mt-2 max-w-xl">
            {isEn
              ? 'Find all your favorite pieces in 316L stainless steel and 18K PVD gold, ready to join your luxury box.'
              : (isAr
              ? 'قطعتك المفضلة من الفولاذ الجراحي 316L المطلي بالذهب 18 قيراط بتقنية PVD المحفوظة للشراء لاحقاً.'
              : 'Retrouvez toutes vos pièces favorites en acier chirurgical 316L et or 18K PVD, prêtes à rejoindre votre écrin.')}
          </p>
        </div>

        {wishItems.length > 0 && (
          <div className="flex items-center gap-3">
            {onClearWishlist && (
              <button
                onClick={onClearWishlist}
                className="px-4 py-2.5 rounded border border-[#333] hover:border-red-800 text-xs text-[#9a958a] hover:text-red-400 uppercase tracking-wider transition cursor-pointer"
              >
                {isEn ? 'Clear all' : (isAr ? 'تفريغ القائمة' : 'Tout effacer')}
              </button>
            )}

            <button
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isEn ? 'Add all to cart' : (isAr ? 'إضافة الكل إلى السلة' : 'Tout ajouter au panier')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {wishItems.length === 0 ? (
        <div className="text-center py-20 px-4 max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#161616] border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37] shadow-inner">
            <Heart className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-white font-semibold">
              {isEn ? 'Your wishlist is empty' : (isAr ? 'قائمة الرغبات فارغة' : 'Votre liste de souhaits est vide')}
            </h2>
            <p className="text-sm text-[#9a958a] leading-relaxed">
              {isEn
                ? 'Explore our fine jewelry collection and tap the heart icon to save your favorites.'
                : (isAr
                ? 'تصفح تشكيلتنا من المجوهرات الراقية واضغط على رمز القلب لحفظ القطع التي تنال إعجابك.'
                : 'Parcourez nos collections et cliquez sur le cœur pour conserver vos bijoux coup de cœur.')}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onExploreCollection}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.16em] rounded transition cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              <span>{isEn ? 'Explore the Collection' : (isAr ? 'اكتشاف التشكيلة' : 'Découvrir la Collection')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Items Grid */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#9a958a]">
            <span>
              {wishItems.length}{' '}
              {wishItems.length === 1
                ? (isEn ? 'saved jewel' : (isAr ? 'قطعة محفوظة' : 'bijou sauvegardé'))
                : (isEn ? 'saved jewels' : (isAr ? 'قطع محفوظة' : 'bijoux sauvegardés'))}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? '2-Year Warranty & Complimentary Ovelzya Signature Box'
                  : (isAr
                  ? 'ضمان سنتين وعلبة أوفيلزيا الفاخرة مهداة'
                  : 'Garantie 2 ans & Écrin Signature Ovelzya offert')}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishItems.map((product) => {
              const loc = getProductLocalized(product, lang);
              const name = loc.name;
              const cat = loc.cat;
              const badge = loc.badge;
              const sku = product.sku || `OV-${product.id}`;

              return (
                <div
                  key={product.id}
                  className="group bg-[#141414] border border-[#262626] hover:border-[#d4af37]/60 rounded-lg overflow-hidden transition duration-300 flex flex-col justify-between shadow-lg"
                >
                  {/* Image & Badges */}
                  <div
                    onClick={() => onViewProduct(product.id)}
                    className="relative aspect-[4/3] bg-[#1a1a1a] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.img || `https://picsum.photos/seed/${product.seed}/600/600`}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {badge && (
                      <span className="absolute top-3 left-3 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
                        {badge}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWishlist(product.id);
                      }}
                      title={isEn ? 'Remove from wishlist' : (isAr ? 'حذف من المفضلة' : 'Retirer de la liste')}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-red-950/80 text-[#ccc] hover:text-red-400 border border-white/10 hover:border-red-600 transition flex items-center justify-center cursor-pointer shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#9a958a] mb-1">
                        <span className="uppercase tracking-wider font-medium">{cat}</span>
                        <span className="font-mono text-[#777] bg-[#1e1e1e] px-2 py-0.5 rounded">
                          SKU : {sku}
                        </span>
                      </div>

                      <h3
                        onClick={() => onViewProduct(product.id)}
                        className="text-lg font-serif font-semibold text-white hover:text-[#d4af37] transition cursor-pointer"
                      >
                        {name}
                      </h3>

                      <p className="text-xs text-[#888] line-clamp-2 mt-1.5 font-light">
                        {loc.desc}
                      </p>

                      <div className="flex items-center gap-2 mt-3 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {product.stock && product.stock > 0
                            ? (isEn ? `In stock (${product.stock} available)` : (isAr ? `متوفر في المخزون (${product.stock} متوفرة)` : `En stock immédiat (${product.stock} disponibles)`))
                            : (isEn ? 'In stock' : (isAr ? 'متوفر في المخزون' : 'Disponible en stock'))}
                        </span>
                      </div>
                    </div>

                    {/* Price & Cart Actions */}
                    <div className="pt-4 border-t border-[#222] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#777] block">
                          {isEn ? 'Price incl. VAT' : (isAr ? 'السعر مع الضريبة' : 'Prix TTC')}
                        </span>
                        <span className="text-xl font-serif text-[#d4af37] font-semibold">
                          {product.price.toLocaleString(isEn ? 'en-US' : 'fr-FR')} DH
                        </span>
                      </div>

                      <button
                        onClick={() => onAddToCart(product.id, 1)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Add to cart' : (isAr ? 'إضافة للسلة' : 'Ajouter')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
