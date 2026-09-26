'use client';

import React from 'react';
import {
  Instagram,
  Facebook,
  Share2,
  ExternalLink,
  MessageCircle,
  Video,
  Youtube,
  Sparkles,
  Heart,
  BadgeCheck,
} from 'lucide-react';
import { Language, SocialIconSettings, SocialLinkUrls } from '@/lib/types';

interface HomeSocialChannelsProps {
  lang: Language;
  waNumber?: string;
  socialIcons?: SocialIconSettings;
  socialLinks?: SocialLinkUrls;
}

export default function HomeSocialChannels({
  lang = 'fr',
  waNumber = '+212620000000',
  socialIcons,
  socialLinks,
}: HomeSocialChannelsProps) {
  const cleanWa = (socialLinks?.whatsapp?.replace(/\D/g, '') || waNumber.replace(/\D/g, ''));

  const officialChannels = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@ovelzya_officiel',
      role:
        lang === 'ar'
          ? 'الحساب الرسمي المعتمد'
          : lang === 'en'
          ? 'Official Certified Account'
          : 'Compte Officiel Certifié',
      description:
        lang === 'ar'
          ? 'إطلالات العارضات، بريق القطع الذهبية وكواليس صناعة الحلي في ورشاتنا.'
          : lang === 'en'
          ? 'Exclusive showcases, new 18K gold parures and jewelry atelier craftsmanship.'
          : 'Défilés exclusifs, nouvelles parures 18K et coulisses de l’atelier joaillier.',
      link: socialLinks?.instagram || 'https://www.instagram.com/ovelzya_officiel',
      cta:
        lang === 'ar'
          ? 'متابعة'
          : lang === 'en'
          ? 'Follow'
          : 'S’abonner',
      badge: '48.5K',
      gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#FCB045]',
      borderHover: 'hover:border-[#FD1D1D]/60',
      icon: Instagram,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@ovelzya_joaillerie',
      role:
        lang === 'ar'
          ? 'مقاطع حية وتجارب'
          : lang === 'en'
          ? 'Live Videos & Water Resistance'
          : 'Vidéos & Tests d’Inaltérabilité',
      description:
        lang === 'ar'
          ? 'شاهد اختبارات مقاومة الماء والخدش وتألق الذهب تحت ضوء الشمس الطبيعي.'
          : lang === 'en'
          ? 'High-shine showcases, waterproof tests and realistic styling videos.'
          : 'Démonstrations de brillance, tests d’eau salée et essayages vidéo immersifs.',
      link: socialLinks?.tiktok || 'https://www.tiktok.com/@ovelzya_joaillerie',
      cta:
        lang === 'ar'
          ? 'مشاهدة'
          : lang === 'en'
          ? 'Watch'
          : 'Explorer',
      badge: '32.1K',
      gradient: 'from-[#000000] via-[#25F4EE] to-[#FE2C55]',
      borderHover: 'hover:border-[#25F4EE]/60',
      icon: Video,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@OvelzyaJoaillerie',
      role:
        lang === 'ar'
          ? 'القناة الرسمية والروائع'
          : lang === 'en'
          ? 'Official Channel & Masterpieces'
          : 'Chaîne Officielle & Défilés',
      description:
        lang === 'ar'
          ? 'أفلام سينمائية قصيرة، تفاصيل البريق 18K تحت الأضواء، ولقاءات مع المصممين.'
          : lang === 'en'
          ? 'Cinematic short films, 18K gold shine details and atelier jewelry design.'
          : 'Films joailliers 4K, reflets de l’or 18K en haute définition et secrets d’atelier.',
      link: socialLinks?.youtube || 'https://www.youtube.com/@OvelzyaJoaillerie',
      cta:
        lang === 'ar'
          ? 'اشتراك'
          : lang === 'en'
          ? 'Subscribe'
          : 'S’abonner',
      badge: '14.2K',
      gradient: 'from-[#FF0000] via-[#CC0000] to-[#800000]',
      borderHover: 'hover:border-[#FF0000]/60',
      icon: Youtube,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'Maison Ovelzya',
      role:
        lang === 'ar'
          ? 'مجتمع الدار الرسمي'
          : lang === 'en'
          ? 'Official Jewelry Community'
          : 'Communauté Joaillière',
      description:
        lang === 'ar'
          ? 'تواصل مع عشاق الأناقة الفاخرة، وتابع آخر أخبار الدار والتقييمات الموثقة.'
          : lang === 'en'
          ? 'Collection updates, verified client reviews and community discussions.'
          : 'Actualités des collections, avis clients certifiés et échanges avec notre communauté.',
      link: socialLinks?.facebook || 'https://www.facebook.com/ovelzya',
      cta:
        lang === 'ar'
          ? 'انضمام'
          : lang === 'en'
          ? 'Join'
          : 'Rejoindre',
      badge: '26.8K',
      gradient: 'from-[#1877F2] to-[#0d5ec4]',
      borderHover: 'hover:border-[#1877F2]/60',
      icon: Facebook,
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      handle: 'Ovelzya Joaillerie',
      role:
        lang === 'ar'
          ? 'لوحات الإلهام والأناقة'
          : lang === 'en'
          ? 'Moodboards & Royal Inspiration'
          : 'Moodboards & Inspirations',
      description:
        lang === 'ar'
          ? 'استلهمي إطلالات الزفاف، تنسيقات المجوهرات مع القفطان وأحدث صيحات الموضة.'
          : lang === 'en'
          ? 'Wedding looks, gold jewelry pairing with haute couture and curated moodboards.'
          : 'Inspirations parures princières, accords avec caftans haute couture et moodboards.',
      link: socialLinks?.pinterest || 'https://www.pinterest.com/ovelzya',
      cta:
        lang === 'ar'
          ? 'تصفح'
          : lang === 'en'
          ? 'Explore'
          : 'Découvrir',
      badge: '18.4K',
      gradient: 'from-[#BD081C] to-[#8C0615]',
      borderHover: 'hover:border-[#BD081C]/60',
      icon: ExternalLink,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp VIP',
      handle: '+212 6 20 00 00 00',
      role:
        lang === 'ar'
          ? 'خدمة الكونسيرج الخاصة'
          : lang === 'en'
          ? 'Private VIP Concierge'
          : 'Conciergerie Privée',
      description:
        lang === 'ar'
          ? 'استشارة خاصة مع خبير مجوهرات، حجز موعد في الصالون، أو طلب تصميم مخصص.'
          : lang === 'en'
          ? 'Bespoke advice with a jewelry advisor, private salon appointments and custom orders.'
          : 'Conseil sur-mesure avec nos experts, essayages privés en salon et réservations.',
      link: `https://wa.me/${cleanWa}?text=${encodeURIComponent(
        lang === 'ar'
          ? 'السلام عليكم دار أوفيلزيا، أود الاستفسار عن مجوهراتكم الحصرية.'
          : lang === 'en'
          ? 'Hello Maison Ovelzya, I would like to discover your exclusive collections.'
          : 'Bonjour Maison Ovelzya, je souhaite découvrir vos parures exclusives.'
      )}`,
      cta:
        lang === 'ar'
          ? 'واتساب VIP'
          : lang === 'en'
          ? 'Chat VIP'
          : 'Contacter',
      badge: '7j/7',
      gradient: 'from-[#25D366] to-[#128C7E]',
      borderHover: 'hover:border-[#25D366]/60',
      icon: MessageCircle,
    },
  ];

  const filteredChannels = officialChannels.filter((c) => {
    if (c.id === 'instagram' && socialIcons?.showInstagram === false) return false;
    if (c.id === 'tiktok' && socialIcons?.showTikTok === false) return false;
    if (c.id === 'youtube' && socialIcons?.showYouTube === false) return false;
    if (c.id === 'facebook' && socialIcons?.showFacebook === false) return false;
    if (c.id === 'pinterest' && socialIcons?.showPinterest === false) return false;
    if (c.id === 'whatsapp' && socialIcons?.showWhatsApp === false) return false;
    return true;
  });

  if (filteredChannels.length === 0) return null;

  return (
    <section
      id="reseaux-sociaux-maison"
      className="wrap py-12 sm:py-16 border-t border-[rgba(212,175,55,0.25)] relative overflow-hidden"
    >
      {/* Decorative Golden Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold mb-3">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>
            {lang === 'ar'
              ? 'الشبكات الاجتماعية الرسمية للدار'
              : lang === 'en'
              ? 'Official Maison Social Channels'
              : 'Réseaux Sociaux Officiels de la Maison'}
          </span>
        </div>

        <h2 className="text-xl sm:text-3xl font-serif text-white font-semibold tracking-tight">
          {lang === 'ar' ? (
            <>
              انضموا إلى عالم <em className="text-[#d4af37] not-italic">دار أوفيلزيا</em> الرقمي
            </>
          ) : lang === 'en' ? (
            <>
              Join the <em className="text-[#d4af37] not-italic">Maison Ovelzya</em> Digital World
            </>
          ) : (
            <>
              Suivez la <em className="text-[#d4af37] not-italic">Maison Ovelzya</em> sur nos
              Réseaux Officiels
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-[#9a958a] mt-2 font-light leading-relaxed">
          {lang === 'ar'
            ? 'اكتشفوا كواليس مشاغلنا، أحدث الإصدارات الحصرية من الحلي المطلية بالذهب 18 قيراط، وشاركونا إطلالاتكم الفاخرة.'
            : lang === 'en'
            ? 'Discover our workshop craftsmanship, exclusive 18K gold launches, and styling inspirations shared by our ambassadors.'
            : 'Découvrez les coulisses de nos ateliers, nos nouvelles parures en avant-première et les inspirations de style partagées par nos ambassadrices.'}
        </p>
      </div>

      {/* Social Cards Grid - Compact and Refined 6-Column Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 mb-8">
        {filteredChannels.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`relative bg-[#131313] border border-[#262626] ${item.borderHover} rounded-xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-black/50 group`}
            >
              <div>
                {/* Card Top: Icon & Compact Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded bg-[#1c1c1c] text-[#d4af37] border border-[#333]">
                    {item.badge}
                  </span>
                </div>

                {/* Account Names */}
                <div className="mb-1.5">
                  <div className="flex items-center gap-1">
                    <h3 className="font-serif text-sm font-semibold text-white group-hover:text-[#d4af37] transition-colors truncate">
                      {item.name}
                    </h3>
                    <BadgeCheck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  </div>
                  <span className="text-[10px] font-mono text-[#d4af37]/90 font-medium block truncate">
                    {item.handle}
                  </span>
                </div>

                {/* Description (Compact 2-line clamp) */}
                <p className="text-[11px] text-[#9a958a] leading-tight line-clamp-2 mb-3 min-h-[2.1rem]">
                  {item.description}
                </p>
              </div>

              {/* Action Button - Sleek & Compact */}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-2 bg-[#1b1b1b] hover:bg-[#d4af37] text-[#cfcbc2] hover:text-black border border-[#2e2e2e] hover:border-[#d4af37] rounded-md text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm group-hover:bg-[#d4af37] group-hover:text-black"
              >
                <span>{item.cta}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Community Engagement Banner (#MaisonOvelzya) */}
      <div className="bg-gradient-to-r from-[rgba(212,175,55,0.12)] via-[rgba(212,175,55,0.06)] to-transparent border border-[rgba(212,175,55,0.3)] rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shrink-0">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="font-serif text-base font-semibold text-white">
              {lang === 'ar'
                ? 'شاركونا إطلالاتكم الفاخرة'
                : lang === 'en'
                ? 'Become a Maison Ambassador'
                : 'Devenez Ambassadrice de la Maison'}
            </h4>
            <p className="text-[11px] sm:text-xs text-[#9a958a] mt-0.5 max-w-xl">
              {lang === 'ar'
                ? 'استخدموا الوسم #MaisonOvelzya وأشيروا إلى @ovelzya_officiel على صوركم لنشرها والاستفادة من هدايا سنوية.'
                : lang === 'en'
                ? 'Tag #MaisonOvelzya and mention @ovelzya_officiel to be featured on our official feeds and receive exclusive privileges.'
                : 'Publiez vos photos avec le hashtag #MaisonOvelzya et mentionnez @ovelzya_officiel pour être mise à l’honneur dans nos stories officielles et recevoir des privilèges exclusifs.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-[#0e0e0e] border border-dashed border-[#d4af37] text-[#d4af37] font-mono text-xs font-bold tracking-wider select-all">
            #MaisonOvelzya
          </span>
          <a
            href="https://www.instagram.com/ovelzya_officiel"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar' ? 'متابعة' : lang === 'en' ? 'Join Us' : 'Rejoindre'}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
