'use client';

import React, { useMemo } from 'react';
import { TRANSLATIONS } from '@/lib/translations';
import { getProductLocalized } from '@/lib/productTranslations';
import { Product, SalesBoostersConfig, PromotionOfferRule, Language } from '@/lib/types';
import { X, Plus, Minus, Trash2, ArrowRight, Gift } from 'lucide-react';
import ProductCrossSellUpsellSection from './ProductCrossSellUpsellSection';

export interface CartItem {
  id: number;
  qty: number;
  price: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  lang: Language;
  freeShippingThreshold: number;
  boosters?: SalesBoostersConfig;
  isGiftPackaging?: boolean;
  onToggleGift?: (enabled: boolean) => void;
  giftNote?: string;
  onUpdateGiftNote?: (note: string) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  onAddToCart?: (id: number, qty?: number, priceOverride?: number) => void;
  onSelectProduct?: (id: number) => void;
  blurredProductIds?: Record<number, boolean>;
  promotionRules?: PromotionOfferRule[];
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  products,
  lang,
  freeShippingThreshold,
  boosters,
  isGiftPackaging = false,
  onToggleGift,
  giftNote = '',
  onUpdateGiftNote,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  onAddToCart,
  onSelectProduct,
  blurredProductIds = {},
  promotionRules = [],
}: CartDrawerProps) {
  const t = (k: string) => TRANSLATIONS[lang]?.[k] || k;

  const cartProducts = useMemo(() => {
    return cart
      .map((item) => products.find((p) => p.id === item.id))
      .filter(Boolean) as Product[];
  }, [cart, products]);

  const giftPrice = boosters?.giftOptionPrice !== undefined ? boosters.giftOptionPrice : 35;
  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subtotal = itemsTotal + (isGiftPackaging ? giftPrice : 0);
  const remainingForFree = Math.max(0, freeShippingThreshold - itemsTotal);
  const showShippingBar = boosters ? boosters.enableFreeShippingBar : true;
  const showGiftOption = boosters ? boosters.enableGiftOption : true;

  if (!isOpen) return null;

  return (
    <>
      {/* Background Dim Backdrop without blur so the product page stays crisp and legible */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 transition-opacity"
      />

      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 bottom-0 ${
          lang === 'ar' ? 'left-0 border-r' : 'right-0 border-l'
        } z-50 w-full max-w-md bg-[#101010] border-[rgba(212,175,55,0.25)] flex flex-col shadow-2xl transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#222]">
          <h3 className="font-serif text-xl font-semibold text-white tracking-wide">
            {t('cart_title')}
          </h3>
          <button
            onClick={onClose}
            className="text-[#9a958a] hover:text-[#d4af37] p-1 transition cursor-pointer"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Banner (if enabled) */}
        {showShippingBar && (
          <div className="bg-[#151515] border-b border-[#222] px-6 py-3 text-xs">
            {remainingForFree === 0 ? (
              <span className="text-[#d4af37] font-medium flex items-center gap-1.5">
                ✦ {t('cart_free_unlock')}
              </span>
            ) : (
              <span className="text-[#9a958a]">
                {lang === 'en' ? 'Add ' : (lang === 'ar' ? 'أضيفي ' : 'Encore ')}
                <b className="text-[#d4af37] font-semibold">
                  {remainingForFree.toLocaleString('fr-FR')} DH
                </b>
                {' '}{t('cart_need_more')}
              </span>
            )}
            {/* Progress bar */}
            <div className="w-full bg-[#252525] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.min(100, (itemsTotal / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Body Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#1e1e1e]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#9a958a] py-12">
              <span className="text-4xl text-[#d4af37] mb-3">✦</span>
              <p className="font-serif text-lg text-white font-medium">{t('cart_empty')}</p>
              <p className="text-xs text-[#777] mt-1">{t('cart_empty_p')}</p>
            </div>
          ) : (
            cart.map((item) => {
              const p = products.find((x) => x.id === item.id);
              if (!p) return null;
              const loc = getProductLocalized(p, lang);
              const name = loc.name;
              return (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="w-16 h-20 bg-[#161616] border border-[#2a2a2a] rounded overflow-hidden shrink-0">
                    <img
                      src={p.img || `https://picsum.photos/seed/${p.seed}/150/190`}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.seed}/150/190`;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-white truncate">{name}</h4>
                    <span className="text-xs text-[#9a958a] block mt-0.5">
                      {item.price.toLocaleString('fr-FR')} DH
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#2e2e2e] w-max mt-2 rounded">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#cfcbc2] hover:bg-[#d4af37] hover:text-black transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-white">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#cfcbc2] hover:bg-[#d4af37] hover:text-black transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end h-20">
                    <span className="font-serif font-semibold text-[#d4af37] text-sm">
                      {(item.price * item.qty).toLocaleString('fr-FR')} DH
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#777] hover:text-red-400 p-1 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Cross-sell / Upsell for 'cart_add' stage */}
          {cart.length > 0 && onAddToCart && promotionRules.length > 0 && (
            <ProductCrossSellUpsellSection
              cartProducts={cartProducts}
              products={products}
              rules={promotionRules}
              lang={lang}
              onAddToCart={onAddToCart}
              onSelectProduct={(id) => {
                onClose();
                if (onSelectProduct) onSelectProduct(id);
              }}
              blurredProductIds={blurredProductIds}
              enableCrossSell={boosters?.enableCrossSell ?? true}
              enableUpsell={boosters?.enableUpsell ?? true}
              stage="cart_add"
              variant="compact"
            />
          )}
        </div>

        {/* Footer with Subtotal, Gift Option and Checkout CTA */}
        {cart.length > 0 && (
          <div className="border-t border-[#222] bg-[#0c0c0c] p-6 space-y-4">
            {/* Optional Luxury Gift Packaging */}
            {showGiftOption && (
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 text-xs space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftPackaging}
                    onChange={(e) => onToggleGift && onToggleGift(e.target.checked)}
                    className="mt-0.5 accent-[#d4af37] w-4 h-4 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>
                        {lang === 'en'
                          ? `Luxury Jewelry Gift Box & Satin Ribbon (+${giftPrice} DH)`
                          : (lang === 'ar'
                          ? `علبة هدايا فاخرة وبطاقة (+${giftPrice} درهم)`
                          : `Écrin Cadeau Joaillerie & Ruban Satin (+${giftPrice} DH)`)}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#888] mt-0.5">
                      {lang === 'en'
                        ? 'Fine jewelry presentation with satin ribbon and personalized handwritten card'
                        : (lang === 'ar'
                        ? 'تغليف راقٍ مع شريط ساتان وبطاقة تهنئة مكتوبة بعناية'
                        : 'Présentation haute joaillerie avec ruban satin et carte manuscrite')}
                    </p>
                  </div>
                </label>

                {isGiftPackaging && (
                  <div className="pt-2 border-t border-[#222]">
                    <input
                      type="text"
                      value={giftNote}
                      onChange={(e) => onUpdateGiftNote && onUpdateGiftNote(e.target.value)}
                      placeholder={
                        lang === 'en'
                          ? 'Your personalized gift message...'
                          : (lang === 'ar'
                          ? 'اكتب رسالتك المخصصة للهدية هنا...'
                          : 'Votre mot personnalisé pour la destinataire...')
                      }
                      className="w-full px-2.5 py-1.5 bg-[#1a1a1a] border border-[#333] rounded text-xs text-white placeholder-[#666] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center font-serif text-lg">
              <span className="text-white">{t('sub_total')}</span>
              <div className="text-right">
                <span className="text-[#d4af37] font-bold text-xl block">
                  {subtotal.toLocaleString('fr-FR')} DH
                </span>
                {isGiftPackaging && (
                  <span className="text-[10px] text-[#888] font-sans block">
                    {lang === 'en'
                      ? `(incl. gift box +${giftPrice} DH)`
                      : (lang === 'ar'
                      ? `(تشمل علبة الهدية +${giftPrice} درهم)`
                      : `(dont écrin cadeau +${giftPrice} DH)`)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition rounded shadow-lg shadow-[#d4af37]/15 cursor-pointer"
            >
              <span>{t('go_pay')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-1.5 text-xs uppercase tracking-wider text-[#9a958a] hover:text-white transition cursor-pointer"
            >
              {t('cart_continue')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
