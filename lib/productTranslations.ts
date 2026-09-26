import { Product, Language } from './types';

export interface LocalizedProductData {
  name_en: string;
  cat_en: string;
  badge_en?: string;
  desc_en: string;
  specs_en: [string, string][];
}

export const PRODUCT_EN_MAP: Record<number, LocalizedProductData> = {
  1: {
    name_en: '« Hexagon » Necklace',
    cat_en: 'Necklaces',
    badge_en: 'Iconic',
    desc_en: 'An architectural faceted pendant sculpted from mirror-polished surgical steel and bonded with 18-karat gold.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Length', '45 cm + 5 cm extension'],
      ['Weight', '12 g'],
    ],
  },
  2: {
    name_en: '« Royal Link » Bracelet',
    cat_en: 'Bracelets',
    badge_en: 'Best-seller',
    desc_en: 'A generous Cuban link chain, mirror-polished to perfection with our signature secure box clasp.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Length', '18 cm + 3 cm extension'],
      ['Width', '6 mm'],
    ],
  },
  3: {
    name_en: '« Facets » Band Ring',
    cat_en: 'Rings',
    badge_en: '',
    desc_en: 'An interplay of alternating gold and steel facets, capturing and multiplying every glint of ambient light.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Sizes', '50 to 62 FR'],
      ['Width', '8 mm'],
    ],
  },
  4: {
    name_en: '« Golden Droplet » Earrings',
    cat_en: 'Earrings',
    badge_en: '',
    desc_en: 'Two suspended liquid droplets that sway with effortless grace and lightness throughout the day.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Length', '5 cm'],
      ['Clasp', 'French Hook'],
    ],
  },
  5: {
    name_en: '« Radiance » Bangle',
    cat_en: 'Bracelets',
    badge_en: 'Limited Edition',
    desc_en: 'A minimalist bangle set with a precision hand-cut crystal offering uncompromised brilliance.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Stone', 'Precision Cut Crystal'],
      ['Diameter', '6 cm'],
    ],
  },
  6: {
    name_en: '« Golden Beads » Bracelet',
    cat_en: 'Bracelets',
    badge_en: '',
    desc_en: 'Individually mirror-polished gold beads strung on an ultra-resilient architectural cable.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Beads', 'Ø 6 mm'],
      ['Length', '19 cm'],
    ],
  },
  7: {
    name_en: '« Mirror » Signet Ring',
    cat_en: 'Rings',
    badge_en: '',
    desc_en: 'A bold, crisp plateau polished like still water, custom engravable upon personal request.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Sizes', '52 to 66 FR'],
      ['Face Size', '12 × 12 mm'],
    ],
  },
  8: {
    name_en: '« Sculptural » Bold Hoops',
    cat_en: 'Earrings',
    badge_en: '',
    desc_en: 'Generous architectural hoop earrings, voluptuous and brilliant to illuminate the posture.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Diameter', '2.5 cm'],
      ['Thickness', '5 mm'],
    ],
  },
  9: {
    name_en: '« Cut Crystal » Necklace',
    cat_en: 'Necklaces',
    badge_en: 'Maison Favorite',
    desc_en: 'An irregularly faceted AAA gem bezel-mounted upon an airy whisper chain.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Stone', 'AAA Flawless Crystal'],
      ['Length', '50 cm + 5 cm'],
    ],
  },
  10: {
    name_en: '« Brushed Gold » Wide Cuff',
    cat_en: 'Bracelets',
    badge_en: 'Exclusive',
    desc_en: 'A wide architectural wrist cuff featuring a satin brushed matte face and mirror-bevelled margins.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Brushed Gold'],
      ['Width', '2.5 cm'],
      ['Weight', '38 g'],
    ],
  },
  11: {
    name_en: '« Figaro Chain » Necklace',
    cat_en: 'Necklaces',
    badge_en: '',
    desc_en: 'The classic 3+1 Italian Figaro link cadence, forged in durable 4 mm thickness.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Length', '50 cm + 5 cm'],
      ['Width', '4 mm'],
    ],
  },
  12: {
    name_en: '« Imperial Medallion » Necklace',
    cat_en: 'Necklaces',
    badge_en: 'New Arrival',
    desc_en: 'An oval medallion delicately engraved with regal floral arabesques, resting close to the heart.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Length', '60 cm'],
      ['Medallion', '2.5 × 2 cm'],
    ],
  },
  13: {
    name_en: '« Slender Chain » Bracelet',
    cat_en: 'Bracelets',
    badge_en: '',
    desc_en: 'A delicate and supple mesh link paired with an innovative, secure magnetic clasp.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Length', '17 cm + 3 cm'],
      ['Width', '3 mm'],
    ],
  },
  14: {
    name_en: '« Minimalist » Bangle',
    cat_en: 'Bracelets',
    badge_en: '',
    desc_en: 'A slender bangle featuring absolute mirror polish and a subtle semi-round profile.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Diameter', '6 cm'],
      ['Thickness', '2 mm'],
    ],
  },
  15: {
    name_en: '« Faceted Alliance » Ring',
    cat_en: 'Rings',
    badge_en: '',
    desc_en: 'A delicate gold band with understated microscopic facets, sublime worn individually or stacked.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Sizes', '48 to 60 FR'],
      ['Width', '3 mm'],
    ],
  },
  16: {
    name_en: '« Imperial Serpent » Ring',
    cat_en: 'Rings',
    badge_en: 'New Arrival',
    desc_en: 'A sculpted snake that coils around the finger, crowned with intense midnight black onyx crystal eyes.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Sizes', '50 to 62 FR'],
      ['Eyes', 'Black Onyx Crystals'],
    ],
  },
  17: {
    name_en: '« Radiance » Stud Earrings',
    cat_en: 'Earrings',
    badge_en: '',
    desc_en: 'Two bezel-set solitaire crystals, discreet, comfortable, and endlessly luminous for daily wear.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Stone', 'Brilliant Crystal Ø 4 mm'],
      ['Clasp', 'Friction Post & Back'],
    ],
  },
  18: {
    name_en: '« Imperial Drop » Earrings',
    cat_en: 'Earrings',
    badge_en: '',
    desc_en: 'Three articulated cascading tiers that fluidly catch every ray of ambient light with each turn.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Length', '6 cm'],
      ['Clasp', 'Secure Leverback'],
    ],
  },
  19: {
    name_en: '« Engraved Bar » Necklace',
    cat_en: 'Necklaces',
    badge_en: 'Customizable',
    desc_en: 'A mirror-smooth bar ready for your custom engraving, meaningful initials, or memorable date.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Length', '45 cm + 5 cm'],
      ['Engraving', 'Complimentary'],
    ],
  },
  20: {
    name_en: '« Royal Suite » Parure Set',
    cat_en: 'Sets',
    badge_en: 'Luxury Gift Box',
    desc_en: 'Matching necklace, bracelet, and earrings presented within a signature midnight velvet luxury case.',
    specs_en: [
      ['Material', '316L Surgical Steel'],
      ['Plating', '18K Gold — PVD'],
      ['Contents', '3 Matching Pieces'],
      ['Presentation', 'Signed Velvet Case'],
    ],
  },
  21: {
    name_en: '« Golden Chain » Crossbody Bag',
    cat_en: 'Handbags',
    badge_en: 'New Arrival',
    desc_en: 'Grained black luxury leather bag with engraved Ovelzya turn-lock and inalterable 18K gold chain strap.',
    specs_en: [
      ['Material', 'Full-Grain Leather & 316L Steel'],
      ['Hardware', '18K PVD Gold Turnlock'],
      ['Dimensions', '22 × 15 × 7 cm'],
      ['Strap', 'Detachable 110 cm Chain'],
    ],
  },
  22: {
    name_en: '« Evening Radiance » Jewelry Clutch',
    cat_en: 'Handbags',
    badge_en: 'Limited Edition',
    desc_en: 'Jewelry-inspired hard minaudière clutch with gemstone clasp and mirror gold finish for gala evenings.',
    specs_en: [
      ['Material', 'Rigid Shell & 316L Metal'],
      ['Finish', 'Mirror Haute Joaillerie Gold'],
      ['Dimensions', '19 × 11 × 5 cm'],
      ['Clasp', 'Emerald-Cut Faceted Crystal'],
    ],
  },
  23: {
    name_en: '« Casablanca » Prestige Tote',
    cat_en: 'Handbags',
    badge_en: 'Best-seller',
    desc_en: 'Spacious luxury tote in supple camel leather with snap hooks and signature Ovelzya gold medallion.',
    specs_en: [
      ['Material', 'Premium Supple Leather'],
      ['Hardware', '18K Gold Snap Hooks & Rings'],
      ['Capacity', 'A4 Documents & 13" Laptop'],
      ['Closure', 'Reinforced Zip & Hook'],
    ],
  },
  24: {
    name_en: '« Royal Link » Bucket Bag',
    cat_en: 'Handbags',
    badge_en: 'Maison Favorite',
    desc_en: 'Contemporary ivory and gold bucket bag with jewelry eyelets, drawstring, and braided leather strap.',
    specs_en: [
      ['Material', 'Grained Ivory Leather'],
      ['Hardware', 'Tarnish-Proof PVD Gold'],
      ['Dimensions', '24 × 22 × 14 cm'],
      ['Pockets', '2 Interior Patch Pockets'],
    ],
  },
};

export function getCategoryLabel(cat: string, lang: Language): string {
  if (lang === 'ar') {
    if (cat === 'Tous') return 'الكل';
    if (cat === 'Colliers') return 'قلادات';
    if (cat === 'Bracelets') return 'أساور';
    if (cat === 'Bagues') return 'خواتم';
    if (cat === "Boucles d'oreilles") return 'أقراط';
    if (cat === 'Sacs') return 'حقائب';
    if (cat === 'Ensembles') return 'أطقم';
    return cat;
  }
  if (lang === 'en') {
    if (cat === 'Tous') return 'All';
    if (cat === 'Colliers') return 'Necklaces';
    if (cat === 'Bracelets') return 'Bracelets';
    if (cat === 'Bagues') return 'Rings';
    if (cat === "Boucles d'oreilles") return 'Earrings';
    if (cat === 'Sacs') return 'Handbags';
    if (cat === 'Ensembles') return 'Sets';
    return cat;
  }
  return cat;
}

export function getProductLocalized(
  p: Product,
  lang: Language
): {
  name: string;
  cat: string;
  badge: string;
  desc: string;
  specs: [string, string][] | string[][];
} {
  const enData = PRODUCT_EN_MAP[p.id];

  if (lang === 'ar') {
    return {
      name: p.name_ar || p.name,
      cat: p.cat_ar || p.cat,
      badge: p.badge_ar || p.badge || '',
      desc: p.desc_ar || p.desc,
      specs: p.specs_ar || p.specs,
    };
  }

  if (lang === 'en') {
    return {
      name: p.name_en || enData?.name_en || p.name,
      cat: p.cat_en || enData?.cat_en || getCategoryLabel(p.cat, 'en'),
      badge: p.badge_en !== undefined ? p.badge_en : enData?.badge_en !== undefined ? enData.badge_en : p.badge,
      desc: p.desc_en || enData?.desc_en || p.desc,
      specs: p.specs_en || enData?.specs_en || p.specs,
    };
  }

  // Default 'fr'
  return {
    name: p.name,
    cat: p.cat,
    badge: p.badge || '',
    desc: p.desc,
    specs: p.specs,
  };
}
