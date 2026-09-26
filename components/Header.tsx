'use client';

import React, { useSyncExternalStore } from 'react';
import { ShoppingBag, ShieldCheck, Globe, User, Sun, Moon, Briefcase, Heart } from 'lucide-react';
import { TRANSLATIONS } from '@/lib/translations';
import { RegisteredUser, Language, LanguageSettings } from '@/lib/types';
import OvelzyaLogo from '@/components/OvelzyaLogo';

const emptySubscribe = () => () => {};

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  activeView: string;
  setActiveView: (v: string) => void;
  cartCount: number;
  openCart: () => void;
  openAuth: () => void;
  currentUser: RegisteredUser | null;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
  wishlistCount?: number;
  customLogoUrl?: string;
  languagesConfig?: LanguageSettings;
}

export default function Header({
  lang,
  setLang,
  activeView,
  setActiveView,
  cartCount,
  openCart,
  openAuth,
  currentUser,
  theme = 'dark',
  toggleTheme,
  wishlistCount = 0,
  customLogoUrl,
  languagesConfig,
}: HeaderProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const displayUser = isMounted ? currentUser : null;
  const displayTheme = isMounted ? theme : 'dark';
  const displayCartCount = isMounted ? cartCount : 0;
  const displayWishlistCount = isMounted ? wishlistCount : 0;
  const t = (k: string) => TRANSLATIONS[lang]?.[k] || k;

  const availableLangs: { code: Language; label: string; full: string }[] = [];
  if (languagesConfig?.enableFr !== false) availableLangs.push({ code: 'fr', label: 'FR', full: 'Français' });
  if (languagesConfig?.enableAr !== false) availableLangs.push({ code: 'ar', label: 'العربية', full: 'العربية' });
  if (languagesConfig?.enableEn !== false) availableLangs.push({ code: 'en', label: 'EN', full: 'English' });

  const showSwitcher = (languagesConfig?.showLanguageSwitcher !== false) && availableLangs.length > 1;

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0d0d0d]/92 backdrop-blur-md border-b border-[rgba(212,175,55,0.25)]">
      <div className="wrap flex items-center justify-between h-[62px] sm:h-[74px] gap-2 sm:gap-4 px-3 sm:px-7">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveView('home')}
          aria-label="Ovelzya Accueil"
          className="cursor-pointer flex items-center hover:opacity-95 transition shrink-0"
        >
          <OvelzyaLogo
            variant="header"
            size="md"
            lightMode={displayTheme === 'light'}
            customLogoUrl={customLogoUrl}
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => setActiveView('home')}
            className={`text-xs uppercase tracking-[0.16em] py-1 transition border-b ${
              activeView === 'home'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-[#f4f1ea] border-transparent hover:text-[#d4af37]'
            }`}
          >
            {t('nav_home')}
          </button>
          <button
            onClick={() => setActiveView('collection')}
            className={`text-xs uppercase tracking-[0.16em] py-1 transition border-b ${
              activeView === 'collection'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-[#f4f1ea] border-transparent hover:text-[#d4af37]'
            }`}
          >
            {t('nav_collection')}
          </button>
          <button
            onClick={() => setActiveView('promos')}
            className={`text-xs uppercase tracking-[0.16em] py-1 transition border-b relative ${
              activeView === 'promos'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-[#f4f1ea] border-transparent hover:text-[#d4af37]'
            }`}
          >
            {t('nav_promos')}
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 ml-1.5 mb-0.5 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveView('wishlist')}
            className={`text-xs uppercase tracking-[0.16em] py-1 transition border-b flex items-center gap-1.5 ${
              activeView === 'wishlist'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-[#f4f1ea] border-transparent hover:text-[#d4af37]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'المفضلة' : (lang === 'en' ? 'Wishlist' : 'Souhaits')}</span>
            {displayWishlistCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/50 font-mono font-bold">
                {displayWishlistCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveView('materials')}
            className={`text-xs uppercase tracking-[0.16em] py-1 transition border-b ${
              activeView === 'materials'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-[#f4f1ea] border-transparent hover:text-[#d4af37]'
            }`}
          >
            {t('nav_materials')}
          </button>
          <button
            onClick={() => setActiveView('track')}
            className={`text-xs uppercase tracking-[0.16em] py-1 transition border-b ${
              activeView === 'track'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-[#f4f1ea] border-transparent hover:text-[#d4af37]'
            }`}
          >
            {t('track_cta')}
          </button>
          <button
            onClick={() => setActiveView('contact')}
            className={`text-xs uppercase tracking-[0.16em] py-1 transition border-b ${
              activeView === 'contact'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-[#f4f1ea] border-transparent hover:text-[#d4af37]'
            }`}
          >
            {t('nav_contact')}
          </button>
        </nav>

        {/* Action Controls: Admin Button, Wishlist, Lang Switch, Cart Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Wishlist Icon Button */}
          <button
            onClick={() => setActiveView('wishlist')}
            aria-label={lang === 'ar' ? 'قائمة الرغبات' : (lang === 'en' ? 'Wishlist' : 'Liste de souhaits')}
            title={lang === 'ar' ? 'قائمة الرغبات' : (lang === 'en' ? 'Wishlist' : 'Liste de souhaits')}
            className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition flex items-center justify-center cursor-pointer shrink-0 ${
              activeView === 'wishlist'
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                : 'border-[rgba(212,175,55,0.3)] text-[#f4f1ea] hover:border-[#d4af37] hover:text-[#d4af37]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {displayWishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black font-bold text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                {displayWishlistCount}
              </span>
            )}
          </button>

          {/* Mon Compte / Connexion Trigger (Discreet User Portal) */}
          <button
            onClick={openAuth}
            suppressHydrationWarning
            title={
              displayUser
                ? displayUser.role === 'admin'
                  ? 'Administration déverrouillée'
                  : 'Mon Espace Client'
                : 'Se connecter ou créer un compte'
            }
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider uppercase transition cursor-pointer border shrink-0 ${
              displayUser?.role === 'admin'
                ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-sm'
                : displayUser
                ? 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/50'
                : 'text-[#f4f1ea] border-[rgba(212,175,55,0.3)] hover:border-[#d4af37] hover:text-[#d4af37]'
            }`}
          >
            {displayUser?.role === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Admin</span>
              </>
            ) : displayUser?.role === 'commercial' ? (
              <>
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-300">Commercial</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {displayUser ? displayUser.name.split(' ')[0] : (lang === 'ar' ? 'حسابي' : (lang === 'en' ? 'Account' : 'Compte'))}
                </span>
              </>
            )}
          </button>

          {/* Light / Dark Mode Toggle */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              suppressHydrationWarning
              aria-label={displayTheme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
              title={displayTheme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[rgba(212,175,55,0.3)] text-[#f4f1ea] hover:border-[#d4af37] hover:text-[#d4af37] transition cursor-pointer flex items-center justify-center shrink-0"
            >
              {displayTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#a07409]" />}
            </button>
          )}

          {/* Multi-language Switcher (FR / AR / EN) */}
          {showSwitcher && (
            <div className="inline-flex items-center rounded-full border border-[rgba(212,175,55,0.3)] bg-[#141414] p-0.5 text-[11px] font-semibold shrink-0">
              <Globe className="w-3 h-3 text-[#d4af37] ml-2 mr-1 shrink-0" />
              <div className="flex items-center gap-0.5">
                {availableLangs.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLang(item.code)}
                    className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide transition cursor-pointer ${
                      lang === item.code
                        ? 'bg-[#d4af37] text-black shadow-xs'
                        : 'text-[#cfcbc2] hover:text-[#d4af37]'
                    }`}
                    title={item.full}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cart Icon & Badge */}
          <button
            onClick={openCart}
            aria-label="Panier d'achats"
            className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[rgba(212,175,55,0.3)] text-[#f4f1ea] hover:border-[#d4af37] hover:text-[#d4af37] transition flex items-center justify-center cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span
              id="cartN"
              suppressHydrationWarning
              className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-[#d4af37] text-black font-bold text-[9px] sm:text-[10px] min-w-[17px] sm:min-w-[19px] h-[17px] sm:h-[19px] rounded-full flex items-center justify-center px-1"
            >
              {displayCartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row (Horizontally scrollable with smooth touch, no scrollbar) */}
      <div className="lg:hidden flex items-center justify-start border-t border-[rgba(212,175,55,0.15)] bg-[#0f0f0f] py-2 px-3 text-[11px] uppercase tracking-wider overflow-x-auto no-scrollbar gap-1.5 whitespace-nowrap scroll-smooth">
        <button
          onClick={() => setActiveView('home')}
          className={`px-3 py-1 rounded-full shrink-0 transition ${
            activeView === 'home'
              ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/50'
              : 'text-[#cfcbc2] hover:text-[#d4af37]'
          }`}
        >
          {t('nav_home')}
        </button>
        <button
          onClick={() => setActiveView('collection')}
          className={`px-3 py-1 rounded-full shrink-0 transition ${
            activeView === 'collection'
              ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/50'
              : 'text-[#cfcbc2] hover:text-[#d4af37]'
          }`}
        >
          {t('nav_collection')}
        </button>
        <button
          onClick={() => setActiveView('promos')}
          className={`px-3 py-1 rounded-full shrink-0 transition relative ${
            activeView === 'promos'
              ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/50'
              : 'text-[#cfcbc2] hover:text-[#d4af37]'
          }`}
        >
          {t('nav_promos')}
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 ml-1 mb-0.5 animate-pulse" />
        </button>
        <button
          onClick={() => setActiveView('wishlist')}
          className={`px-3 py-1 rounded-full shrink-0 transition flex items-center gap-1 ${
            activeView === 'wishlist'
              ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/50'
              : 'text-[#cfcbc2] hover:text-[#d4af37]'
          }`}
        >
          <Heart className="w-3 h-3" />
          <span>{lang === 'ar' ? 'المفضلة' : (lang === 'en' ? 'Wishlist' : 'Souhaits')}</span>
          {displayWishlistCount > 0 && (
            <span className="text-[9px] px-1 rounded-full bg-[#d4af37] text-black font-bold">
              {displayWishlistCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveView('materials')}
          className={`px-3 py-1 rounded-full shrink-0 transition ${
            activeView === 'materials'
              ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/50'
              : 'text-[#cfcbc2] hover:text-[#d4af37]'
          }`}
        >
          {t('nav_materials')}
        </button>
        <button
          onClick={() => setActiveView('track')}
          className={`px-3 py-1 rounded-full shrink-0 transition ${
            activeView === 'track'
              ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/50'
              : 'text-[#cfcbc2] hover:text-[#d4af37]'
          }`}
        >
          {t('track_cta')}
        </button>
        <button
          onClick={() => setActiveView('contact')}
          className={`px-3 py-1 rounded-full shrink-0 transition ${
            activeView === 'contact'
              ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/50'
              : 'text-[#cfcbc2] hover:text-[#d4af37]'
          }`}
        >
          {t('nav_contact')}
        </button>
      </div>
    </header>
  );
}
