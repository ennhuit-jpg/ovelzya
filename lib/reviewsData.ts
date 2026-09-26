import { CustomerReview } from './types';

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev_1',
    productId: 1,
    productName: 'Collier « Hexagone »',
    productSku: 'MD-COL-001',
    author: 'Lina Bennani',
    city: 'Casablanca',
    country: 'Maroc',
    rating: 5,
    date: '14 septembre 2026',
    title: 'Brillance et éclat sublimes au quotidien !',
    comment:
      'Absolument conquise ! Le plaquage or 18K PVD est d’une brillance incroyable. Je le porte tous les jours, y compris à la plage et sous la douche : aucune trace verte, aucun ternissement. Reçu en 24h à Casablanca dans un écrin scellé digne des plus grands joailliers avec son certificat d’authenticité.',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611591475882-9642e8870183?auto=format&fit=crop&w=900&q=80',
    ],
    likes: 42,
  },
  {
    id: 'rev_2',
    productId: 2,
    productName: 'Bracelet « Maille Royale »',
    productSku: 'MD-BRA-002',
    author: 'Kenza Alami',
    city: 'Rabat',
    country: 'Maroc',
    rating: 5,
    date: '11 septembre 2026',
    title: 'Poids noble en main et fermoir signature impeccable',
    comment:
      'La maille a un poids surprenant qui témoigne tout de suite de la noblesse du bijou. Le fermoir signature est ultra sécurisé et ne s’accroche pas aux manches en soie ou en cachemire. Mes collègues m’ont toutes demandé d’où venait cette pièce !',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    ],
    likes: 38,
  },
  {
    id: 'rev_3',
    productId: 3,
    productName: 'Bague « Facettes »',
    productSku: 'MD-BAG-003',
    author: 'Sarah Delacroix',
    city: 'Marrakech',
    country: 'Maroc',
    rating: 5,
    date: '08 septembre 2026',
    title: 'Jeux de lumière géométriques fascinants',
    comment:
      'Un raffinement rare. Les facettes polygonales captent chaque rayon de soleil. L’emballage cadeau avec le ruban doré, le sceau de cire et le certificat plastifié à mon nom ont rendu l’expérience de déballage inoubliable.',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80',
    ],
    likes: 29,
  },
  {
    id: 'rev_4',
    productId: 4,
    productName: 'Boucles « Solitaires »',
    productSku: 'MD-BOU-004',
    author: 'Dr. Sophia Rahmouni',
    city: 'Fès',
    country: 'Maroc',
    rating: 5,
    date: '04 septembre 2026',
    title: 'Hypoallergénique certifié : tolérance absolue',
    comment:
      'Ayant une peau extrêmement sensible allergique au moindre alliage bas de gamme, j’appréhendais. Résultat : zéro rougeur, zéro démangeaison même après une journée entière de garde. La pierre taille brillant a un éclat pur et limpide.',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    ],
    likes: 31,
  },
  {
    id: 'rev_5',
    productId: 5,
    productName: 'Bague « Solitaire Éternel »',
    productSku: 'MD-BAG-005',
    author: 'Yasmine Mansouri',
    city: 'Tanger',
    country: 'Maroc',
    rating: 5,
    date: '30 août 2026',
    title: 'Un chef-d’œuvre digne de la haute joaillerie',
    comment:
      'Commandé avec l’offre surclassement conseillée sur la fiche : je ne regrette absolument pas ! Le pavage micro-serti autour du solitaire principal scintille à merveille. Livraison soignée avec inspection gratuite avant règlement en espèces.',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80',
    ],
    likes: 24,
  },
  {
    id: 'rev_6',
    productId: 1,
    productName: 'Collier « Hexagone »',
    productSku: 'MD-COL-001',
    author: 'Amira Kabbaj',
    city: 'Casablanca',
    country: 'Maroc',
    rating: 5,
    date: '25 août 2026',
    title: 'Le cadeau idéal dans son écrin de velours noir',
    comment:
      'Offert à ma sœur pour ses fiançailles. La chaîne ajustable permet de le porter en ras-de-cou ou plus lâche. La dorure PVD 18K a cette teinte or jaune chaleureuse, exactement comme l’or massif.',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1611591475882-9642e8870183?auto=format&fit=crop&w=900&q=80',
    ],
    likes: 19,
  },
  {
    id: 'rev_7',
    productId: 2,
    productName: 'Bracelet « Maille Royale »',
    productSku: 'MD-BRA-002',
    author: 'Nadia Chraibi',
    city: 'Rabat',
    country: 'Maroc',
    rating: 5,
    date: '19 août 2026',
    title: 'Magnifique en parure avec le collier assorti',
    comment:
      'J’ai ajouté le bracelet assorti grâce à la réduction parure (-15%) proposée sur la fiche du collier. L’ensemble forme une parure somptueuse. Service client très réactif sur WhatsApp qui a confirmé ma taille de poignet.',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    ],
    likes: 16,
  },
  {
    id: 'rev_8',
    productId: 6,
    productName: 'Collier « Éclipse Noire »',
    productSku: 'MD-COL-006',
    author: 'Meriem Bennis',
    city: 'Marrakech',
    country: 'Maroc',
    rating: 5,
    date: '12 août 2026',
    title: 'Le contraste or jaune et onyx est saisissant',
    comment:
      'Une pièce d’une élégance rare qui attire immédiatement le regard. Finition miroir sans le moindre défaut. Le contrôle du colis à la livraison avant paiement apporte une vraie sérénité d’achat.',
    verifiedPurchase: true,
    photos: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    ],
    likes: 22,
  },
];

/**
 * Local storage key for persisting customer reviews
 */
export const REVIEWS_STORAGE_KEY = 'ovelzya_customer_reviews_v1';

/**
 * Load all customer reviews with fallback to initial verified reviews
 */
export function getSavedReviews(): CustomerReview[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return INITIAL_REVIEWS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse customer reviews from localStorage:', err);
  }
  return INITIAL_REVIEWS;
}

/**
 * Save reviews to localStorage
 */
export function persistReviews(reviews: CustomerReview[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save customer reviews to localStorage:', err);
  }
}
