'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Mail,
  ArrowRight,
  Gift,
  Crown,
  Heart,
  Copy,
  Check,
  Instagram,
  Gem,
  ExternalLink,
} from 'lucide-react';
import { Language, RegisteredUser } from '@/lib/types';
import EmailAccuracyField from './EmailAccuracyField';
import { validateEmail } from '@/lib/emailValidation';

interface NewsletterSectionProps {
  lang?: Language;
  onSubscribed?: (user: RegisteredUser) => void;
  showToast?: (m: string) => void;
  promoCode?: string;
  onApplyCode?: (code: string) => void;
  socialLinks?: { instagram?: string; whatsapp?: string; tiktok?: string };
}

export default function NewsletterSection({
  lang = 'fr',
  onSubscribed,
  showToast,
  promoCode = 'BIENVENUE10',
  onApplyCode,
  socialLinks,
}: NewsletterSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const isAr = lang === 'ar';
  const isEn = lang === 'en';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setErrorMsg(validation.errorMessage || 'Veuillez saisir une adresse email valide.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'newsletter_subscribe',
          email,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'enregistrement à la newsletter");
      }

      setIsSuccess(true);
      if (onSubscribed && data.user) {
        onSubscribed(data.user);
      }
      if (showToast) {
        showToast(
          isAr
            ? 'مرحباً بك في الدائرة الخاصة ميزون أوفيلزيا ✦ تم تسجيلك بنجاح'
            : 'Bienvenue au Cercle Privé Maison Ovelzya ✦ Inscription confirmée'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPromo = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
      if (showToast) {
        showToast(
          isAr
            ? `تم نسخ كود الترحيب (${promoCode}) بنجاح ✦`
            : `Code privilège ${promoCode} copié avec succès ✦`
        );
      }
    }
  };

  const instagramUrl = socialLinks?.instagram || 'https://www.instagram.com/ovelzya_officiel';

  return (
    <section
      id="newsletter-section"
      className="relative overflow-hidden my-16 mx-auto max-w-7xl px-4 sm:px-6"
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[11px] font-semibold uppercase tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {isAr
              ? 'امتيازات استثنائية · ميزون أوفيلزيا'
              : isEn
              ? 'Maison Privileges · Ovelzya World'
              : 'Privilèges Exclusifs · Maison Ovelzya'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-wide font-normal">
          {isAr ? (
            <span>عرض الترحيب، الدائرة الخاصة وبرنامج السفيرات</span>
          ) : isEn ? (
            <span>Welcome Offer, Private Circle & Ambassadors</span>
          ) : (
            <span>Offre de Bienvenue, Cercle Privé & Ambassadrices</span>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-[#9a958a] leading-relaxed max-w-2xl mx-auto font-light">
          {isAr
            ? 'ثلاثة امتيازات حصرية مصممة لعشاق الحلي الفاخرة: استمتعي بخصم الترحيب، انضمي للدائرة الخاصة، وشاركي بريق إطلالاتك مع الدار.'
            : isEn
            ? 'Three distinguished privileges crafted for fine jewelry enthusiasts: welcome discount, exclusive private previews, and ambassador rewards.'
            : 'Trois privilèges d’exception dédiés aux amoureuses de haute joaillerie : profitez de votre remise de bienvenue, intégrez nos salons privés et rayonnez avec la Maison.'}
        </p>
      </div>

      {/* THREE CARDS SIDE-BY-SIDE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6 items-stretch">
        
        {/* CARD 1: OFFRE DE BIENVENUE */}
        <div className="relative rounded-2xl border border-[rgba(212,175,55,0.35)] bg-gradient-to-b from-[#151515] via-[#101010] to-[#0a0a0a] p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-[#d4af37]/60 transition-all duration-300 group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-[#1c1c1c] text-[#d4af37] border border-[#333]">
                {isAr ? 'خصم فوري' : 'OFFRE EXCLUSIVE'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block">
                {isAr ? 'امتياز الطلب الأول' : 'Privilège 1ère Commande'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white font-semibold mt-1">
                {isAr ? 'عرض الترحيب' : 'Offre de Bienvenue'}
              </h3>
            </div>

            <p className="text-xs text-[#a5a095] leading-relaxed">
              {isAr ? (
                <>
                  استفيدي من خصم <strong className="text-[#d4af37] font-semibold">-10%</strong> على أول طلبية، مع علبة هدايا مخملية فاخرة وشهادة ضمان رسمية.
                </>
              ) : (
                <>
                  Bénéficiez de <strong className="text-[#d4af37] font-semibold">-10% immédiats</strong> sur votre première parure avec votre écrin velours offert et livraison sécurisée.
                </>
              )}
            </p>

            {/* Promo Code Box */}
            <div className="p-3.5 rounded-xl bg-[#0c0c0c] border border-dashed border-[#d4af37]/60 flex items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#777] block font-mono">
                  {isAr ? 'كود الترحيب الحصري' : 'Code Privilège'}
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-[#d4af37] tracking-wider">
                  {promoCode}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyPromo}
                className="px-3 py-1.5 rounded bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] hover:border-[#d4af37] text-xs text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">{isAr ? 'تم النسخ' : 'Copié !'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{isAr ? 'نسخ' : 'Copier'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Micro perks */}
            <ul className="space-y-1.5 text-[11px] text-[#888] pt-1">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isAr ? 'شحن مجاني عند الطلب بأكثر من 500 درهم' : 'Livraison express offerte dès 500 DH'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Gem className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{isAr ? 'ضمان رسمي لمدة سنتين مع كل قطعة' : 'Certificat d’authenticité et garantie 2 ans'}</span>
              </li>
            </ul>
          </div>

          <div className="pt-5 mt-4 border-t border-[#1e1e1e]">
            {onApplyCode ? (
              <button
                type="button"
                onClick={() => onApplyCode(promoCode)}
                className="w-full py-2.5 px-4 bg-[#181818] hover:bg-[#d4af37] text-[#cfcbc2] hover:text-black border border-[#2e2e2e] hover:border-[#d4af37] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{isAr ? 'تطبيق الكود في السلة' : 'Appliquer l’offre de bienvenue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopyPromo}
                className="w-full py-2.5 px-4 bg-[#181818] hover:bg-[#d4af37] text-[#cfcbc2] hover:text-black border border-[#2e2e2e] hover:border-[#d4af37] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{isAr ? 'نسخ كود الترحيب' : 'Copier le code BIENVENUE10'}</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: LE CERCLE PRIVÉ · MAISON OVELZYA (NEWSLETTER) */}
        <div className="relative rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#181818] via-[#121212] to-[#0c0c0c] p-6 sm:p-7 shadow-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden">
          {/* Top highlight ribbon */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#f3d994] to-[#d4af37]" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#d4af37] text-black">
                {isAr ? 'عضوية مجانية' : 'ADHÉSION PRIVILÈGE'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block">
                {isAr ? 'النادي الحصري' : 'Avant-Premières & Salons'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white font-semibold mt-1">
                {isAr ? 'الدائرة الخاصة · ميزون أوفيلزيا' : 'Le Cercle Privé · Maison Ovelzya'}
              </h3>
            </div>

            <p className="text-xs text-[#a5a095] leading-relaxed">
              {isAr ? (
                <>
                  انضمي إلى قائمتنا البريدية الخاصة لتكوني أول من يكتشف التشكيلات الذهبية الجديدة والإصدارات المحدودة المرقمة.
                </>
              ) : (
                <>
                  Recevez en exclusivité nos lancements de parures en or 18K, nos invitations aux ventes privées et nos réassorts confidentiels.
                </>
              )}
            </p>

            {/* Newsletter form or success state */}
            {isSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-2 text-center animate-fade-in my-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="font-serif text-sm font-bold text-white">
                  {isAr ? 'تم تأكيد انضمامك للدائرة الخاصة ✦' : 'Bienvenue au Cercle Privé ✦'}
                </h4>
                <p className="text-[11px] text-[#cfcbc2]">
                  {isAr
                    ? `تم حفظ (${email}) وسيصلك كل جديد حصرياً.`
                    : `Votre inscription (${email}) est validée. Vous recevrez nos invitations exclusives.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                    setName('');
                  }}
                  className="text-[10px] text-[#d4af37] hover:underline cursor-pointer pt-1 block mx-auto"
                >
                  {isAr ? 'تسجيل بريد آخر' : 'Inscrire un autre email'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3 pt-1">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'الاسم الأول (اختياري)' : 'Votre prénom (optionnel)'}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#333] rounded-lg text-xs text-white placeholder-[#666] focus:border-[#d4af37] focus:outline-none transition"
                  />
                </div>

                <div>
                  <EmailAccuracyField
                    value={email}
                    onChange={setEmail}
                    placeholder={isAr ? 'nom@exemple.com' : 'votre-email@exemple.com'}
                    required
                  />
                </div>

                {errorMsg && (
                  <p className="text-[11px] text-red-400 bg-red-950/40 p-2 rounded border border-red-900/50">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#d4af37] to-[#e8c878] hover:from-[#e8c878] hover:to-[#d4af37] text-black font-bold text-xs uppercase tracking-widest rounded-lg transition shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>{isAr ? 'جاري التسجيل...' : 'Inscription...'}</span>
                  ) : (
                    <>
                      <Crown className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الانضمام للدائرة الخاصة' : 'Rejoindre le Cercle Privé'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#222] flex items-center justify-between text-[11px] text-[#777]">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isAr ? 'رسائل دورية هادفة' : '0 spam · 100% confidentiel'}</span>
            </span>
            <span>{isAr ? 'إلغاء بنقرة' : 'Désinscription en 1 clic'}</span>
          </div>
        </div>

        {/* CARD 3: DEVENEZ AMBASSADRICE DE LA MAISON */}
        <div className="relative rounded-2xl border border-[rgba(212,175,55,0.35)] bg-gradient-to-b from-[#151515] via-[#101010] to-[#0a0a0a] p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-[#d4af37]/60 transition-all duration-300 group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#FD1D1D]/15 border border-[#FD1D1D]/40 flex items-center justify-center text-[#FD1D1D]">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-[#1c1c1c] text-[#e8c878] border border-[#333]">
                PROGRAMME ÉGÉRIE
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block">
                {isAr ? 'سفيرات العلامة' : 'Communauté & Collaborations'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white font-semibold mt-1">
                {isAr ? 'كوني سفيرة الدار' : 'Devenez Ambassadrice de la Maison'}
              </h3>
            </div>

            <p className="text-xs text-[#a5a095] leading-relaxed">
              {isAr ? (
                <>
                  شاركي صور وفيديوهات إطلالاتك الفاخرة مع وسم <strong className="text-white">#MaisonOvelzya</strong> وتاج <strong className="text-[#d4af37]">@ovelzya_officiel</strong> لفرصة الظهور في قصصنا الرسمية والحصول على هدايا مجوهرات سنوية.
                </>
              ) : (
                <>
                  Publiez vos photos avec le hashtag <strong className="text-white">#MaisonOvelzya</strong> et mentionnez <strong className="text-[#d4af37]">@ovelzya_officiel</strong> pour être mise à l’honneur dans nos stories et recevoir des pièces exclusives offertes.
                </>
              )}
            </p>

            {/* Social Proof Tag Box */}
            <div className="p-3.5 rounded-xl bg-[#0c0c0c] border border-[#262626] flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#777] block font-mono">
                  {isAr ? 'الوسم الرسمي المعتمد' : 'Hashtag Officiel'}
                </span>
                <span className="text-sm font-mono font-bold text-white tracking-wider">
                  #MaisonOvelzya
                </span>
              </div>
              <span className="text-[10px] text-[#d4af37] font-mono px-2 py-1 bg-[#1a1a1a] rounded border border-[#333]">
                @ovelzya_officiel
              </span>
            </div>

            {/* Perks bullet list */}
            <ul className="space-y-1.5 text-[11px] text-[#888] pt-1">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{isAr ? 'مشاركتك في منشورات وقصص الدار الرسمية' : 'Mise en lumière sur nos réseaux officiels'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isAr ? 'هدايا حصرية وخصومات خاصة بالسفيرات' : 'Bijoux offerts et remises privées créatrices'}</span>
              </li>
            </ul>
          </div>

          <div className="pt-5 mt-4 border-t border-[#1e1e1e]">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-95 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{isAr ? 'متابعة حساب الدار على إنستغرام' : 'Rejoindre sur Instagram'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
