'use client';

import React from 'react';

interface OvelzyaLogoProps {
  variant?: 'header' | 'full' | 'crest' | 'footer' | 'invoice';
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightMode?: boolean;
  customLogoUrl?: string | null;
}

// Sizing helper for responsive height
const getHeightClass = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  if (size === 'sm') return 'h-7 sm:h-8';
  if (size === 'lg') return 'h-11 sm:h-13';
  if (size === 'xl') return 'h-14 sm:h-18';
  return 'h-8 sm:h-10';
};

// 18K Gold Gradients and Filters Definition for SVG with High-Relief 3D Emboss
function LuxuryGoldDefs({ idPrefix = 'ov' }: { idPrefix?: string }) {
  return (
    <defs>
      {/* Radiant 18K Yellow Gold Multi-Facet Metallic Gradient */}
      <linearGradient id={`${idPrefix}GoldGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFEE8" />
        <stop offset="12%" stopColor="#FCE38E" />
        <stop offset="26%" stopColor="#EDB83A" />
        <stop offset="44%" stopColor="#C48C18" />
        <stop offset="52%" stopColor="#FFF9D2" />
        <stop offset="68%" stopColor="#9E6E0F" />
        <stop offset="84%" stopColor="#F7D878" />
        <stop offset="94%" stopColor="#C79222" />
        <stop offset="100%" stopColor="#664306" />
      </linearGradient>

      {/* Light-Mode High-Contrast 18K Chiseled Gold Gradient */}
      <linearGradient id={`${idPrefix}LightGoldGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF9E0" />
        <stop offset="14%" stopColor="#E5B942" />
        <stop offset="35%" stopColor="#B37E17" />
        <stop offset="50%" stopColor="#FFF2B8" />
        <stop offset="65%" stopColor="#8A5C09" />
        <stop offset="85%" stopColor="#D9A833" />
        <stop offset="100%" stopColor="#573604" />
      </linearGradient>

      {/* Specular Highlight Sheen with Diamond Sheer */}
      <linearGradient id={`${idPrefix}GoldSheen`} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#C48C18" />
        <stop offset="30%" stopColor="#FFFEEB" />
        <stop offset="50%" stopColor="#FFE185" />
        <stop offset="70%" stopColor="#EDB83A" />
        <stop offset="100%" stopColor="#7E540B" />
      </linearGradient>

      {/* Deep Imperial Bronze-Gold for Crisp White Paper Print & PDF */}
      <linearGradient id={`${idPrefix}PrintGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#946B16" />
        <stop offset="35%" stopColor="#73500C" />
        <stop offset="75%" stopColor="#543806" />
        <stop offset="100%" stopColor="#2E1D03" />
      </linearGradient>

      {/* High-Relief 3D Metallic Emboss Filter for Dark Mode */}
      <filter id={`${idPrefix}DropGlow`} x="-20%" y="-20%" width="140%" height="140%">
        {/* Soft dark ambient shadow */}
        <feDropShadow dx="0" dy="3.5" stdDeviation="3.2" floodColor="#000000" floodOpacity="0.85" />
        {/* Tight chiseled bevel shadow */}
        <feDropShadow dx="1" dy="1.8" stdDeviation="1.2" floodColor="#1a0f02" floodOpacity="0.9" />
        {/* Warm golden ambient bounce glow */}
        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#d4af37" floodOpacity="0.32" />
      </filter>

      {/* High-Relief 3D Sculpted Emboss Filter for Light Mode (Raised Bas-Relief) */}
      <filter id={`${idPrefix}LightRelief`} x="-25%" y="-25%" width="150%" height="150%">
        {/* Top-left specular gleam simulation */}
        <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0.6" floodColor="#FFFFFF" floodOpacity="0.95" />
        {/* Bottom-right crisp carved champlevé shadow */}
        <feDropShadow dx="1.4" dy="2" stdDeviation="1.2" floodColor="#3d2406" floodOpacity="0.65" />
        {/* Deep ambient elevation shadow on light surface */}
        <feDropShadow dx="2" dy="4" stdDeviation="3.5" floodColor="#75500d" floodOpacity="0.26" />
        {/* Warm amber micro reflection */}
        <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#fadb7a" floodOpacity="0.4" />
      </filter>
    </defs>
  );
}

// Signature Jewelry Monogram Crest (The ornate 'O' seal with 8-point facet star in 3D relief)
function OvelzyaCrestSvg({
  size = 36,
  isPrint = false,
  lightMode = false,
  className = '',
}: {
  size?: number;
  isPrint?: boolean;
  lightMode?: boolean;
  className?: string;
}) {
  const isLight = lightMode || isPrint;
  const gradId = isPrint ? 'crestPrintGrad' : isLight ? 'crestLightGoldGrad' : 'crestGoldGrad';
  const filterId = isPrint ? undefined : isLight ? 'url(#crestLightRelief)' : 'url(#crestDropGlow)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <LuxuryGoldDefs idPrefix="crest" />
      
      <g filter={filterId}>
        {/* Underlay 3D Relief Shadow for Bevel Rim */}
        <circle
          cx="50.8"
          cy="51.2"
          r="47"
          stroke={isLight ? '#4a2c07' : '#0a0601'}
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          opacity={isLight ? 0.45 : 0.6}
        />

        {/* Outer beaded luxury halo */}
        <circle
          cx="50"
          cy="50"
          r="47"
          stroke={`url(#${gradId})`}
          strokeWidth="1.3"
          strokeDasharray="2.5 2.5"
          opacity={isPrint ? 0.85 : 0.8}
        />

        {/* Inner solid precious metal rim underlay */}
        <circle
          cx="50.6"
          cy="51"
          r="42.5"
          stroke={isLight ? '#452906' : '#0a0601'}
          strokeWidth="1.4"
          opacity={isLight ? 0.45 : 0.6}
        />

        {/* Inner solid precious metal rim */}
        <circle
          cx="50"
          cy="50"
          r="42.5"
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
        />

        {/* Concentric hairline circle */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke={`url(#${gradId})`}
          strokeWidth="0.75"
          opacity={isLight ? 0.65 : 0.55}
        />

        {/* Underlay 3D carved shadow for Monogram O */}
        <path
          d="M 50.8,18.8 C 34.8,18.8 22.8,32.8 22.8,50.8 C 22.8,68.8 34.8,82.8 50.8,82.8 C 66.8,82.8 78.8,68.8 78.8,50.8 C 78.8,32.8 66.8,18.8 50.8,18.8 Z M 50.8,23.8 C 63.8,23.8 72.8,35.8 72.8,50.8 C 72.8,65.8 63.8,77.8 50.8,77.8 C 37.8,77.8 28.8,65.8 28.8,50.8 C 28.8,35.8 37.8,23.8 50.8,23.8 Z"
          fill={isLight ? '#422706' : '#080502'}
          opacity={isLight ? 0.55 : 0.7}
        />

        {/* Calligraphic Ornate Initial 'O' Monogram with bevel rim */}
        <path
          d="M 50,18 C 34,18 22,32 22,50 C 22,68 34,82 50,82 C 66,82 78,68 78,50 C 78,32 66,18 50,18 Z M 50,23 C 63,23 72,35 72,50 C 72,65 63,77 50,77 C 37,77 28,65 28,50 C 28,35 37,23 50,23 Z"
          fill={`url(#${gradId})`}
          stroke={isLight ? '#fff2b8' : '#fffbe8'}
          strokeWidth="0.4"
        />

        {/* Inner Calligraphic Ribbon Flourish */}
        <path
          d="M 33,52 C 37,42 45,36 53,37 C 60,38 65,44 65,51 C 65,59 58,66 49,65 C 41,64 35,57 33,52 Z M 52,41 C 47,41 40,46 40,51 C 40,56 46,61 51,61 C 56,61 60,56 60,51 C 60,45 56,41 52,41 Z"
          fill={`url(#${gradId})`}
          opacity="0.9"
        />

        {/* Center 8-Ray Brilliant Solitaire Diamond Star with 3D Depth */}
        <path
          d="M 50.6,43.6 L 52.2,48.8 L 57.6,50.6 L 52.2,52.4 L 50.6,57.6 L 49,52.4 L 43.6,50.6 L 49,48.8 Z"
          fill={isLight ? '#382003' : '#0a0601'}
          opacity="0.5"
        />
        <path
          d="M 50,43 L 51.6,48.2 L 57,50 L 51.6,51.8 L 50,57 L 48.4,51.8 L 43,50 L 48.4,48.2 Z"
          fill={isPrint ? '#694B0D' : '#FFFBE0'}
        />
        <circle cx="50" cy="50" r="1.6" fill={isPrint ? '#3C2A06' : '#FFE89E'} />
      </g>
    </svg>
  );
}

// Master Typographic Golden Wordmark "OVELZYA" with Haute Joaillerie Subtitle in High Relief
function MasterWordmarkSvg({
  isPrint = false,
  lightMode = false,
  customClass = '',
  showCrest = true,
}: {
  isPrint?: boolean;
  lightMode?: boolean;
  customClass?: string;
  showCrest?: boolean;
}) {
  const isLight = lightMode || isPrint;
  const gradFill = isPrint
    ? 'url(#masterPrintGrad)'
    : isLight
    ? 'url(#masterLightGoldGrad)'
    : 'url(#masterGoldGrad)';
  const sheenFill = isPrint
    ? 'url(#masterPrintGrad)'
    : isLight
    ? 'url(#masterGoldSheen)'
    : 'url(#masterGoldSheen)';
  const filterId = isPrint
    ? undefined
    : isLight
    ? 'url(#masterLightRelief)'
    : 'url(#masterDropGlow)';

  return (
    <svg
      viewBox="0 0 520 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto select-none transition-all duration-300 ${customClass}`}
      style={{ overflow: 'visible' }}
      aria-label="Ovelzya Haute Joaillerie"
    >
      <LuxuryGoldDefs idPrefix="master" />

      <g filter={filterId}>
        {/* Optional Embedded Crest Seal in lockup */}
        {showCrest && (
          <g transform="translate(10, 10)">
            {/* Outer beaded halo shadow */}
            <circle
              cx="45.6"
              cy="45.8"
              r="40"
              stroke={isLight ? '#452906' : '#080502'}
              strokeWidth="1.2"
              strokeDasharray="2.5 2.5"
              opacity={isLight ? 0.45 : 0.6}
            />
            <circle
              cx="45"
              cy="45"
              r="40"
              stroke={gradFill}
              strokeWidth="1.2"
              strokeDasharray="2.5 2.5"
              opacity={isPrint ? 0.85 : 0.8}
            />
            {/* Inner rim */}
            <circle cx="45" cy="45" r="35" stroke={gradFill} strokeWidth="1.4" />
            <circle cx="45" cy="45" r="31" stroke={gradFill} strokeWidth="0.75" opacity="0.45" />

            {/* Monogram O inside seal with 3D shadow */}
            <text
              x="45.8"
              y="59.8"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif"
              fontSize="44"
              fontWeight="700"
              fill={isLight ? '#382003' : '#080502'}
              opacity="0.5"
            >
              O
            </text>
            <text
              x="45"
              y="59"
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif"
              fontSize="44"
              fontWeight="700"
              fill={sheenFill}
              stroke={isLight ? '#fff6cf' : '#fffde8'}
              strokeWidth="0.4"
            >
              O
            </text>

            {/* Radiant Solitaire Star in center */}
            <path
              d="M 45,21 L 46.2,25.2 L 50,26.5 L 46.2,27.8 L 45,32 L 43.8,27.8 L 40,26.5 L 43.8,25.2 Z"
              fill={isPrint ? '#694B0D' : '#FFFDE6'}
            />
          </g>
        )}

        {/* 3D Relief Shadow Extrusion Layer for "OVELZYA" */}
        <text
          x={showCrest ? '115.8' : '15.8'}
          y="75.2"
          fontFamily="'Cinzel', 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          fontSize="68"
          fontWeight="600"
          letterSpacing="0.09em"
          fill={isLight ? '#3f2505' : '#080501'}
          opacity={isLight ? 0.65 : 0.8}
        >
          OVELZYA
        </text>

        {/* The Prestige Wordmark: OVELZYA in High-Relief Chiseled Gold */}
        <text
          x={showCrest ? '115' : '15'}
          y="74"
          fontFamily="'Cinzel', 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          fontSize="68"
          fontWeight="600"
          letterSpacing="0.09em"
          fill={gradFill}
          stroke={isLight ? '#fff2b8' : '#fffbe8'}
          strokeWidth="0.4"
        >
          OVELZYA
        </text>

        {/* Specular Top-Edge Sheen Reflection for 3D Ingot Effect */}
        <text
          x={showCrest ? '114.6' : '14.6'}
          y="73.5"
          fontFamily="'Cinzel', 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          fontSize="68"
          fontWeight="600"
          letterSpacing="0.09em"
          fill="none"
          stroke="url(#masterGoldSheen)"
          strokeWidth="0.35"
          opacity={0.8}
        >
          OVELZYA
        </text>

        {/* Decorative Gold Accent Bar under Brand Name with 3D Depth */}
        <path
          d={
            showCrest
              ? 'M 116.5,85 L 380.5,85 M 405.5,85 L 465.5,85'
              : 'M 16.5,85 L 360.5,85 M 390.5,85 L 460.5,85'
          }
          stroke={isLight ? '#452906' : '#0a0602'}
          strokeWidth="0.75"
          opacity={0.4}
        />
        <path
          d={
            showCrest
              ? 'M 116,84 L 380,84 M 405,84 L 465,84'
              : 'M 16,84 L 360,84 M 390,84 L 460,84'
          }
          stroke={gradFill}
          strokeWidth="0.8"
          opacity={0.75}
        />

        {/* Small Central Jewelry Diamond Star Divider */}
        <polygon
          points={
            showCrest
              ? '392,84 397,81.5 402,84 397,86.5'
              : '375,84 380,81.5 385,84 380,86.5'
          }
          fill={gradFill}
        />

        {/* Subtitle: HAUTE JOAILLERIE */}
        <text
          x={showCrest ? '118' : '18'}
          y="102"
          fontFamily="'Cairo', 'Cinzel', 'Inter', sans-serif"
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.32em"
          fill={isPrint ? '#694B0D' : isLight ? '#8a600d' : '#C5A85C'}
        >
          HAUTE JOAILLERIE
        </text>
      </g>
    </svg>
  );
}

// Minimalist Horizontal Wordmark in 3D Relief
function CleanWordmarkSvg({
  isPrint = false,
  lightMode = false,
  customClass = '',
}: {
  isPrint?: boolean;
  lightMode?: boolean;
  customClass?: string;
}) {
  const isLight = lightMode || isPrint;
  const gradFill = isPrint
    ? 'url(#cleanPrintGrad)'
    : isLight
    ? 'url(#cleanLightGoldGrad)'
    : 'url(#cleanGoldGrad)';
  const filterId = isPrint
    ? undefined
    : isLight
    ? 'url(#cleanLightRelief)'
    : 'url(#cleanDropGlow)';

  return (
    <svg
      viewBox="0 0 410 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto select-none transition-all duration-300 ${customClass}`}
      style={{ overflow: 'visible' }}
      aria-label="Ovelzya"
    >
      <LuxuryGoldDefs idPrefix="clean" />
      <g filter={filterId}>
        {/* 3D Relief shadow */}
        <text
          x="5.8"
          y="53.2"
          fontFamily="'Cinzel', 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          fontSize="56"
          fontWeight="600"
          letterSpacing="0.1em"
          fill={isLight ? '#3f2505' : '#080501'}
          opacity={isLight ? 0.65 : 0.8}
        >
          OVELZYA
        </text>
        <text
          x="5"
          y="52"
          fontFamily="'Cinzel', 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          fontSize="56"
          fontWeight="600"
          letterSpacing="0.1em"
          fill={gradFill}
          stroke={isLight ? '#fff2b8' : '#fffbe8'}
          strokeWidth="0.4"
        >
          OVELZYA
        </text>
        <text
          x="8"
          y="70"
          fontFamily="'Cairo', 'Cinzel', 'Inter', sans-serif"
          fontSize="11.5"
          fontWeight="600"
          letterSpacing="0.3em"
          fill={isPrint ? '#694B0D' : isLight ? '#8a600d' : '#C5A85C'}
        >
          HAUTE JOAILLERIE
        </text>
      </g>
    </svg>
  );
}

function getClientLogoSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('ovelzya_custom_logo') || '';
}

function subscribeToLogo(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('ovelzya_logo_updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('ovelzya_logo_updated', callback);
    window.removeEventListener('storage', callback);
  };
}

export default function OvelzyaLogo({
  variant = 'header',
  className = '',
  showSubtitle = true,
  size = 'md',
  lightMode = false,
  customLogoUrl,
}: OvelzyaLogoProps) {
  const heightClass = getHeightClass(size);
  const clientStoredLogo = React.useSyncExternalStore(
    subscribeToLogo,
    getClientLogoSnapshot,
    () => ''
  );

  const [isDocLight, setIsDocLight] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      setIsDocLight(document.documentElement.classList.contains('light'));
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const isLight = lightMode || isDocLight;
  const logoSrc = customLogoUrl !== undefined ? (customLogoUrl || null) : (clientStoredLogo || null);

  // If a custom manual PNG logo image has been added, render it
  if (logoSrc) {
    if (variant === 'crest') {
      const dim = size === 'sm' ? 28 : size === 'lg' ? 46 : size === 'xl' ? 60 : 36;
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Ovelzya Logo"
            width={dim}
            height={dim}
            className="w-auto max-h-full object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] select-none filter contrast-105"
            style={{ maxHeight: `${dim}px`, maxWidth: `${dim}px` }}
          />
        </div>
      );
    }

    if (variant === 'invoice') {
      return (
        <div className={`flex flex-col items-start select-none ${className}`}>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Ovelzya Logo"
              className="h-10 sm:h-12 w-auto max-w-[240px] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] select-none"
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.24em] text-neutral-600 uppercase block mt-1">
            Maison de Haute Joaillerie &bull; Casablanca &bull; Paris
          </span>
        </div>
      );
    }

    if (variant === 'footer') {
      return (
        <div className={`flex flex-col items-start select-none ${className}`}>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Ovelzya Logo"
              className="h-9 sm:h-11 w-auto max-w-[220px] object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] select-none"
            />
          </div>
          {showSubtitle && (
            <span className="text-[9px] sm:text-[10px] text-[#9a958a] uppercase tracking-[0.22em] font-sans font-light mt-1.5 block">
              Maison de Haute Joaillerie 316L & Maroquinerie d&apos;Exception
            </span>
          )}
        </div>
      );
    }

    if (variant === 'full') {
      return (
        <div className={`flex flex-col items-center text-center select-none ${className}`}>
          <div className="relative py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Ovelzya Logo"
              className="h-14 sm:h-20 w-auto max-w-[320px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] select-none"
            />
          </div>
          {showSubtitle && (
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#c5a85c] font-light mt-1">
              <span>Or 18K PVD</span>
              <span className="text-[#d4af37]">✦</span>
              <span>Acier Chirurgical 316L</span>
              <span className="text-[#d4af37]">✦</span>
              <span>Casablanca</span>
            </div>
          )}
        </div>
      );
    }

    // Default: Header
    return (
      <div className={`flex items-center select-none group cursor-pointer ${className}`}>
        <div className="relative transition-transform duration-300 group-hover:scale-[1.02]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Ovelzya Logo"
            className={`${heightClass} w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] select-none`}
          />
        </div>
      </div>
    );
  }

  // Variant: CREST (Pure vector jewelry emblem seal in 3D relief)
  if (variant === 'crest') {
    const dim = size === 'sm' ? 28 : size === 'lg' ? 46 : size === 'xl' ? 60 : 36;
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <OvelzyaCrestSvg size={dim} isPrint={false} lightMode={isLight} />
      </div>
    );
  }

  // Variant: FULL (Prominent luxury brand lockup in 3D relief for Hero, Splash, Auth modal)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <div className="relative py-1">
          <MasterWordmarkSvg
            isPrint={false}
            lightMode={isLight}
            showCrest={true}
            customClass="h-14 sm:h-20 w-auto"
          />
        </div>
        {showSubtitle && (
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#c5a85c] font-light mt-1">
            <span>Or 18K PVD</span>
            <span className="text-[#d4af37]">✦</span>
            <span>Acier Chirurgical 316L</span>
            <span className="text-[#d4af37]">✦</span>
            <span>Casablanca</span>
          </div>
        )}
      </div>
    );
  }

  // Variant: INVOICE (Crisp Print-Optimized Luxury Wordmark for Official Invoices & PDF)
  if (variant === 'invoice') {
    return (
      <div className={`flex flex-col items-start select-none ${className}`}>
        <div className="relative">
          <MasterWordmarkSvg
            isPrint={true}
            lightMode={true}
            showCrest={true}
            customClass="h-10 sm:h-12 w-auto"
          />
        </div>
        <span className="text-[10px] font-mono tracking-[0.24em] text-neutral-600 uppercase block mt-1">
          Maison de Haute Joaillerie &bull; Casablanca &bull; Paris
        </span>
      </div>
    );
  }

  // Variant: FOOTER (Balanced horizontal brand hallmark)
  if (variant === 'footer') {
    return (
      <div className={`flex flex-col items-start select-none ${className}`}>
        <div className="relative">
          <MasterWordmarkSvg
            isPrint={false}
            lightMode={isLight}
            showCrest={true}
            customClass="h-9 sm:h-11 w-auto"
          />
        </div>
        {showSubtitle && (
          <span className="text-[9px] sm:text-[10px] text-[#9a958a] uppercase tracking-[0.22em] font-sans font-light mt-1.5 block">
            Maison de Haute Joaillerie 316L & Maroquinerie d&apos;Exception
          </span>
        )}
      </div>
    );
  }

  // Default: HEADER (Horizontal, prestigious navigation logo, strictly vector typography & emblem in 3D relief)
  return (
    <div className={`flex items-center select-none group cursor-pointer ${className}`}>
      <div className="relative transition-transform duration-300 group-hover:scale-[1.02]">
        <MasterWordmarkSvg
          isPrint={false}
          lightMode={isLight}
          showCrest={true}
          customClass={heightClass}
        />
      </div>
    </div>
  );
}
