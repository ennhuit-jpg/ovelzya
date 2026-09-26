'use client';

import React from 'react';
import { Product, PromotionOfferRule, PromotionDisplayStage, Language } from '@/lib/types';
import { findProductBySku, getProductSku, normalizeSku, calculateDiscountedPrice } from '@/lib/skuUtils';
import { getProductLocalized } from '@/lib/productTranslations';
import { Sparkles, ArrowUpRight, Plus, Check, ShieldCheck, Tag } from 'lucide-react';

interface ProductCrossSellUpsellSectionProps {
  currentProduct?: Product | null;
  cartProducts?: Product[];
  products: Product[];
  rules: PromotionOfferRule[];
  lang: Language;
  onAddToCart: (productId: number, qty?: number, priceOverride?: number) => void;
  onSelectProduct?: (productId: number) => void;
  blurredProductIds?: Record<number, boolean>;
  enableCrossSell?: boolean;
  enableUpsell?: boolean;
  stage?: PromotionDisplayStage;
  variant?: 'full' | 'compact';
}

export default function ProductCrossSellUpsellSection({
  currentProduct,
  cartProducts,
  products,
  rules,
  lang,
  onAddToCart,
  onSelectProduct,
  blurredProductIds = {},
  enableCrossSell = true,
  enableUpsell = true,
  stage = 'product_page',
  variant = 'full',
}: ProductCrossSellUpsellSectionProps) {
  // Find applicable rules based on stage and active products
  const applicableRules = React.useMemo(() => {
    if (!rules || rules.length === 0) return [];

    // Context products to match against
    const activeContextProducts: Product[] = [];
    if (currentProduct) {
      activeContextProducts.push(currentProduct);
    }
    if (cartProducts && cartProducts.length > 0) {
      cartProducts.forEach((p) => {
        if (!activeContextProducts.some((x) => x.id === p.id)) {
          activeContextProducts.push(p);
        }
      });
    }

    return rules.filter((rule) => {
      if (!rule.active) return false;
      if (rule.type === 'cross_sell' && !enableCrossSell) return false;
      if (rule.type === 'upsell' && !enableUpsell) return false;

      // Filter by stage
      const ruleStage = rule.displayStage || 'product_page';
      if (ruleStage !== stage) return false;

      const ruleSourceSku = (rule.sourceSku || '').toUpperCase().trim();
      if (ruleSourceSku === '*' || ruleSourceSku === 'ALL') {
        return true;
      }

      // Resolve the product corresponding to rule.sourceSku
      const ruleSourceProduct = findProductBySku(rule.sourceSku, products);

      // If no context products (e.g., direct checkout view), allow wildcard rules
      if (activeContextProducts.length === 0) {
        return ruleSourceSku === '*' || ruleSourceSku === 'ALL';
      }

      // Check if any context product matches the rule
      return activeContextProducts.some((p) => {
        if (ruleSourceProduct && ruleSourceProduct.id === p.id) return true;
        const pSku = getProductSku(p);
        if (pSku === ruleSourceSku) return true;
        if (p.sku && normalizeSku(p.sku) === ruleSourceSku) return true;
        const padded = String(p.id).padStart(3, '0');
        if (
          ruleSourceSku === `MD-${padded}` ||
          ruleSourceSku === `MD-${padded}-OR` ||
          ruleSourceSku === String(p.id)
        ) {
          return true;
        }
        return false;
      });
    });
  }, [currentProduct, cartProducts, rules, products, enableCrossSell, enableUpsell, stage]);

  if (applicableRules.length === 0) {
    return null;
  }

  // Compact variant (ideal for Cart Drawer and Checkout mini-boxes)
  if (variant === 'compact') {
    return (
      <div className="space-y-3 pt-3 border-t border-[#262626]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#d4af37]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {stage === 'cart_add'
              ? (lang === 'en' ? 'Exclusive Cart Add-On' : (lang === 'ar' ? 'عرض خاص في السلة' : 'Offre Exclusivité Panier'))
              : (lang === 'en' ? 'Checkout Privilege Offer' : (lang === 'ar' ? 'عرض مميز في صفحة الدفع' : 'Privilège Commande'))}
          </span>
        </div>

        {applicableRules.map((rule) => {
          const targetProduct = findProductBySku(rule.targetSku, products);
          if (!targetProduct) return null;

          const targetLoc = getProductLocalized(targetProduct, lang);
          const discount = Math.max(0, Math.min(90, rule.discountPct || 0));
          const discountedPrice = discount > 0
            ? Math.round(targetProduct.price * (1 - discount / 100))
            : targetProduct.price;
          const isBlurred = !!blurredProductIds[targetProduct.id];
          const isCrossSell = rule.type === 'cross_sell';

          return (
            <div
              key={rule.id}
              className={`p-3 rounded-xl border transition ${
                isCrossSell
                  ? 'bg-gradient-to-r from-[#181816] to-[#121212] border-amber-500/30'
                  : 'bg-gradient-to-r from-[#1c1822] to-[#121212] border-purple-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div
                  onClick={() => onSelectProduct && onSelectProduct(targetProduct.id)}
                  className="relative w-14 h-16 rounded bg-[#161616] overflow-hidden shrink-0 border border-[#333] cursor-pointer"
                >
                  <img
                    src={targetProduct.img || `https://picsum.photos/seed/${targetProduct.seed}/150/180`}
                    alt={targetLoc.name}
                    className={`w-full h-full object-cover transition duration-300 ${
                      isBlurred ? 'scale-105 opacity-90' : ''
                    }`}
                  />
                  {isBlurred && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#d4af37]" />
                    </div>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-0.5 left-0.5 bg-red-600 text-white text-[8px] font-bold px-1 rounded">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-[#d4af37] truncate">
                      {rule.customBadge || (isCrossSell ? 'Cross-Sell' : 'Upsell')}
                    </span>
                  </div>
                  <h4
                    onClick={() => onSelectProduct && onSelectProduct(targetProduct.id)}
                    className="font-serif text-xs font-semibold text-white truncate cursor-pointer hover:text-[#d4af37]"
                  >
                    {targetLoc.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-serif font-bold text-[#d4af37] text-xs">
                      {discountedPrice} DH
                    </span>
                    {discount > 0 && (
                      <span className="text-[10px] text-[#777] line-through">
                        {targetProduct.price} DH
                      </span>
                    )}
                  </div>
                </div>

                {/* Add button */}
                <button
                  type="button"
                  onClick={() => onAddToCart(targetProduct.id, 1, discountedPrice)}
                  className={`px-3 py-2 rounded text-[11px] font-bold uppercase tracking-wider shrink-0 transition flex items-center gap-1 cursor-pointer ${
                    isCrossSell
                      ? 'bg-[#d4af37] hover:bg-[#e8c878] text-black'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Full-featured section (for Product Page, Checkout Main Section, or Order Confirmation)
  return (
    <section className="mt-8 pt-8 border-t border-[#262626]">
      <div className="space-y-6">
        {applicableRules.map((rule) => {
          const targetProduct = findProductBySku(rule.targetSku, products);
          if (!targetProduct || (currentProduct && targetProduct.id === currentProduct.id)) {
            return null;
          }

          const targetLoc = getProductLocalized(targetProduct, lang);
          const discount = Math.max(0, Math.min(90, rule.discountPct || 0));
          const discountedPrice = discount > 0
            ? Math.round(targetProduct.price * (1 - discount / 100))
            : targetProduct.price;
          const savings = targetProduct.price - discountedPrice;
          const isBlurred = !!blurredProductIds[targetProduct.id];
          const isCrossSell = rule.type === 'cross_sell';

          return (
            <div
              key={rule.id}
              className={`rounded-2xl p-5 sm:p-6 border transition duration-300 relative overflow-hidden ${
                isCrossSell
                  ? 'bg-gradient-to-br from-[#181816] via-[#141414] to-[#0f0f0f] border-amber-500/30 shadow-xl shadow-amber-950/20'
                  : 'bg-gradient-to-br from-[#1c1822] via-[#16141a] to-[#100e14] border-purple-500/30 shadow-xl shadow-purple-950/20'
              }`}
            >
              {/* Top luxury badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      isCrossSell
                        ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {rule.customBadge || (isCrossSell
                        ? (lang === 'en' ? '✨ Complete Your Set (Cross-Sell Offer)' : (lang === 'ar' ? '✨ إكمال الطقم (عرض متناسق خاص)' : '✨ Complétez votre Parure (Offre Cross-Sell)'))
                        : (lang === 'en' ? '💎 Superior Prestige Edition (Upsell Offer)' : (lang === 'ar' ? '💎 الإصدار الأرقى المتميز (عرض ترقية)' : '💎 Édition Supérieure Privilège (Offre Upsell)')))}
                    </span>
                  </span>

                  {discount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">
                      <Tag className="w-3 h-3" />
                      <span>−{discount}% EXCLUSIF</span>
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-[#888] font-mono">
                  Réf : {targetProduct.sku || `MD-${String(targetProduct.id).padStart(3, '0')}-OR`}
                </span>
              </div>

              {/* Title & Custom Pitch */}
              <div className="mb-4">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                  {rule.customTitle || (isCrossSell ? 'Ajoutez la pièce assortie à votre commande' : 'Passez au modèle joaillerie d’exception')}
                </h3>
                {rule.notes && (
                  <p className="text-xs sm:text-sm text-[#a8a398] mt-1 leading-relaxed">
                    {rule.notes}
                  </p>
                )}
              </div>

              {/* Product Recognition Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-[#0c0c0c]/80 border border-[#262626] rounded-xl p-4">
                {/* Product thumbnail vignette recognized by SKU with blur effect on cart add */}
                <div
                  onClick={() => onSelectProduct && onSelectProduct(targetProduct.id)}
                  className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-[#111] border border-[#333] cursor-pointer group"
                  title="Voir la fiche détaillée"
                >
                  <img
                    src={targetProduct.img || `https://picsum.photos/seed/${targetProduct.seed}/300/375`}
                    alt={targetLoc.name}
                    className={`w-full h-full object-cover transition duration-500 group-hover:scale-105 ${
                      isBlurred ? 'scale-105 opacity-90' : ''
                    }`}
                  />
                  {isBlurred && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-1 text-center animate-fade-in pointer-events-none">
                      <Check className="w-6 h-6 text-[#d4af37]" />
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider mt-0.5">
                        Ajouté !
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                    {targetLoc.cat}
                  </span>
                  <h4
                    onClick={() => onSelectProduct && onSelectProduct(targetProduct.id)}
                    className="font-serif text-base sm:text-lg font-semibold text-white truncate hover:text-[#d4af37] cursor-pointer transition"
                  >
                    {targetLoc.name}
                  </h4>
                  <p className="text-xs text-[#888] line-clamp-2 mt-1">
                    {targetLoc.desc}
                  </p>

                  {/* Price comparison */}
                  <div className="flex items-baseline justify-center sm:justify-start gap-3 mt-2">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#d4af37]">
                      {discountedPrice.toLocaleString('fr-FR')} DH
                    </span>
                    {discount > 0 && (
                      <>
                        <span className="text-xs text-[#777] line-through">
                          {targetProduct.price.toLocaleString('fr-FR')} DH
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold">
                          (Économie : {savings.toLocaleString('fr-FR')} DH)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Call to action button */}
                <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onAddToCart(targetProduct.id, 1, discountedPrice)}
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                      isCrossSell
                        ? 'bg-[#d4af37] hover:bg-[#e8c878] text-black shadow-[#d4af37]/20'
                        : 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-900/30'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {isCrossSell
                        ? (lang === 'en' ? `Add for only ${discountedPrice} DH` : (lang === 'ar' ? `إضافة بـ ${discountedPrice} درهم فقط` : `Ajouter pour seulement ${discountedPrice} DH`))
                        : (lang === 'en' ? `Upgrade for ${discountedPrice} DH` : (lang === 'ar' ? `ترقية بـ ${discountedPrice} درهم` : `Opter pour ce modèle à ${discountedPrice} DH`))}
                    </span>
                  </button>

                  {onSelectProduct && (
                    <button
                      type="button"
                      onClick={() => onSelectProduct(targetProduct.id)}
                      className="text-[11px] text-[#999] hover:text-[#d4af37] flex items-center justify-center gap-1 transition cursor-pointer self-center sm:self-end"
                    >
                      <span>{lang === 'en' ? 'View piece details' : (lang === 'ar' ? 'معاينة تفاصيل القطعة' : 'Découvrir cette pièce')}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Guarantees micro-bar */}
              <div className="flex items-center gap-4 mt-3 text-[11px] text-[#888] pt-2 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Plaqué or 18k garanti</span>
                </span>
                <span>•</span>
                <span>Offre groupée appliquée automatiquement</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
