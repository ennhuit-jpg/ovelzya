'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Calculator,
  Ruler,
  Sparkles,
  Check,
  Copy,
  Info,
  CircleDot,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '@/lib/types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface OvelzyaRingSize {
  size: number;
  circumferenceMm: number;
  diameterMm: number;
  usSize: string;
  ukSize: string;
}

const OVELZYA_SIZES: OvelzyaRingSize[] = [
  { size: 48, circumferenceMm: 48.0, diameterMm: 15.3, usSize: '4.5', ukSize: 'I ½' },
  { size: 50, circumferenceMm: 50.0, diameterMm: 15.9, usSize: '5.25', ukSize: 'K' },
  { size: 52, circumferenceMm: 52.0, diameterMm: 16.6, usSize: '6', ukSize: 'L ½' },
  { size: 54, circumferenceMm: 54.0, diameterMm: 17.2, usSize: '6.75', ukSize: 'N' },
  { size: 56, circumferenceMm: 56.0, diameterMm: 17.8, usSize: '7.5', ukSize: 'O ½' },
  { size: 58, circumferenceMm: 58.0, diameterMm: 18.5, usSize: '8.25', ukSize: 'Q' },
  { size: 60, circumferenceMm: 60.0, diameterMm: 19.1, usSize: '9', ukSize: 'R ½' },
  { size: 62, circumferenceMm: 62.0, diameterMm: 19.7, usSize: '10', ukSize: 'T ½' },
  { size: 64, circumferenceMm: 64.0, diameterMm: 20.4, usSize: '10.75', ukSize: 'V' },
  { size: 66, circumferenceMm: 66.0, diameterMm: 21.0, usSize: '11.5', ukSize: 'W ½' },
];

const US_SIZE_MAP: { us: string; circum: number }[] = [
  { us: '4', circum: 46.8 },
  { us: '4.5', circum: 48.0 },
  { us: '5', circum: 49.3 },
  { us: '5.5', circum: 50.6 },
  { us: '6', circum: 51.9 },
  { us: '6.5', circum: 53.1 },
  { us: '7', circum: 54.4 },
  { us: '7.5', circum: 55.7 },
  { us: '8', circum: 57.0 },
  { us: '8.5', circum: 58.3 },
  { us: '9', circum: 59.5 },
  { us: '9.5', circum: 60.8 },
  { us: '10', circum: 62.1 },
  { us: '10.5', circum: 63.4 },
  { us: '11', circum: 64.6 },
  { us: '11.5', circum: 65.9 },
  { us: '12', circum: 67.2 },
];

export default function SizeGuideModal({ isOpen, onClose, lang }: SizeGuideModalProps) {
  // Calculator mode: 'circumference' (mm) | 'usual' (taille habituelle FR/US) | 'diameter' (diamètre bague)
  const [calcMode, setCalcMode] = useState<'circumference' | 'usual' | 'diameter'>('circumference');
  const [circumferenceInput, setCircumferenceInput] = useState<number>(52);
  const [diameterInput, setDiameterInput] = useState<number>(16.6);
  const [usualStandard, setUsualStandard] = useState<'FR' | 'US'>('FR');
  const [usualFrInput, setUsualFrInput] = useState<number>(52);
  const [usualUsInput, setUsualUsInput] = useState<string>('6');
  const [copied, setCopied] = useState(false);

  // Compute recommended size based on current mode
  const recommendation = useMemo(() => {
    let effectiveCircumference = 52;
    let inputSourceLabel = '';

    if (calcMode === 'circumference') {
      effectiveCircumference = Math.max(44, Math.min(72, Number(circumferenceInput) || 52));
      inputSourceLabel = `${effectiveCircumference.toFixed(1).replace('.0', '')} mm`;
    } else if (calcMode === 'diameter') {
      const d = Math.max(14, Math.min(23, Number(diameterInput) || 16.6));
      effectiveCircumference = d * Math.PI;
      inputSourceLabel = `Ø ${d.toFixed(1)} mm (~${effectiveCircumference.toFixed(1)} mm)`;
    } else {
      // usual size
      if (usualStandard === 'FR') {
        const frVal = Number(usualFrInput) || 52;
        effectiveCircumference = frVal;
        inputSourceLabel = `Taille FR ${frVal}`;
      } else {
        const found = US_SIZE_MAP.find((item) => item.us === usualUsInput);
        effectiveCircumference = found ? found.circum : 52;
        inputSourceLabel = `US Size ${usualUsInput}`;
      }
    }

    // Find closest Ovelzya size
    let bestSize = OVELZYA_SIZES[0];
    let minDiff = 999;
    let isBetween = false;
    let lowerSize: OvelzyaRingSize | null = null;
    let upperSize: OvelzyaRingSize | null = null;

    if (effectiveCircumference <= OVELZYA_SIZES[0].circumferenceMm) {
      bestSize = OVELZYA_SIZES[0];
    } else if (effectiveCircumference >= OVELZYA_SIZES[OVELZYA_SIZES.length - 1].circumferenceMm) {
      bestSize = OVELZYA_SIZES[OVELZYA_SIZES.length - 1];
    } else {
      for (let i = 0; i < OVELZYA_SIZES.length - 1; i++) {
        const low = OVELZYA_SIZES[i];
        const high = OVELZYA_SIZES[i + 1];
        if (effectiveCircumference >= low.circumferenceMm && effectiveCircumference <= high.circumferenceMm) {
          lowerSize = low;
          upperSize = high;
          const diffLow = effectiveCircumference - low.circumferenceMm;
          const diffHigh = high.circumferenceMm - effectiveCircumference;

          if (diffLow < 0.3) {
            bestSize = low;
            isBetween = false;
          } else if (diffHigh < 0.3) {
            bestSize = high;
            isBetween = false;
          } else {
            // In high jewelry, if between two sizes, recommend the upper size for daily knuckle comfort
            bestSize = high;
            isBetween = true;
          }
          break;
        }
      }
    }

    // Advice note
    let adviceText = '';
    if (lang === 'fr') {
      if (isBetween && lowerSize && upperSize) {
        adviceText = `Votre mesure se situe entre les tailles ${lowerSize.size} et ${upperSize.size}. La Maison Ovelzya vous préconise la taille ${bestSize.size} afin de garantir une aisance parfaite lors des variations de température.`;
      } else if (effectiveCircumference < 48) {
        adviceText = `Votre mesure (${effectiveCircumference.toFixed(1)} mm) est inférieure au standard 48. La taille 48 conviendra idéalement pour un porté confortable ou auriculaire.`;
      } else if (effectiveCircumference > 66) {
        adviceText = `Votre mesure (${effectiveCircumference.toFixed(1)} mm) dépasse le standard 66. La taille 66 est notre plus grande référence, ou contactez notre Atelier pour un sur-mesure.`;
      } else {
        adviceText = `Ajustement idéal : la taille ${bestSize.size} épouse harmonieusement votre tour de doigt (${bestSize.circumferenceMm} mm, diamètre intérieur ${bestSize.diameterMm.toFixed(1)} mm).`;
      }
    } else if (lang === 'ar') {
      if (isBetween && lowerSize && upperSize) {
        adviceText = `قياسك يقع بين المقاسين ${lowerSize.size} و ${upperSize.size}. تنصح دار أوفيلزيا باختيار المقاس ${bestSize.size} لضمان راحة مثالية طوال اليوم مع تغير درجات الحرارة.`;
      } else if (effectiveCircumference < 48) {
        adviceText = `قياسك أصغر من المقاس القياسي 48. المقاس 48 هو الأنسب للأصابع الدقيقة.`;
      } else if (effectiveCircumference > 66) {
        adviceText = `قياسك يفوق 66 مم. المقاس 66 هو أكبر مقاس لدينا، ويمكنكم طلب مقاس خاص من ورشتنا.`;
      } else {
        adviceText = `تطابق مثالي : المقاس ${bestSize.size} يناسب تماماً قياس إصبعك (${bestSize.circumferenceMm} مم، قطر داخلي ${bestSize.diameterMm.toFixed(1)} مم).`;
      }
    } else {
      if (isBetween && lowerSize && upperSize) {
        adviceText = `Your measurement is between sizes ${lowerSize.size} and ${upperSize.size}. Maison Ovelzya recommends size ${bestSize.size} for all-day comfort.`;
      } else {
        adviceText = `Perfect fit: Size ${bestSize.size} matches your finger circumference (${bestSize.circumferenceMm} mm, inner diameter ${bestSize.diameterMm.toFixed(1)} mm).`;
      }
    }

    return {
      bestSize,
      isBetween,
      lowerSize,
      upperSize,
      effectiveCircumference,
      inputSourceLabel,
      adviceText,
    };
  }, [calcMode, circumferenceInput, diameterInput, usualStandard, usualFrInput, usualUsInput, lang]);

  const handleCopySize = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`Taille Ovelzya : ${recommendation.bestSize.size}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md">
      <div className="bg-[#121212] border border-[#d4af37]/40 rounded-xl w-full max-w-2xl p-5 sm:p-7 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto text-left">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9a958a] hover:text-white p-1.5 rounded-full hover:bg-white/5 transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[10px] uppercase tracking-widest font-semibold text-[#d4af37]">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              {lang === 'fr'
                ? 'Atelier Joaillier Ovelzya'
                : lang === 'ar'
                ? 'ورشة مجوهرات أوفيلزيا'
                : 'Ovelzya High Jewelry Atelier'}
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-white mt-1.5 tracking-tight">
            {lang === 'fr'
              ? 'Guide & Calculateur de Taille'
              : lang === 'ar'
              ? 'دليل وحاسبة المقاسات الذكية'
              : 'Size Guide & Smart Calculator'}
          </h3>
          <p className="text-xs sm:text-sm text-[#9a958a] mt-1 leading-relaxed">
            {lang === 'fr'
              ? 'Trouvez instantanément la taille Ovelzya parfaite pour votre bague grâce à notre calculateur joaillier interactif.'
              : lang === 'ar'
              ? 'حددي مقاس خاتمكِ المثالي لدى أوفيلزيا فوراً من خلال حاسبتنا التفاعلية الدقيقة.'
              : 'Find your perfect Ovelzya ring size instantly using our interactive jeweler calculator.'}
          </p>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE CALCULATOR SECTION */}
        {/* ======================================================== */}
        <div className="bg-[#171717] border border-[#2d281f] rounded-xl p-4 sm:p-5 shadow-inner space-y-4">
          <div className="flex items-center justify-between border-b border-[#262420] pb-3">
            <div className="flex items-center gap-2 text-[#d4af37]">
              <Calculator className="w-4 h-4 text-[#d4af37]" />
              <span className="font-serif text-sm font-semibold tracking-wide text-white">
                {lang === 'fr'
                  ? 'Calculateur Interactif de Bague'
                  : lang === 'ar'
                  ? 'حاسبة مقاس الخاتم التفاعلية'
                  : 'Interactive Ring Size Calculator'}
              </span>
            </div>
            <span className="text-[11px] text-[#9a958a] hidden sm:inline">
              {lang === 'fr' ? 'Recommandation joaillière' : lang === 'ar' ? 'توصية الخبراء' : 'Jeweler precision'}
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div>
            <label className="block text-[11px] font-medium text-[#9a958a] uppercase tracking-wider mb-2">
              {lang === 'fr'
                ? 'Comment souhaitez-vous trouver votre taille ?'
                : lang === 'ar'
                ? 'كيف ترغبين في إدخال مقاسكِ ؟'
                : 'How would you like to calculate your size?'}
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-[#0e0e0e] p-1 rounded-lg border border-[#222]">
              <button
                type="button"
                onClick={() => setCalcMode('circumference')}
                className={`py-2 px-2 text-center rounded text-[11px] sm:text-xs font-medium transition cursor-pointer ${
                  calcMode === 'circumference'
                    ? 'bg-[#d4af37] text-black font-semibold shadow'
                    : 'text-[#cfcbc2] hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'fr'
                  ? 'Circonférence (mm)'
                  : lang === 'ar'
                  ? 'محيط الإصبع (مم)'
                  : 'Circumference (mm)'}
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('usual')}
                className={`py-2 px-2 text-center rounded text-[11px] sm:text-xs font-medium transition cursor-pointer ${
                  calcMode === 'usual'
                    ? 'bg-[#d4af37] text-black font-semibold shadow'
                    : 'text-[#cfcbc2] hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'fr'
                  ? 'Taille habituelle'
                  : lang === 'ar'
                  ? 'المقاس المعتاد'
                  : 'Usual Size'}
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('diameter')}
                className={`py-2 px-2 text-center rounded text-[11px] sm:text-xs font-medium transition cursor-pointer ${
                  calcMode === 'diameter'
                    ? 'bg-[#d4af37] text-black font-semibold shadow'
                    : 'text-[#cfcbc2] hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'fr'
                  ? 'Diamètre intérieur'
                  : lang === 'ar'
                  ? 'القطر الداخلي'
                  : 'Inner Diameter'}
              </button>
            </div>
          </div>

          {/* MODE 1: CIRCUMFERENCE */}
          {calcMode === 'circumference' && (
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-[#cfcbc2]">
                  {lang === 'fr'
                    ? 'Tour de votre doigt (avec ruban métrique ou bandelette) :'
                    : lang === 'ar'
                    ? 'محيط إصبعكِ (باستخدام شريط قياس أو ورقة رفيعة) :'
                    : 'Finger circumference (using a soft tape or paper strip):'}
                </span>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCircumferenceInput((prev) => Math.max(46, prev - 1))}
                    className="w-7 h-7 rounded border border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37] flex items-center justify-center text-sm font-semibold transition"
                  >
                    -
                  </button>
                  <div className="flex items-center bg-[#0d0d0d] border border-[#d4af37]/40 rounded px-2.5 py-1">
                    <input
                      type="number"
                      min={46}
                      max={70}
                      step={0.5}
                      value={circumferenceInput}
                      onChange={(e) => setCircumferenceInput(Number(e.target.value))}
                      className="w-14 bg-transparent text-center text-white font-mono text-sm font-bold focus:outline-none"
                    />
                    <span className="text-xs text-[#d4af37] font-semibold">mm</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCircumferenceInput((prev) => Math.min(68, prev + 1))}
                    className="w-7 h-7 rounded border border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37] flex items-center justify-center text-sm font-semibold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Range Slider */}
              <div className="pt-1">
                <input
                  type="range"
                  min={46}
                  max={68}
                  step={0.5}
                  value={circumferenceInput}
                  onChange={(e) => setCircumferenceInput(Number(e.target.value))}
                  className="w-full accent-[#d4af37] cursor-pointer h-2 bg-[#262626] rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-[#7a756d] mt-1 font-mono">
                  <span>46 mm</span>
                  <span>50 mm</span>
                  <span>54 mm</span>
                  <span>58 mm</span>
                  <span>62 mm</span>
                  <span>68 mm</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-[#888] mr-1">
                  {lang === 'fr' ? 'Repères fréquents :' : lang === 'ar' ? 'مقاسات شائعة :' : 'Quick select:'}
                </span>
                {[48, 50, 52, 54, 56, 58, 60, 62].map((mm) => (
                  <button
                    key={mm}
                    type="button"
                    onClick={() => setCircumferenceInput(mm)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                      circumferenceInput === mm
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'bg-[#222] text-[#bbb] hover:bg-[#333] hover:text-white'
                    }`}
                  >
                    {mm}mm
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 2: USUAL RING SIZE */}
          {calcMode === 'usual' && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9a958a]">
                  {lang === 'fr' ? 'Norme habituelle :' : lang === 'ar' ? 'النظام المعتاد :' : 'Standard:'}
                </span>
                <div className="inline-flex rounded border border-[#333] overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setUsualStandard('FR')}
                    className={`px-3 py-1 font-semibold transition ${
                      usualStandard === 'FR' ? 'bg-[#d4af37] text-black' : 'bg-[#181818] text-[#aaa]'
                    }`}
                  >
                    FR (France / Europe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsualStandard('US')}
                    className={`px-3 py-1 font-semibold transition ${
                      usualStandard === 'US' ? 'bg-[#d4af37] text-black' : 'bg-[#181818] text-[#aaa]'
                    }`}
                  >
                    US / USA
                  </button>
                </div>
              </div>

              {usualStandard === 'FR' ? (
                <div className="space-y-2">
                  <label className="block text-xs text-[#cfcbc2]">
                    {lang === 'fr'
                      ? 'Sélectionnez votre taille française habituelle :'
                      : lang === 'ar'
                      ? 'اختاري مقاسكِ الفرنسي المعتاد :'
                      : 'Select your usual French size:'}
                  </label>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {[48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66].map(
                      (sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setUsualFrInput(sz)}
                          className={`py-1.5 text-center text-xs font-serif rounded transition ${
                            usualFrInput === sz
                              ? 'bg-[#d4af37] text-black font-bold ring-1 ring-[#e8c878]'
                              : 'bg-[#202020] text-[#cfcbc2] hover:bg-[#2b2b2b]'
                          }`}
                        >
                          {sz}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs text-[#cfcbc2]">
                    {lang === 'fr'
                      ? 'Sélectionnez votre taille américaine habituelle (US) :'
                      : lang === 'ar'
                      ? 'اختاري مقاسكِ الأمريكي المعتاد (US) :'
                      : 'Select your usual US size:'}
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {US_SIZE_MAP.map((item) => (
                      <button
                        key={item.us}
                        type="button"
                        onClick={() => setUsualUsInput(item.us)}
                        className={`py-1.5 text-center text-xs font-serif rounded transition ${
                          usualUsInput === item.us
                            ? 'bg-[#d4af37] text-black font-bold ring-1 ring-[#e8c878]'
                            : 'bg-[#202020] text-[#cfcbc2] hover:bg-[#2b2b2b]'
                        }`}
                      >
                        US {item.us}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: INNER DIAMETER */}
          {calcMode === 'diameter' && (
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-[#cfcbc2]">
                  {lang === 'fr'
                    ? 'Diamètre intérieur d’une bague existante (en mm) :'
                    : lang === 'ar'
                    ? 'القطر الداخلي لخاتم موجود لديكِ (بالملم) :'
                    : 'Inner diameter of an existing ring (in mm):'}
                </span>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setDiameterInput((prev) => Math.max(14.5, +(prev - 0.2).toFixed(1)))}
                    className="w-7 h-7 rounded border border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37] flex items-center justify-center text-sm font-semibold transition"
                  >
                    -
                  </button>
                  <div className="flex items-center bg-[#0d0d0d] border border-[#d4af37]/40 rounded px-2.5 py-1">
                    <input
                      type="number"
                      min={14.5}
                      max={22.0}
                      step={0.1}
                      value={diameterInput}
                      onChange={(e) => setDiameterInput(Number(e.target.value))}
                      className="w-14 bg-transparent text-center text-white font-mono text-sm font-bold focus:outline-none"
                    />
                    <span className="text-xs text-[#d4af37] font-semibold">mm</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDiameterInput((prev) => Math.min(22.0, +(prev + 0.2).toFixed(1)))}
                    className="w-7 h-7 rounded border border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37] flex items-center justify-center text-sm font-semibold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Diameter Slider */}
              <div className="pt-1">
                <input
                  type="range"
                  min={14.8}
                  max={21.5}
                  step={0.1}
                  value={diameterInput}
                  onChange={(e) => setDiameterInput(Number(e.target.value))}
                  className="w-full accent-[#d4af37] cursor-pointer h-2 bg-[#262626] rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-[#7a756d] mt-1 font-mono">
                  <span>15.0 mm</span>
                  <span>16.5 mm</span>
                  <span>18.0 mm</span>
                  <span>19.5 mm</span>
                  <span>21.0 mm</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* RESULT BOX: RECOMMENDED OVELZYA SIZE */}
          {/* ======================================================== */}
          <div className="mt-4 rounded-xl border border-[#d4af37]/60 bg-gradient-to-br from-[#211a0d] via-[#161410] to-[#1a1711] p-4 sm:p-5 relative overflow-hidden shadow-lg">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              {/* Left Column: Size Display */}
              <div className="flex items-center gap-4">
                {/* Visual Ring Badge */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      stroke="#332a18"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      stroke="#d4af37"
                      strokeWidth="4"
                      strokeDasharray="188.4"
                      strokeDashoffset="30"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#e8c878]">
                      {recommendation.bestSize.size}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-[#cfcbc2]">
                      OVELZYA
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      {lang === 'fr'
                        ? 'Taille Ovelzya Recommandée'
                        : lang === 'ar'
                        ? 'مقاس أوفيلزيا الموصى به'
                        : 'Recommended Ovelzya Size'}
                    </span>
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide mt-0.5">
                    {lang === 'fr' ? 'Taille' : lang === 'ar' ? 'المقاس' : 'Size'}{' '}
                    <span className="text-[#d4af37]">{recommendation.bestSize.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#cfcbc2] mt-1 font-mono">
                    <span>Circonférence : {recommendation.bestSize.circumferenceMm} mm</span>
                    <span>·</span>
                    <span>Diamètre : {recommendation.bestSize.diameterMm.toFixed(1)} mm</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy button & Equivalences */}
              <div className="flex flex-col sm:items-end justify-between gap-2 border-t sm:border-t-0 border-[#2e2618] pt-3 sm:pt-0">
                <div className="text-[11px] text-[#9a958a] sm:text-right">
                  <span className="text-white font-medium">Équivalences : </span>
                  <span className="text-[#d4af37]">US {recommendation.bestSize.usSize}</span>
                  {' · '}
                  <span className="text-[#d4af37]">UK {recommendation.bestSize.ukSize}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySize}
                  className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#272115] hover:bg-[#342c1a] border border-[#d4af37]/40 text-xs text-[#e8c878] font-medium transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>{lang === 'fr' ? 'Taille copiée !' : lang === 'ar' ? 'تم النسخ !' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'fr'
                          ? 'Mémoriser ma taille'
                          : lang === 'ar'
                          ? 'حفظ مقاسي'
                          : 'Save / Copy size'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Jewelers' Advice Box */}
            <div className="mt-3.5 pt-3 border-t border-[#312818] flex items-start gap-2 text-xs text-[#d6d0c4] leading-relaxed">
              <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <p>{recommendation.adviceText}</p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* OFFICIAL REFERENCE TABLE (With dynamic highlighting) */}
        {/* ======================================================== */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs uppercase font-serif tracking-widest text-[#d4af37] font-semibold">
              {lang === 'fr'
                ? 'Tableau d’Équivalence Joaillerie'
                : lang === 'ar'
                ? 'جدول المقاسات والمطابقة الكامل'
                : 'Jewelry Reference Table'}
            </h4>
            <span className="text-[11px] text-[#777]">
              {lang === 'fr'
                ? 'Ligne en surbrillance = votre recommandation'
                : lang === 'ar'
                ? 'الصف المضيء = مقاسك الموصى به'
                : 'Highlighted row = your recommendation'}
            </span>
          </div>

          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden bg-[#161616]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-[#d4af37] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-2.5">
                    {lang === 'fr' ? 'Circonférence' : lang === 'ar' ? 'المحيط' : 'Circumference'}
                  </th>
                  <th className="p-2.5">
                    {lang === 'fr' ? 'Taille Ovelzya (FR)' : lang === 'ar' ? 'مقاس أوفيلزيا' : 'Ovelzya Size (FR)'}
                  </th>
                  <th className="p-2.5">
                    {lang === 'fr' ? 'Diamètre Intérieur' : lang === 'ar' ? 'القطر الداخلي' : 'Inner Diameter'}
                  </th>
                  <th className="p-2.5 hidden sm:table-cell">US / UK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-[#cfcbc2]">
                {OVELZYA_SIZES.map((item) => {
                  const isSelected = item.size === recommendation.bestSize.size;
                  return (
                    <tr
                      key={item.size}
                      className={`transition ${
                        isSelected
                          ? 'bg-[#d4af37]/20 border-l-4 border-l-[#d4af37] text-white font-semibold'
                          : 'hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <td className="p-2.5 font-medium flex items-center gap-1.5">
                        {item.circumferenceMm} mm
                        {isSelected && (
                          <span className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded bg-[#d4af37] text-black font-bold uppercase tracking-wider">
                            ✦ {lang === 'fr' ? 'Idéale' : lang === 'ar' ? 'المثالي' : 'Best'}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-serif font-bold text-[#d4af37]">
                        {item.size}
                      </td>
                      <td className="p-2.5">{item.diameterMm.toFixed(1).replace('.', ',')} mm</td>
                      <td className="p-2.5 text-[#9a958a] hidden sm:table-cell">
                        US {item.usSize} · UK {item.ukSize}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bracelets & Collars Guide */}
        <div className="space-y-2 text-xs text-[#9a958a] bg-[#161616] p-3.5 rounded-lg border border-[#262626]">
          <h4 className="text-white font-semibold flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>
              {lang === 'fr' ? 'Bracelets & Colliers :' : lang === 'ar' ? 'الأساور والقلادات :' : 'Bracelets & Necklaces :'}
            </span>
          </h4>
          <p>
            {lang === 'fr'
              ? '• Bracelets : Tour de poignet 15-16 cm → Taille 17 cm · 16-17 cm → 18 cm · 18-19 cm → 20 cm.'
              : lang === 'ar'
              ? '• الأساور : معصم 15-16 سم → مقاس 17 سم · 16-17 سم → 18 سم · 18-19 سم → 20 سم.'
              : '• Bracelets: Wrist 15-16 cm → Size 17 cm · 16-17 cm → 18 cm · 18-19 cm → 20 cm.'}
          </p>
          <p>
            {lang === 'fr'
              ? '• Colliers : 45 cm (ras-de-cou délicat), 50 cm (standard clavicule), 60 cm (sautoir impérial).'
              : lang === 'ar'
              ? '• القلادات : 45 سم (لاصقة)، 50 سم (قياسية)، 60 سم (طويلة ملكية).'
              : '• Necklaces: 45 cm (choker), 50 cm (standard collarbone), 60 cm (opera length).'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#d4af37] hover:bg-[#e8c878] text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition shadow-md cursor-pointer font-serif flex items-center justify-center gap-2"
        >
          <span>
            {lang === 'fr'
              ? `J'ai trouvé ma taille (${recommendation.bestSize.size}) ✦`
              : lang === 'ar'
              ? `وجدت مقاسي (${recommendation.bestSize.size}) ✦`
              : `Found my size (${recommendation.bestSize.size}) ✦`}
          </span>
        </button>
      </div>
    </div>
  );
}

