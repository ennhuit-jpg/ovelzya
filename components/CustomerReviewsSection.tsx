'use client';

import React, { useState, useMemo } from 'react';
import {
  Star,
  Camera,
  CheckCircle2,
  ThumbsUp,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  MessageSquarePlus,
} from 'lucide-react';
import { CustomerReview, Language, Product } from '@/lib/types';
import { getProductSku } from '@/lib/skuUtils';

interface CustomerReviewsSectionProps {
  productId?: number;
  products: Product[];
  reviews: CustomerReview[];
  onAddReview?: (review: CustomerReview) => void;
  lang: Language;
}

export default function CustomerReviewsSection({
  productId,
  products,
  reviews,
  onAddReview,
  lang,
}: CustomerReviewsSectionProps) {
  // Filter state
  const [filterMode, setFilterMode] = useState<'all' | 'photos' | 'five_star'>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string;
    review: CustomerReview;
  } | null>(null);

  // New review modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedProdId, setSelectedProdId] = useState<number>(productId || (products[0]?.id ?? 1));
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Filter reviews for this product or all
  const productReviews = useMemo(() => {
    if (productId) {
      return reviews.filter((r) => r.productId === productId);
    }
    return reviews;
  }, [reviews, productId]);

  // Apply sub-filters
  const filteredReviews = useMemo(() => {
    return productReviews.filter((r) => {
      if (filterMode === 'photos') return r.photos && r.photos.length > 0;
      if (filterMode === 'five_star') return r.rating === 5;
      return true;
    });
  }, [productReviews, filterMode]);

  // Aggregate stats
  const totalCount = productReviews.length;
  const avgRating =
    totalCount > 0
      ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
      : '5.0';
  const photosCount = productReviews.filter((r) => r.photos && r.photos.length > 0).length;
  const fiveStarsCount = productReviews.filter((r) => r.rating === 5).length;
  const recommendationRate =
    totalCount > 0 ? Math.round((fiveStarsCount / totalCount) * 100) : 99;

  // Extract all photos from reviews for the photo gallery strip
  const allClientPhotos = useMemo(() => {
    const list: { url: string; review: CustomerReview }[] = [];
    productReviews.forEach((rev) => {
      rev.photos?.forEach((photoUrl) => {
        list.push({ url: photoUrl, review: rev });
      });
    });
    return list;
  }, [productReviews]);

  // Handle local photo upload via file reader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    setTimeout(() => setIsUploading(false), 300);
  };

  // Add sample photo preset for easy testing
  const addSamplePhotoPreset = (url: string) => {
    if (!uploadedPhotos.includes(url)) {
      setUploadedPhotos((prev) => [...prev, url]);
    }
  };

  // Submit review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const chosenProduct = products.find((p) => p.id === selectedProdId) || products[0];
    const newRev: CustomerReview = {
      id: `rev_${Date.now()}`,
      productId: chosenProduct.id,
      productName: chosenProduct.name,
      productSku: getProductSku(chosenProduct),
      author: newAuthor.trim(),
      city: newCity.trim() || 'Casablanca',
      country: 'Maroc',
      rating: newRating,
      date: 'Aujourd’hui',
      title: newTitle.trim() || 'Avis sur ma commande Ovelzya',
      comment: newComment.trim(),
      verifiedPurchase: true,
      photos: uploadedPhotos,
      likes: 1,
    };

    onAddReview(newRev);
    setIsModalOpen(false);
    // Reset form
    setNewAuthor('');
    setNewCity('');
    setNewTitle('');
    setNewComment('');
    setUploadedPhotos([]);
    setNewRating(5);
  };

  const handleToggleHelpful = (reviewId: string) => {
    setHelpfulLiked((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className="border-t border-[#262626] pt-10 mt-12 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>
                {lang === 'en'
                  ? 'Client Experiences & Unboxing'
                  : lang === 'ar'
                  ? 'تجارب الزبونات وصور حقيقية'
                  : 'Avis Clientes & Photos Réelles'}
              </span>
            </span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
              ✦ 100% Achats Vérifiés
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            {lang === 'en'
              ? 'Real Photos & Verified Reviews'
              : lang === 'ar'
              ? 'تقييمات موثقة وصور الزبونات الحقيقية'
              : 'Photos Réelles & Témoignages Vérifiés'}
          </h2>
        </div>

        {/* Badge: Avis certifiés réservés aux commandes vérifiées */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#181818] border border-[#d4af37]/40 text-[#d4af37] text-xs self-start sm:self-auto shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
          <span className="font-medium tracking-wide text-[11px]">
            {lang === 'en'
              ? 'Certified Client Reviews · Verified Orders Only'
              : lang === 'ar'
              ? 'تقييمات وصور موثقة مقتصرة على طلبيات الزبونات'
              : 'Avis & photos certifiés réservés aux commandes vérifiées'}
          </span>
        </div>
      </div>

      {/* Aggregate Score & Reassurance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#141414] border border-[#272727] rounded-xl p-5 sm:p-6">
        {/* Rating Block */}
        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#262626] pb-4 md:pb-0 md:pr-6">
          <div className="text-4xl sm:text-5xl font-serif font-bold text-[#d4af37]">
            {avgRating}
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-[#cfcbc2] mt-1 font-medium">
              {totalCount}{' '}
              {lang === 'en'
                ? 'verified reviews'
                : lang === 'ar'
                ? 'تقييم موثق بالصور'
                : 'avis vérifiés en situation'}
            </p>
          </div>
        </div>

        {/* Recommendation rate */}
        <div className="flex items-center gap-3.5 border-b md:border-b-0 md:border-r border-[#262626] pb-4 md:pb-0 md:pr-6">
          <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-serif font-bold text-white">
              {recommendationRate}%
            </span>
            <p className="text-xs text-[#9a958a] leading-tight mt-0.5">
              {lang === 'en'
                ? 'of clients recommend this jewelry to a loved one'
                : lang === 'ar'
                ? 'من الزبونات يوصين بهذه القطعة الفاخرة'
                : 'de nos clientes recommandent ce bijou à une proche'}
            </p>
          </div>
        </div>

        {/* Warranty & Photo proofs */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-white font-semibold block">
              Garantie Anti-Ternissement 10 Ans
            </span>
            <p className="text-xs text-[#9a958a] leading-tight mt-0.5">
              {lang === 'en'
                ? 'Proof of waterproof luster & surgical stainless 316L finish'
                : lang === 'ar'
                ? 'إثبات ثبات اللون تحت الماء ومقاومة الصدأ'
                : 'Résistance prouvée à l’eau, chlore, parfums et douches chaudes'}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Photos Gallery Strip (Visual Proof) */}
      {allClientPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#d4af37]" />
              <h3 className="text-xs uppercase tracking-[0.16em] text-white font-semibold">
                {lang === 'en'
                  ? `Client Photos Gallery (${allClientPhotos.length})`
                  : lang === 'ar'
                  ? `معرض صور الزبونات (${allClientPhotos.length})`
                  : `Galerie Photos de nos Clientes (${allClientPhotos.length})`}
              </h3>
            </div>
            <span className="text-[11px] text-[#9a958a]">
              Cliquez sur une photo pour l’agrandir
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-[#333]">
            {allClientPhotos.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLightboxPhoto(item)}
                className="group relative w-24 h-28 sm:w-32 sm:h-36 rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#d4af37] transition duration-300 shrink-0 cursor-pointer shadow-md"
              >
                <img
                  src={item.url}
                  alt={item.review.productName || 'Photo cliente'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/jewel-client-${idx}/300/400`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-2 text-left">
                  <span className="text-[10px] text-white font-medium truncate">
                    {item.review.author}
                  </span>
                  <span className="text-[9px] text-[#d4af37]">
                    ★ {item.review.rating}/5
                  </span>
                </div>
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center opacity-75 group-hover:opacity-100">
                  <Camera className="w-2.5 h-2.5 text-[#d4af37]" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262626] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#1a1a1a] text-[#cfcbc2] hover:bg-[#252525] border border-[#333]'
            }`}
          >
            Tous les avis ({productReviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('photos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'photos'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#1a1a1a] text-[#cfcbc2] hover:bg-[#252525] border border-[#333]'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Avec photos réelles ({photosCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('five_star')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'five_star'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#1a1a1a] text-[#cfcbc2] hover:bg-[#252525] border border-[#333]'
            }`}
          >
            <Star className="w-3 h-3 fill-current text-[#d4af37]" />
            <span>5 étoiles ({fiveStarsCount})</span>
          </button>
        </div>

        <span className="text-xs text-[#888]">
          Affichage de {filteredReviews.length} avis
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-[#141414] border border-[#272727] rounded-xl text-[#9a958a] text-sm">
            Aucun avis ne correspond à ce filtre pour le moment.
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isLiked = helpfulLiked[rev.id];
            const currentLikes = (rev.likes || 0) + (isLiked ? 1 : 0);

            return (
              <div
                key={rev.id}
                className="bg-[#141414] border border-[#262626] rounded-xl p-5 sm:p-6 space-y-4 hover:border-[#383838] transition"
              >
                {/* Review Header: User avatar, Name, City, Stars, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#d4af37]/40 flex items-center justify-center text-sm font-serif font-bold text-[#d4af37] shadow">
                      {rev.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {rev.author}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Achat Vérifié</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#888] block">
                        {rev.city || 'Casablanca'}
                        {rev.country ? ` · ${rev.country}` : ''}
                        {rev.productName ? ` · Pièce : ${rev.productName}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-[#444]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#888]">{rev.date}</span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  {rev.title && (
                    <h4 className="text-sm sm:text-base font-serif font-semibold text-white">
                      {rev.title}
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm text-[#cfcbc2] leading-relaxed font-light">
                    {rev.comment}
                  </p>
                </div>

                {/* Customer Photos Attachments Grid */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#9a958a] block mb-2 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#d4af37]" />
                      <span>Photos partagées par la cliente :</span>
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {rev.photos.map((photoUrl, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() =>
                            setLightboxPhoto({ url: photoUrl, review: rev })
                          }
                          className="group relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-[#1c1c1c] border border-[#333] hover:border-[#d4af37] transition cursor-pointer shadow"
                        >
                          <img
                            src={photoUrl}
                            alt="Photo cliente"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/jewel-photo-${pIdx}/300/400`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="px-2 py-1 rounded bg-black/70 text-white text-[9px] font-medium backdrop-blur">
                              Agrandir
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful Footer */}
                <div className="flex items-center justify-between border-t border-[#222] pt-3 text-xs text-[#888]">
                  <span className="text-[11px] text-[#777]">
                    Réf. bijou : {rev.productSku || 'OV-COL-001'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition cursor-pointer ${
                      isLiked
                        ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                        : 'bg-[#1c1c1c] hover:bg-[#252525] text-[#9a958a] border border-[#333]'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`}
                    />
                    <span>Utile ({currentLikes})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox Modal for Full-size Client Photo Viewing */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-[#141414] border border-[#333] rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white hover:text-[#d4af37] flex items-center justify-center transition border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Large View */}
            <div className="relative aspect-[4/5] sm:aspect-[16/10] bg-black max-h-[65vh]">
              <img
                src={lightboxPhoto.url}
                alt="Photo cliente agrandie"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Photo & Review Context */}
            <div className="p-5 sm:p-6 space-y-3 bg-[#111] border-t border-[#262626]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">
                      {lightboxPhoto.review.author}
                    </span>
                    <span className="text-xs text-[#888]">
                      ({lightboxPhoto.review.city || 'Maroc'})
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      Achat Vérifié
                    </span>
                  </div>
                  <span className="text-xs text-[#d4af37] block mt-0.5">
                    Bijou : {lightboxPhoto.review.productName} (Réf :{' '}
                    {lightboxPhoto.review.productSku})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {'★'.repeat(lightboxPhoto.review.rating)}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#cfcbc2] font-light leading-relaxed italic">
                « {lightboxPhoto.review.comment} »
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Leave a Review with Photo */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#141414] border border-[#333] rounded-2xl p-6 sm:p-7 shadow-2xl my-8 animate-fade-in space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  Témoignage Joaillerie
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                  Laisser un avis avec photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#222] text-[#888] hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star rating selection */}
              <div>
                <label className="block text-xs text-[#cfcbc2] mb-1.5 font-medium">
                  Votre note globale *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      className="p-1 transition transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || newRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-[#444]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#d4af37] font-serif font-bold ml-2">
                    {hoverRating || newRating} / 5 étoiles
                  </span>
                </div>
              </div>

              {/* Product selector */}
              <div>
                <label className="block text-xs text-[#cfcbc2] mb-1.5 font-medium">
                  Bijou acheté / évalué *
                </label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white focus:border-[#d4af37] outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({getProductSku(p)}) — {p.price} DH
                    </option>
                  ))}
                </select>
              </div>

              {/* Author & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#cfcbc2] mb-1.5 font-medium">
                    Votre prénom et nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Ex: Kenza B."
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#cfcbc2] mb-1.5 font-medium">
                    Votre ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Ex: Casablanca, Rabat..."
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              {/* Review Title & Comment */}
              <div>
                <label className="block text-xs text-[#cfcbc2] mb-1.5 font-medium">
                  Titre de votre avis
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Magnifique éclat et livraison soignée"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#cfcbc2] mb-1.5 font-medium">
                  Votre commentaire détaillé *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre expérience : tenue du plaquage, confort au porter, réaction cutanée, écrin reçu..."
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white focus:border-[#d4af37] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Photo Upload & Preview Section */}
              <div className="space-y-2">
                <label className="block text-xs text-[#cfcbc2] font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Ajouter des photos réelles (Recommandé)</span>
                  </span>
                  <span className="text-[11px] text-[#888]">
                    {uploadedPhotos.length} photo(s) sélectionnée(s)
                  </span>
                </label>

                {/* Upload box */}
                <label className="border-2 border-dashed border-[#383838] hover:border-[#d4af37] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-[#171717]">
                  <Upload className="w-6 h-6 text-[#d4af37] mb-1.5" />
                  <span className="text-xs text-white font-medium">
                    Cliquez ou glissez une photo du bijou
                  </span>
                  <span className="text-[10px] text-[#888] mt-0.5">
                    JPG, PNG ou HEIC (bijou porté, unboxing, écrin)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Quick preset buttons for instant test */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-[#888]">
                    Ou ajouter une photo d&apos;exemple :
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      addSamplePhotoPreset(
                        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded bg-[#222] hover:bg-[#333] text-[10px] text-[#cfcbc2] border border-[#333]"
                  >
                    + Pendentif porté
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      addSamplePhotoPreset(
                        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded bg-[#222] hover:bg-[#333] text-[10px] text-[#cfcbc2] border border-[#333]"
                  >
                    + Bague en main
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      addSamplePhotoPreset(
                        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded bg-[#222] hover:bg-[#333] text-[10px] text-[#cfcbc2] border border-[#333]"
                  >
                    + Bracelet au poignet
                  </button>
                </div>

                {/* Photo Previews */}
                {uploadedPhotos.length > 0 && (
                  <div className="flex gap-2 pt-2 overflow-x-auto">
                    {uploadedPhotos.map((url, i) => (
                      <div
                        key={i}
                        className="relative w-16 h-20 rounded-lg overflow-hidden border border-[#d4af37]/50 shrink-0"
                      >
                        <img
                          src={url}
                          alt={`Aperçu ${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setUploadedPhotos((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center text-[10px] hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded bg-[#222] text-[#888] hover:text-white transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !newAuthor.trim() || !newComment.trim()}
                  className="px-6 py-2.5 rounded bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold uppercase tracking-wider transition shadow-lg shadow-[#d4af37]/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publier mon avis vérifié</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
