export type Language = 'fr' | 'ar' | 'en';

export interface Product {
  id: number;
  name: string;
  name_ar: string;
  name_en?: string;
  cat: string;
  cat_ar: string;
  cat_en?: string;
  price: number;
  badge: string;
  badge_ar: string;
  badge_en?: string;
  rating: number;
  reviews: number;
  img: string;
  images?: string[];
  video?: string;
  seed: string;
  desc: string;
  desc_ar: string;
  desc_en?: string;
  specs: [string, string][] | string[][];
  specs_ar: [string, string][] | string[][];
  specs_en?: [string, string][] | string[][];
  inStock?: boolean;
  stock?: number;
  sku?: string;
  barcode?: string;
}

export interface FlashSaleItem {
  id: number;
  pct: number;
}

export interface Quote {
  t: string;
  t_ar: string;
  t_en?: string;
  a: string;
  a_ar: string;
  a_en?: string;
  s: number;
}

export interface OrderItem {
  id: number;
  qty: number;
  price: number;
  name?: string;
  name_ar?: string;
  name_en?: string;
  sku?: string;
  barcode?: string;
}

export type OrderStatus = 'reçue' | 'preparation' | 'expediee' | 'livraison' | 'livree';

export interface Order {
  id: string;
  num: string;
  date: string;
  items: OrderItem[];
  sub: number;
  disc: number;
  ship: number;
  cod: number;
  total: number;
  payMethod: string;
  email: string;
  name: string;
  phone?: string;
  street?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  status: OrderStatus;
  warrantyCertId?: string;
}

export interface ContactMessage {
  id: string;
  date: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  userId?: string;
  orderNumber?: string;
  reply?: string;
  repliedAt?: string;
}

export interface WarrantySettings {
  certificateTitle?: string;
  certificateSubtitle?: string;
  validityDuration?: string;
  goldPurityText?: string;
  clauseWaterproofTitle?: string;
  clauseWaterproofText?: string;
  clauseTarnishTitle?: string;
  clauseTarnishText?: string;
  clauseHypoTitle?: string;
  clauseHypoText?: string;
  clausePolishTitle?: string;
  clausePolishText?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  customLegalNotice?: string;
}

export type PromotionRuleType = 'cross_sell' | 'upsell';

export type PromotionDisplayStage = 'product_page' | 'cart_add' | 'checkout_start' | 'purchase_completed';

export interface PromotionOfferRule {
  id: string;
  type: PromotionRuleType;
  sourceSku: string; // SKU du produit déclencheur (ou 'ALL' pour tous)
  targetSku: string; // SKU du produit recommandé (reconnu automatiquement avec vignette)
  discountPct: number; // Pourcentage de réduction personnalisé (ex: 15%)
  customTitle?: string; // Titre personnalisé (ex: "Complétez votre parure avec le bracelet assorti")
  customBadge?: string; // Badge (ex: "Offre Parure -15%", "Surclassement Exclusif")
  displayStage?: PromotionDisplayStage; // Étape d'apparition : Vue de page produit, Ajout au panier, Début de checkout, Achat finalisé
  active: boolean;
  notes?: string;
}

export interface CustomerReview {
  id: string;
  productId: number;
  productName?: string;
  productSku?: string;
  author: string;
  city?: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  photos: string[]; // URLs of real client photos
  likes: number;
  country?: string;
}

export interface SalesBoostersConfig {
  enableWhatsAppOrder: boolean;
  whatsAppButtonText?: string;
  enableSocialProof: boolean;
  socialProofIntervalSec?: number;
  enableFreeShippingBar: boolean;
  enableUrgencyBadges: boolean;
  stockUrgencyThreshold?: number;
  enableGiftOption: boolean;
  giftOptionPrice?: number;
  enableCodReassurance: boolean;
  enableExitIntentPopup: boolean;
  exitIntentDiscountPct?: number;
  exitIntentPromoCode?: string;
  // Cross-sell & Upsell Engine
  enableCrossSell?: boolean;
  enableUpsell?: boolean;
  promotionRules?: PromotionOfferRule[];
}

export interface LanguageSettings {
  enableFr: boolean;
  enableAr: boolean;
  enableEn: boolean;
  defaultLang: Language;
  showLanguageSwitcher: boolean;
  showLanguageFlags?: boolean;
}

export interface SocialIconSettings {
  showInstagram: boolean;
  showTikTok: boolean;
  showYouTube: boolean;
  showFacebook: boolean;
  showPinterest: boolean;
  showWhatsApp: boolean;
}

export interface SocialLinkUrls {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  whatsapp?: string;
  pinterest?: string;
}

export interface OrderNotificationSettings {
  enableEmailAlerts: boolean;
  adminEmail: string;
  enableTelegramAlerts: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  enableWhatsAppAlerts: boolean;
  adminWhatsAppNumber?: string;
}

export interface SiteSettings {
  brandName: string;
  brandSub: string;
  waNumber: string;
  contactEmail: string;
  contactPhone: string;
  showroomAddress: string;
  openingHours: string;
  freeShippingThreshold: number;
  shippingCost: number;
  codFee: number;
  promoCode: string;
  promoDiscountPct: number;
  flashEndsAt: string; // ISO date string or end of month
  qrVerificationUrl?: string; // URL for QR code on invoices and thermal receipts
  customLogoUrl?: string; // Manually uploaded or linked .png logo
  boosters?: SalesBoostersConfig;
  languages?: LanguageSettings;
  socialIcons?: SocialIconSettings;
  socialLinks?: SocialLinkUrls;
  notifications?: OrderNotificationSettings;
  warranty?: WarrantySettings;
}

export interface SiteContent {
  settings: SiteSettings;
  boosters?: SalesBoostersConfig;
  hero: {
    tag_fr: string;
    tag_ar: string;
    tag_en?: string;
    h1_fr: string;
    h1_ar: string;
    h1_en?: string;
    h1_em_fr: string;
    h1_em_ar: string;
    h1_em_en?: string;
    p_fr: string;
    p_ar: string;
    p_en?: string;
    img: string;
  };
  marquee: {
    fr: string;
    ar: string;
    en?: string;
  };
  craft: {
    h2_fr: string;
    h2_ar: string;
    h2_en?: string;
    p1_fr: string;
    p1_ar: string;
    p1_en?: string;
    p2_fr: string;
    p2_ar: string;
    p2_en?: string;
  };
  flashBanner: {
    title_fr: string;
    title_ar: string;
    title_en?: string;
    sub_fr: string;
    sub_ar: string;
    sub_en?: string;
  };
}

export interface CommercialPermissions {
  canManageOrders: boolean;
  canManageProducts: boolean;
  canManageClients: boolean;
  canPrintInvoices: boolean;
  canPrintTickets: boolean;
  canViewReports: boolean;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  dialCode?: string;
  address?: string;
  postalCode?: string;
  favorites?: number[];
  role: 'admin' | 'commercial' | 'client';
  password?: string;
  createdAt: string;
  status: 'active' | 'suspended';
  notes?: string;
  isNewsletterSubscriber?: boolean;
  newsletterSubscribedAt?: string;
  emailVerified?: boolean;
  permissions?: CommercialPermissions;
}

export interface AppData {
  products: Product[];
  flash: FlashSaleItem[];
  quotes: Quote[];
  content: SiteContent;
  orders: Order[];
  contacts: ContactMessage[];
  users: RegisteredUser[];
  reviews?: CustomerReview[];
}
