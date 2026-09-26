'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, ArrowRight, Tag } from 'lucide-react';
import OvelzyaLogo from './OvelzyaLogo';
import { Language } from '@/lib/types';

interface ExitIntentModalProps {
  isOpenManually?: boolean;
  promoCode: string;
  discountPct: number;
  lang: Language;
  onApplyCode: (code: string) => void;
  onClose?: () => void;
}

export default function ExitIntentModal({
  isOpenManually = false,
  promoCode = 'BIENVENUE10',
  discountPct = 10,
  lang,
  onApplyCode,
  onClose,
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(isOpenManually);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (isOpenManually) {
      const t = setTimeout(() => setIsOpen(true), 0);
      return () => clearTimeout(t);
    }

    // Check session storage
    if (typeof window !== 'undefined') {
      const alreadyShown = sessionStorage.getItem('md_exit_intent_shown');
      if (alreadyShown) return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if cursor leaves window toward top
      if (e.clientY <= 12) {
        setIsOpen(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('md_exit_intent_shown', 'true');
        }
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpenManually]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    }
  };

  const handleApplyAndContinue = () => {
    onApplyCode(promoCode);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div id="exit-intent-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="exit-intent-card relative w-full max-w-md bg-[#111111] border border-[#d4af37]/40 rounded-xl p-6 sm:p-8 shadow-2xl shadow-black text-center overflow-hidden transition-colors"
        style={{
          backgroundImage:
            'radial-gradient(circle at top, rgba(212,175,55,0.12) 0%, transparent 70%)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#888] hover:text-white p-1 rounded transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest */}
        <div className="flex justify-center mb-3">
          <OvelzyaLogo variant="crest" size="md" />
        </div>

        {/* Decorative badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'هدية ترحيبية حصرية' : 'Offre Privilège Exclusive'}</span>
        </div>

        {/* Heading */}
        <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-wide">
          {lang === 'ar' ? 'لا تغادر بدون هديتك' : 'Ne partez pas les mains vides'}
        </h3>

        <p className="text-xs sm:text-sm text-[#cfcbc2] mt-2 max-w-xs mx-auto leading-relaxed">
          {lang === 'ar'
            ? `استفد من خصم خاص بقيمة ${discountPct}٪ على طلبيتك الأولى من دار أوفيلزيا.`
            : `Profitez d'une remise immédiate de −${discountPct} % sur votre première commande Ovelzya.`}
        </p>

        {/* Promo code coupon box */}
        <div className="my-6 p-4 bg-[#181818] border border-dashed border-[#d4af37]/50 rounded-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-left">
            <Tag className="w-4 h-4 text-[#d4af37] shrink-0" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#888] block">
                {lang === 'ar' ? 'رمز القسيمة' : 'Code promo'}
              </span>
              <span className="font-mono font-bold text-base text-[#d4af37] tracking-widest">
                {promoCode}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 bg-[#252525] hover:bg-[#333] text-xs text-white rounded flex items-center gap-1.5 transition cursor-pointer border border-[#444]"
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#aaa]" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>

        {/* Main CTA: Apply & Continue */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleApplyAndContinue}
            className="w-full py-3.5 px-6 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.16em] rounded transition flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 cursor-pointer"
          >
            <span>{lang === 'ar' ? 'تطبيق الخصم والمتابعة' : 'Appliquer la remise & continuer'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-[#888] hover:text-[#bbb] transition underline underline-offset-4"
          >
            {lang === 'ar' ? 'شكراً، أفضل المتابعة بالسعر العادي' : 'Non merci, je continue mes achats'}
          </button>
        </div>
      </div>
    </div>
  );
}
