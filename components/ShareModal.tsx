'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Product, Language } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  lang: Language;
}

export default function ShareModal({
  isOpen,
  onClose,
  product,
  lang = 'fr',
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = (k: string) => TRANSLATIONS[lang]?.[k] || k;

  // Resolve item details
  const title = product
    ? (lang === 'ar' ? product.name_ar || product.name : product.name)
    : 'Maison Ovelzya — Haute Joaillerie & Maroquinerie d’Exception';

  const priceText = product ? ` · ${product.price.toLocaleString('fr-FR')} DH` : '';
  const desc = product
    ? (lang === 'ar' ? product.desc_ar || product.desc : product.desc)
    : 'Découvrez les créations de la Maison Ovelzya en acier chirurgical 316L sublimé d’or 18 carats.';

  // Current URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://maison-ovelzya.ma';
  const shareText = `${title}${priceText} ✦ Maison Ovelzya : ${desc}`;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(title);
  const imageUrl = product?.img ? encodeURIComponent(product.img) : '';

  // Social share destination links (target visitor's accounts)
  const shareChannels = [
    {
      name: 'WhatsApp',
      description: lang === 'ar' ? 'مشاركة عبر واتساب' : 'Partager avec vos contacts & statut',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      badge: 'Direct',
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Facebook',
      description: lang === 'ar' ? 'نشر على فيسبوك' : 'Publier sur votre profil ou story Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      badge: 'Feed & Story',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      name: 'X (Twitter)',
      description: lang === 'ar' ? 'مشاركة عبر منصة إكس' : 'Publier un post sur votre compte X',
      icon: Twitter,
      color: 'bg-[#000000] hover:bg-[#1a1a1a] text-white border border-[#333]',
      badge: 'Post',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: 'Pinterest',
      description: lang === 'ar' ? 'حفظ في لوحات بينتيريست' : 'Épingler sur vos tableaux d’inspiration',
      icon: ExternalLink,
      color: 'bg-[#E60023] hover:bg-[#cc001f] text-white',
      badge: 'Pin',
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${imageUrl}&description=${encodedText}`,
    },
    {
      name: 'Telegram',
      description: lang === 'ar' ? 'إرسال عبر تيليجرام' : 'Envoyer dans vos canaux & discussions',
      icon: Send,
      color: 'bg-[#229ED9] hover:bg-[#1e8ec3] text-white',
      badge: 'Message',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: 'LinkedIn',
      description: lang === 'ar' ? 'مشاركة عبر لينكد إن' : 'Partager avec votre réseau professionnel',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#095196] text-white',
      badge: 'Réseau',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="share-modal-content"
        className="relative w-full max-w-md bg-[#121212] border border-[#d4af37]/40 rounded-xl shadow-2xl shadow-black/90 p-5 sm:p-6 text-white overflow-hidden"
      >
        {/* Decorative Golden Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#f4f1ea] leading-tight">
                {lang === 'ar' ? 'مشاركة هذه القطعة' : 'Partager cette création'}
              </h3>
              <p className="text-[11px] text-[#9a958a]">
                {lang === 'ar'
                  ? 'اختر حسابك على مواقع التواصل لنشر القطعة'
                  : 'Diffusez directement sur vos réseaux sociaux personnels'}
              </p>
            </div>
          </div>
          <button
            id="share-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c1c1c] hover:bg-[#282828] text-[#9a958a] hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product preview if present */}
        {product && (
          <div className="flex items-center gap-3 my-4 p-3 bg-[#181818] border border-[#2a2a2a] rounded-lg">
            <img
              src={product.img || `https://picsum.photos/seed/${product.seed}/200/200`}
              alt={title}
              className="w-12 h-12 rounded object-cover border border-[#333] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-serif text-sm text-white font-medium truncate">{title}</h4>
              <p className="text-[#d4af37] text-xs font-semibold mt-0.5">
                {product.price.toLocaleString('fr-FR')} DH
              </p>
            </div>
          </div>
        )}

        {/* Native Mobile Share Button (if supported) */}
        {hasNativeShare && (
          <button
            id="native-share-btn"
            onClick={handleNativeShare}
            className="w-full mb-3 py-2.5 px-4 bg-gradient-to-r from-[#d4af37] to-[#e8c878] hover:from-[#e8c878] hover:to-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'ar' ? 'مشاركة عبر تطبيقات الهاتف' : 'Partager via vos applications mobiles'}
            </span>
          </button>
        )}

        {/* Grid of Social Channels (Opens visitor's social accounts directly) */}
        <div className="grid grid-cols-2 gap-2.5 my-3">
          {shareChannels.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.name}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 bg-[#171717] hover:bg-[#202020] border border-[#282828] hover:border-[#d4af37]/60 rounded-lg transition group cursor-pointer"
                title={`${ch.name} - ${ch.description}`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${ch.color} transition shadow-sm`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-[#f0ece1] group-hover:text-[#d4af37] block leading-tight truncate">
                    {ch.name}
                  </span>
                  <span className="text-[9px] text-[#888] block truncate">{ch.badge}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Direct Link Copy */}
        <div className="pt-3 border-t border-[#262626]">
          <label className="block text-[11px] text-[#9a958a] mb-1.5 font-medium">
            {lang === 'ar' ? 'أو نسخ الرابط المباشر:' : 'Ou copier le lien direct:'}
          </label>
          <div className="flex items-center gap-2 bg-[#0d0d0d] border border-[#2c2c2c] rounded-lg p-1.5 pl-3">
            <span className="text-xs text-[#a09c94] font-mono truncate flex-1">{currentUrl}</span>
            <button
              id="copy-share-link-btn"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#d4af37] hover:bg-[#e8c878] text-black'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تم النسخ!' : 'Copié !'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'نسخ' : 'Copier'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
