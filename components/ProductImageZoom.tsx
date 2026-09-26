'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  fallbackSeed?: string;
  images?: string[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  lang?: string;
}

export default function ProductImageZoom({
  src,
  alt,
  fallbackSeed = 'bijou',
  images = [],
  currentIndex = 0,
  onIndexChange,
  lang = 'fr',
}: ProductImageZoomProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState<number>(2.5);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPos, setLightboxPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const fallbackUrl = `https://picsum.photos/seed/${fallbackSeed}/1200/1500`;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Lightbox handlers
  const handleLightboxMouseDown = (e: React.MouseEvent) => {
    if (lightboxZoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - lightboxPos.x, y: e.clientY - lightboxPos.y });
  };

  const handleLightboxMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || lightboxZoom <= 1) return;
    setLightboxPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleLightboxMouseUp = () => setIsDragging(false);

  const zoomIn = () => setLightboxZoom((prev) => Math.min(4, prev + 0.5));
  const zoomOut = () => {
    setLightboxZoom((prev) => {
      const next = Math.max(1, prev - 0.5);
      if (next === 1) setLightboxPos({ x: 0, y: 0 });
      return next;
    });
  };

  const hasMultiple = images.length > 1;

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full aspect-[4/5] bg-[#121212] overflow-hidden rounded select-none cursor-crosshair group"
      >
        {/* Main Base Image with Zoom Transform */}
        <div className="w-full h-full overflow-hidden relative">
          <img
            src={src || fallbackUrl}
            alt={alt}
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: isHovered ? `scale(${zoomLevel})` : 'scale(1)',
              transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s ease-out',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackUrl;
            }}
            className="w-full h-full object-cover will-change-transform pointer-events-none"
          />
        </div>

        {/* Hover Zoom Lens Indicator Crosshair */}
        {isHovered && (
          <div
            className="absolute pointer-events-none w-28 h-28 border border-[#d4af37]/60 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.35)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
            style={{
              left: `${zoomPos.x}%`,
              top: `${zoomPos.y}%`,
              background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-[#d4af37]/70 text-[9px] font-mono font-bold">
              ✦ {zoomLevel}x
            </div>
          </div>
        )}

        {/* Top Badges: Inspection Hint & Magnification switch */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur border border-[#d4af37]/40 text-[11px] text-[#f4f1ea] transition-all duration-300 ${
              isHovered ? 'opacity-90 bg-[#16140f]/90 border-[#d4af37]' : 'opacity-85'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span className="font-medium tracking-wide">
              {isHovered
                ? (lang === 'ar' ? `تكبير الدقة العالية (${zoomLevel}x)` : `Inspection Haute Joaillerie (${zoomLevel}x)`)
                : (lang === 'ar' ? 'حرّك الفأرة للتكبير والفحص' : 'Survolez pour zoomer les détails')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Zoom multiplier toggle */}
            <div className="hidden sm:flex items-center bg-black/75 backdrop-blur border border-white/15 rounded p-0.5 text-[10px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(2.0);
                }}
                className={`px-1.5 py-0.5 rounded font-mono transition cursor-pointer ${
                  zoomLevel === 2.0 ? 'bg-[#d4af37] text-black font-bold' : 'text-[#aaa] hover:text-white'
                }`}
                title="Zoom 2x"
              >
                2x
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(2.8);
                }}
                className={`px-1.5 py-0.5 rounded font-mono transition cursor-pointer ${
                  zoomLevel === 2.8 ? 'bg-[#d4af37] text-black font-bold' : 'text-[#aaa] hover:text-white'
                }`}
                title="Zoom 2.8x"
              >
                3x
              </button>
            </div>

            {/* Fullscreen HD button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
                setLightboxZoom(1.5);
              }}
              className="p-1.5 bg-black/75 hover:bg-black text-[#cfcbc2] hover:text-[#d4af37] backdrop-blur border border-white/15 hover:border-[#d4af37]/60 rounded transition cursor-pointer"
              title={lang === 'ar' ? 'عرض بدقة فائقة' : 'Agrandir en plein écran (HD)'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Gallery Navigation Arrows (if multiple images) */}
        {hasMultiple && onIndexChange && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const prevIdx = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                onIndexChange(prevIdx);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur z-10"
              title="Photo précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const nextIdx = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                onIndexChange(nextIdx);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur z-10"
              title="Photo suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom indicator */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none text-[10px] text-[#999] z-10">
          <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/10">
            Acier 316L · Or 18K PVD
          </span>
          {hasMultiple && (
            <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/10 font-mono text-[#d4af37]">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>
      </div>

      {/* Fullscreen HD Loupe Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
        >
          {/* Top Bar */}
          <div className="w-full px-6 py-4 flex items-center justify-between border-b border-[#222] bg-[#0c0c0c]/80 z-20">
            <div className="flex items-center gap-3">
              <span className="font-serif text-[#d4af37] text-lg font-medium">{alt}</span>
              <span className="text-xs text-[#888] font-mono border-l border-[#333] pl-3">
                Inspection Loupe HD ({Math.round(lightboxZoom * 100)}%)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom controls */}
              <div className="flex items-center bg-[#181818] border border-[#333] rounded overflow-hidden">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={lightboxZoom <= 1}
                  className="p-2 hover:bg-[#252525] text-white disabled:opacity-30 cursor-pointer"
                  title="Dézoomer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-3 text-xs font-mono text-[#d4af37]">
                  {lightboxZoom.toFixed(1)}x
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={lightboxZoom >= 4}
                  className="p-2 hover:bg-[#252525] text-white disabled:opacity-30 cursor-pointer"
                  title="Zoomer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Reset view */}
              <button
                type="button"
                onClick={() => {
                  setLightboxZoom(1);
                  setLightboxPos({ x: 0, y: 0 });
                }}
                className="px-3 py-1.5 text-xs text-[#aaa] hover:text-white border border-[#333] hover:border-[#555] rounded cursor-pointer transition"
              >
                Réinitialiser
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxZoom(1);
                  setLightboxPos({ x: 0, y: 0 });
                }}
                className="p-2 text-[#aaa] hover:text-white bg-[#1c1c1c] hover:bg-[#2a2a2a] rounded cursor-pointer transition ml-2"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Inspection Canvas Area */}
          <div
            onMouseDown={handleLightboxMouseDown}
            onMouseMove={handleLightboxMouseMove}
            onMouseUp={handleLightboxMouseUp}
            className={`relative flex-1 w-full flex items-center justify-center overflow-hidden p-6 ${
              lightboxZoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
            }`}
          >
            <div
              style={{
                transform: `translate(${lightboxPos.x}px, ${lightboxPos.y}px) scale(${lightboxZoom})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              className="max-w-[85vw] max-h-[80vh] flex items-center justify-center select-none"
            >
              <img
                src={src || fallbackUrl}
                alt={alt}
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackUrl;
                }}
                className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl pointer-events-none"
              />
            </div>

            {/* Hint overlay */}
            <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
              <span className="px-4 py-1.5 rounded-full bg-black/80 border border-[#d4af37]/30 text-xs text-[#cfcbc2] backdrop-blur flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {lightboxZoom > 1
                    ? 'Glissez avec la souris pour explorer les maillons, sertissages et finitions'
                    : 'Utilisez les boutons + et - pour agrandir les détails de la pièce'}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
