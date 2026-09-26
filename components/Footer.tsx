'use client';

import React, { useState } from 'react';
import { TRANSLATIONS } from '@/lib/translations';
import OvelzyaLogo from '@/components/OvelzyaLogo';
import { Instagram, Facebook, MessageCircle, Video, Youtube, ExternalLink } from 'lucide-react';
import { RegisteredUser, Language, SocialIconSettings, SocialLinkUrls } from '@/lib/types';
import { validateEmail } from '@/lib/emailValidation';
import LegalPolicyModal, { PolicyType } from '@/components/LegalPolicyModal';

interface FooterProps {
  lang: Language;
  setActiveView: (v: string) => void;
  openAuth: () => void;
  showToast: (m: string) => void;
  customLogoUrl?: string;
  socialIcons?: SocialIconSettings;
  socialLinks?: SocialLinkUrls;
  onUserSubscribed?: (user: RegisteredUser) => void;
}

export default function Footer({
  lang,
  setActiveView,
  openAuth,
  showToast,
  customLogoUrl,
  socialIcons,
  socialLinks,
  onUserSubscribed,
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyType | null>(null);
  const t = (k: string) => TRANSLATIONS[lang]?.[k] || k;

  const links = {
    instagram: socialLinks?.instagram || 'https://www.instagram.com/ovelzya_officiel',
    tiktok: socialLinks?.tiktok || 'https://www.tiktok.com/@ovelzya_joaillerie',
    youtube: socialLinks?.youtube || 'https://www.youtube.com/@OvelzyaJoaillerie',
    facebook: socialLinks?.facebook || 'https://www.facebook.com/ovelzya',
    whatsapp: socialLinks?.whatsapp || 'https://wa.me/212620000000',
    pinterest: socialLinks?.pinterest || 'https://www.pinterest.com/ovelzya',
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const validation = validateEmail(email);
    if (!validation.isValid) {
      showToast(validation.errorMessage || 'Veuillez saisir une adresse email valide');
      if (validation.suggestedEmail) {
        setSuggestedEmail(validation.suggestedEmail);
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'newsletter_subscribe',
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l’inscription');
      }

      showToast(t('toast_welcome'));
      if (onUserSubscribed && data.user) {
        onUserSubscribed(data.user);
      }
      setEmail('');
      setSuggestedEmail(null);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de l’inscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-[rgba(212,175,55,0.25)] bg-[#0a0a0a] pt-16 pb-24 sm:pb-8 mt-16 text-[#9a958a]">
      <div className="wrap">
        {/* Large Decorative Outlined Logo Typography */}
        <div
          aria-hidden="true"
          className="text-center font-serif text-4xl sm:text-7xl lg:text-9xl font-semibold tracking-[0.2em] select-none mb-12 text-transparent"
          style={{ WebkitTextStroke: '1px rgba(212,175,55,0.35)' }}
        >
          OVELZYA
        </div>

        {/* 4-column footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div>
            <OvelzyaLogo variant="footer" className="mb-4" customLogoUrl={customLogoUrl} />
            <p className="text-sm leading-relaxed text-[#9a958a]">{t('footer_desc')}</p>
            <div className="mt-4">
              <button
                onClick={openAuth}
                className="text-xs text-[#d4af37] hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                ✦ {lang === 'en' ? 'Member Area & Account' : (lang === 'ar' ? 'فضاء الأعضاء والحساب' : 'Espace Membre & Compte')}
              </button>
            </div>

            {/* Official Maison Ovelzya Social Links */}
            <div className="mt-5 pt-4 border-t border-[#222]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] block mb-2 font-medium">
                {lang === 'ar' ? 'الشبكات الرسمية' : lang === 'en' ? 'Official Channels' : 'Réseaux Officiels'}
              </span>
              <div className="flex items-center gap-2">
                {socialIcons?.showInstagram !== false && (
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded bg-[#171717] hover:bg-[#d4af37] hover:text-black border border-[#2a2a2a] flex items-center justify-center text-[#ccc] transition"
                    title="Instagram Officiel"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialIcons?.showTikTok !== false && (
                  <a
                    href={links.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded bg-[#171717] hover:bg-[#d4af37] hover:text-black border border-[#2a2a2a] flex items-center justify-center text-[#ccc] transition"
                    title="TikTok Officiel"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialIcons?.showYouTube !== false && (
                  <a
                    href={links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded bg-[#171717] hover:bg-[#FF0000] hover:text-white border border-[#2a2a2a] flex items-center justify-center text-[#ccc] transition"
                    title="YouTube Officiel"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialIcons?.showFacebook !== false && (
                  <a
                    href={links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded bg-[#171717] hover:bg-[#d4af37] hover:text-black border border-[#2a2a2a] flex items-center justify-center text-[#ccc] transition"
                    title="Facebook Maison Ovelzya"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialIcons?.showWhatsApp !== false && (
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded bg-[#171717] hover:bg-[#25D366] hover:text-white border border-[#2a2a2a] flex items-center justify-center text-[#ccc] transition"
                    title="WhatsApp Conciergerie VIP"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialIcons?.showPinterest !== false && (
                  <a
                    href={links.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded bg-[#171717] hover:bg-[#BD081C] hover:text-white border border-[#2a2a2a] flex items-center justify-center text-[#ccc] transition"
                    title="Pinterest Ovelzya Joaillerie"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-4">
              {t('f_shop')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveView('collection')}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  {t('nav_collection')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('promos')}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  {t('flash_title')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('collection')}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  {t('cat_colliers')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('collection')}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  {t('cat_bracelets')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-4">
              {t('f_service')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveView('materials')}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  {t('nav_materials')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('track')}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  {t('track_cta')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('contact')}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  {t('nav_contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-[#d4af37] transition cursor-pointer"
                >
                  {t('f_warranty')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPolicy('shipping')}
                  className="hover:text-[#d4af37] transition cursor-pointer text-[#8a857b]"
                >
                  Politique d&apos;expédition
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPolicy('returns')}
                  className="hover:text-[#d4af37] transition cursor-pointer text-[#8a857b]"
                >
                  Retours & Remboursements
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-4">
              {t('f_vip')}
            </h4>
            <p className="text-sm text-[#9a958a] mb-3">{t('f_vip_desc')}</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder={t('ph_email')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (suggestedEmail) setSuggestedEmail(null);
                  }}
                  className="flex-1 bg-[#141414] border border-[#2a2a2a] px-3 py-2 text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none rounded"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black text-xs font-semibold uppercase tracking-wider transition rounded disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? '...' : t('join')}
                </button>
              </div>
              {suggestedEmail && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/20 flex items-center gap-1">
                  <span>Suggestion : </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(suggestedEmail);
                      setSuggestedEmail(null);
                    }}
                    className="font-bold underline hover:text-white"
                  >
                    {suggestedEmail}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Menu au dessous de la page : Politiques & Mentions Légales */}
        <div className="border-t border-[#1e1e1e] pt-6 pb-2 my-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-medium flex items-center gap-1.5">
              <span className="text-[#d4af37]">✦</span> Informations Légales & Engagements
            </span>
            <nav aria-label="Menu légal au bas de page">
              <ul className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy('privacy')}
                    className="text-[#9a958a] hover:text-[#d4af37] transition cursor-pointer hover:underline underline-offset-4"
                  >
                    Politique de confidentialité
                  </button>
                </li>
                <li className="text-[#333] hidden sm:inline" aria-hidden="true">·</li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy('returns')}
                    className="text-[#9a958a] hover:text-[#d4af37] transition cursor-pointer hover:underline underline-offset-4"
                  >
                    Politique de retour et de remboursement
                  </button>
                </li>
                <li className="text-[#333] hidden sm:inline" aria-hidden="true">·</li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy('terms')}
                    className="text-[#9a958a] hover:text-[#d4af37] transition cursor-pointer hover:underline underline-offset-4"
                  >
                    Conditions de vente
                  </button>
                </li>
                <li className="text-[#333] hidden sm:inline" aria-hidden="true">·</li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy('legal')}
                    className="text-[#9a958a] hover:text-[#d4af37] transition cursor-pointer hover:underline underline-offset-4"
                  >
                    Mention légale
                  </button>
                </li>
                <li className="text-[#333] hidden sm:inline" aria-hidden="true">·</li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy('shipping')}
                    className="text-[#9a958a] hover:text-[#d4af37] transition cursor-pointer hover:underline underline-offset-4"
                  >
                    Politique d&apos;expédition
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-[#222] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>{t('f_copy')}</span>
          <span className="text-[#666] tracking-wider">{t('f_pay_modes')}</span>
        </div>
      </div>

      {/* Modal interactif officiel des Politiques & Mentions Légales */}
      {selectedPolicy && (
        <LegalPolicyModal
          isOpen={selectedPolicy !== null}
          onClose={() => setSelectedPolicy(null)}
          initialPolicy={selectedPolicy}
          lang={lang}
        />
      )}
    </footer>
  );
}
