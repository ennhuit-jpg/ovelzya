'use client';

import React, { useState, useMemo } from 'react';
import {
  Product,
  Order,
  ContactMessage,
  SiteContent,
  FlashSaleItem,
  OrderStatus,
  RegisteredUser,
  CommercialPermissions,
  SalesBoostersConfig,
  PromotionOfferRule,
  LanguageSettings,
  SocialIconSettings,
  SocialLinkUrls,
  Language,
} from '@/lib/types';
import ExitIntentModal from './ExitIntentModal';
import OvelzyaLogo from './OvelzyaLogo';
import WarrantyModal, { DEFAULT_WARRANTY_SETTINGS } from './WarrantyModal';
import CrossSellUpsellManager from './CrossSellUpsellManager';
import AdminBusinessDashboard from './AdminBusinessDashboard';
import {
  Package,
  FileText,
  Zap,
  ShoppingBag,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  Eye,
  TrendingUp,
  Clock,
  Sparkles,
  Save,
  Users,
  UserPlus,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Shield,
  MessageCircle,
  Printer,
  Receipt,
  Lock,
  Key,
  KeyRound,
  Briefcase,
  Sun,
  Moon,
  BadgeCheck,
  Barcode,
  QrCode,
  Download,
  Image as ImageIcon,
  Film,
  Video,
  Play,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  VideoOff,
  Gift,
  Truck,
  Bell,
  Flame,
  Rocket,
  Tag,
  ShieldCheck,
  Check,
  Globe,
  Youtube,
  Instagram,
  Facebook,
  Share2,
  Send,
  Copy,
  CheckCircle2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  content: SiteContent;
  orders: Order[];
  contacts: ContactMessage[];
  flash: FlashSaleItem[];
  clients?: RegisteredUser[];
  currentUser?: RegisteredUser | null;
  lang: Language;
  onUpdateProduct: (product: Product) => Promise<void>;
  onCreateProduct: (product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: number) => Promise<void>;
  onReorderProducts?: (products: Product[]) => Promise<void>;
  onUpdateContent: (content: Partial<SiteContent>) => Promise<void>;
  onUpdateFlash: (flash: FlashSaleItem[]) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder?: (id: string) => Promise<void>;
  onMarkContactRead: (id: string, read: boolean) => Promise<void>;
  onDeleteContact?: (id: string) => Promise<void>;
  onUpdateClientStatus?: (id: string, status: 'active' | 'suspended') => Promise<void>;
  onDeleteClient?: (id: string) => Promise<void>;
  onCreateClient?: (client: { name: string; email: string; phone?: string; city?: string }) => Promise<void>;
  onPrintInvoice?: (order: Order) => void;
  onPrintReceipt?: (order: Order) => void;
  onPrintWarranty?: (order: Order) => void;
  onUpdateUser?: (userData: Partial<RegisteredUser> & { id: string }) => Promise<void>;
  onRefreshUsers?: () => Promise<void>;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
  onResetData: () => Promise<void>;
  onCloseAdmin: () => void;
  showToast: (msg: string) => void;
}

export default function AdminDashboard({
  products,
  content,
  orders,
  contacts,
  flash,
  clients = [],
  currentUser,
  lang,
  onUpdateProduct,
  onCreateProduct,
  onDeleteProduct,
  onReorderProducts,
  onUpdateContent,
  onUpdateFlash,
  onUpdateOrderStatus,
  onDeleteOrder,
  onMarkContactRead,
  onDeleteContact,
  onUpdateClientStatus,
  onDeleteClient,
  onCreateClient,
  onPrintInvoice,
  onPrintReceipt,
  onPrintWarranty,
  onUpdateUser,
  onRefreshUsers,
  theme = 'dark',
  toggleTheme,
  onResetData,
  onCloseAdmin,
  showToast,
}: AdminDashboardProps) {
  const isCommercial = currentUser?.role === 'commercial';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'dashboard' | 'products' | 'content' | 'flash' | 'orders' | 'messages' | 'settings' | 'clients' | 'team' | 'boosters'
  >(currentUser?.role === 'commercial' ? 'orders' : 'dashboard');

  // Client management state
  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState<'all' | 'active' | 'suspended' | 'newsletter' | 'with_orders'>('all');
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Casablanca',
  });

  // Password Change state (Admin & Current User)
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Forced password reset modal by Admin for any team member
  const [resetPasswordModalUser, setResetPasswordModalUser] = useState<RegisteredUser | null>(null);
  const [resetPasswordInput, setResetPasswordInput] = useState('');
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  // Commercials Management state
  const [isCreatingCommercial, setIsCreatingCommercial] = useState(false);
  const [editingCommercial, setEditingCommercial] = useState<RegisteredUser | null>(null);
  const [newCommercialForm, setNewCommercialForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Casablanca',
    password: '',
    permissions: {
      canManageOrders: true,
      canManageProducts: true,
      canManageClients: true,
      canPrintInvoices: true,
      canPrintTickets: true,
      canViewReports: true,
    } as CommercialPermissions,
  });

  // Search/Filters in Products
  const [productSearch, setProductSearch] = useState('');
  const [productCat, setProductCat] = useState('Tous');

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<Product>>({});
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState('');

  const parseVideoUrl = (url?: string) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;

    const ytMatch = trimmed.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    if (ytMatch && ytMatch[1]) {
      return { type: 'youtube' as const, embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0` };
    }

    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return { type: 'vimeo' as const, embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}` };
    }

    return { type: 'direct' as const, embedUrl: trimmed };
  };

  const handleAddPhotoUrl = (urlToAdd?: string) => {
    const targetUrl = (urlToAdd || newPhotoUrlInput).trim();
    if (!targetUrl) return;
    const currentImages = Array.isArray(prodForm.images) ? [...prodForm.images] : [];
    if (!currentImages.includes(targetUrl)) {
      currentImages.push(targetUrl);
    }
    setProdForm((prev) => ({
      ...prev,
      images: currentImages,
      img: prev.img || currentImages[0],
    }));
    setNewPhotoUrlInput('');
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const currentImages = Array.isArray(prodForm.images) ? [...prodForm.images] : [];
    currentImages.splice(indexToRemove, 1);
    setProdForm((prev) => ({
      ...prev,
      images: currentImages,
      img: currentImages[0] || '',
    }));
  };

  const handleSetPrimaryPhoto = (indexToPrimary: number) => {
    const currentImages = Array.isArray(prodForm.images) ? [...prodForm.images] : [];
    if (indexToPrimary >= 0 && indexToPrimary < currentImages.length) {
      const [selected] = currentImages.splice(indexToPrimary, 1);
      currentImages.unshift(selected);
      setProdForm((prev) => ({
        ...prev,
        images: currentImages,
        img: selected,
      }));
    }
  };

  const handleUploadPhotoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setProdForm((prev) => {
            const cur = Array.isArray(prev.images) ? [...prev.images] : [];
            if (!cur.includes(base64)) {
              cur.push(base64);
            }
            return {
              ...prev,
              images: cur,
              img: prev.img || cur[0],
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleUploadVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setProdForm((prev) => ({
          ...prev,
          video: base64,
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleGenerateDemoPhotos = () => {
    const seed = prodForm.seed || `bijou-${Date.now().toString().slice(-4)}`;
    const demoPhotos = [
      `https://picsum.photos/seed/${seed}/900/1125`,
      `https://picsum.photos/seed/${seed}-angle2/900/1125`,
      `https://picsum.photos/seed/${seed}-porte/900/1125`,
    ];
    setProdForm((prev) => ({
      ...prev,
      images: demoPhotos,
      img: demoPhotos[0],
    }));
    showToast('3 photos de démonstration générées ✦');
  };

  const handleInsertDemoVideo = () => {
    const demoVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    setProdForm((prev) => ({
      ...prev,
      video: demoVideo,
    }));
    showToast('Vidéo de démonstration insérée ✦');
  };

  // Content form state
  const [contentForm, setContentForm] = useState<SiteContent>(content);
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Default boosters configuration
  const defaultBoosters: SalesBoostersConfig = {
    enableWhatsAppOrder: true,
    whatsAppButtonText: 'Commander directement via WhatsApp',
    enableSocialProof: true,
    socialProofIntervalSec: 15,
    enableFreeShippingBar: true,
    enableUrgencyBadges: true,
    stockUrgencyThreshold: 5,
    enableGiftOption: true,
    giftOptionPrice: 35,
    enableCodReassurance: true,
    enableExitIntentPopup: true,
    exitIntentDiscountPct: 10,
    exitIntentPromoCode: 'BIENVENUE10',
    enableCrossSell: true,
    enableUpsell: true,
    promotionRules: [
      {
        id: 'rule_cross_1',
        type: 'cross_sell',
        sourceSku: 'MD-COL-001',
        targetSku: 'MD-BRA-002',
        discountPct: 15,
        customTitle: 'Complétez votre parure avec le bracelet assorti',
        customBadge: 'Offre Parure −15%',
        active: true,
      },
      {
        id: 'rule_cross_2',
        type: 'cross_sell',
        sourceSku: 'MD-BAG-003',
        targetSku: 'MD-BOU-004',
        discountPct: 15,
        customTitle: 'Duo Éclat : Boucles d’oreilles coordonnées',
        customBadge: 'Duo Assorti −15%',
        active: true,
      },
      {
        id: 'rule_upsell_1',
        type: 'upsell',
        sourceSku: 'MD-BAG-003',
        targetSku: 'MD-BAG-005',
        discountPct: 10,
        customTitle: 'Surclassement Joaillerie : Bague Solitaire Pavée',
        customBadge: 'Version Supérieure −10%',
        active: true,
      },
      {
        id: 'rule_upsell_2',
        type: 'upsell',
        sourceSku: 'MD-COL-001',
        targetSku: 'MD-COL-006',
        discountPct: 12,
        customTitle: 'Version Haute Joaillerie : Pendentif Sertissage Onyx & Or',
        customBadge: 'Surclassement Exclusif −12%',
        active: true,
      },
    ],
  };

  // Sub-tab state for Sales Boosters section: 'cross_upsell' (dedicated page) or 'levers' (standard levers)
  const [boosterSubTab, setBoosterSubTab] = useState<'cross_upsell' | 'levers'>('cross_upsell');

  const defaultLanguages: LanguageSettings = {
    enableFr: true,
    enableAr: true,
    enableEn: true,
    defaultLang: 'fr',
    showLanguageSwitcher: true,
    showLanguageFlags: true,
  };

  const defaultSocialIcons: SocialIconSettings = {
    showInstagram: true,
    showTikTok: true,
    showYouTube: true,
    showFacebook: true,
    showPinterest: true,
    showWhatsApp: true,
  };

  const defaultSocialLinks: SocialLinkUrls = {
    instagram: 'https://www.instagram.com/ovelzya_officiel',
    tiktok: 'https://www.tiktok.com/@ovelzya_joaillerie',
    youtube: 'https://www.youtube.com/@OvelzyaJoaillerie',
    facebook: 'https://www.facebook.com/ovelzya',
    whatsapp: 'https://wa.me/212600000000',
    pinterest: 'https://www.pinterest.com/ovelzya',
  };

  // Settings form state (including boosters, languages, social icons & warranty)
  const [settingsForm, setSettingsForm] = useState({
    ...content.settings,
    boosters: content.settings.boosters || defaultBoosters,
    languages: content.settings.languages || defaultLanguages,
    socialIcons: content.settings.socialIcons || defaultSocialIcons,
    socialLinks: content.settings.socialLinks || defaultSocialLinks,
    warranty: content.settings.warranty || DEFAULT_WARRANTY_SETTINGS,
  });

  // Local contacts state for live messaging updates
  const [localContacts, setLocalContacts] = useState<ContactMessage[]>(contacts);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLocalContacts(contacts);
    }, 0);
    return () => clearTimeout(timer);
  }, [contacts]);

  const [replyingContactId, setReplyingContactId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const handleSendContactReply = async (contactId: string) => {
    if (!replyText.trim()) {
      showToast('Veuillez saisir votre message de réponse.');
      return;
    }
    setIsSendingReply(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contactId,
          reply: replyText.trim(),
          repliedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const updated = localContacts.map((c) =>
          c.id === contactId
            ? {
                ...c,
                reply: replyText.trim(),
                repliedAt: new Date().toISOString(),
                read: true,
              }
            : c
        );
        setLocalContacts(updated);
        setReplyingContactId(null);
        setReplyText('');
        showToast('✦ Réponse officielle transmise au client avec succès !');
      } else {
        showToast('Erreur lors de la transmission de la réponse.');
      }
    } catch {
      showToast('Erreur de connexion au serveur.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleUpdateSocialLink = (network: keyof SocialLinkUrls, url: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || defaultSocialLinks),
        [network]: url,
      },
    }));
  };

  const handleToggleLanguage = (langKey: 'enableFr' | 'enableAr' | 'enableEn') => {
    const curLangs = settingsForm.languages || defaultLanguages;
    const newFr = langKey === 'enableFr' ? !curLangs.enableFr : curLangs.enableFr;
    const newAr = langKey === 'enableAr' ? !curLangs.enableAr : curLangs.enableAr;
    const newEn = langKey === 'enableEn' ? !curLangs.enableEn : curLangs.enableEn;

    const activeCount = [newFr, newAr, newEn].filter(Boolean).length;

    if (activeCount === 0) {
      showToast('Attention : Au moins une version linguistique doit rester activée.');
      return;
    }

    let newDefault = curLangs.defaultLang;
    if (activeCount === 1) {
      newDefault = newFr ? 'fr' : newAr ? 'ar' : 'en';
    } else if ((newDefault === 'fr' && !newFr) || (newDefault === 'ar' && !newAr) || (newDefault === 'en' && !newEn)) {
      newDefault = newFr ? 'fr' : newAr ? 'ar' : 'en';
    }

    setSettingsForm((prev) => ({
      ...prev,
      languages: {
        ...curLangs,
        enableFr: newFr,
        enableAr: newAr,
        enableEn: newEn,
        defaultLang: newDefault,
        showLanguageSwitcher: activeCount > 1 ? curLangs.showLanguageSwitcher : false,
      },
    }));
  };

  const handleSetExclusiveLanguage = (targetLang: 'fr' | 'ar' | 'en' | 'all') => {
    const curLangs = settingsForm.languages || defaultLanguages;
    if (targetLang === 'all') {
      setSettingsForm((prev) => ({
        ...prev,
        languages: {
          ...curLangs,
          enableFr: true,
          enableAr: true,
          enableEn: true,
          showLanguageSwitcher: true,
        },
      }));
      showToast('✦ Mode multilingue activé : Français, Arabe et Anglais');
    } else if (targetLang === 'fr') {
      setSettingsForm((prev) => ({
        ...prev,
        languages: {
          ...curLangs,
          enableFr: true,
          enableAr: false,
          enableEn: false,
          defaultLang: 'fr',
          showLanguageSwitcher: false,
        },
      }));
      showToast('✦ Site verrouillé en Français uniquement (FR)');
    } else if (targetLang === 'ar') {
      setSettingsForm((prev) => ({
        ...prev,
        languages: {
          ...curLangs,
          enableFr: false,
          enableAr: true,
          enableEn: false,
          defaultLang: 'ar',
          showLanguageSwitcher: false,
        },
      }));
      showToast('✦ تم قفل الموقع باللغة العربية حصراً (AR)');
    } else if (targetLang === 'en') {
      setSettingsForm((prev) => ({
        ...prev,
        languages: {
          ...curLangs,
          enableFr: false,
          enableAr: false,
          enableEn: true,
          defaultLang: 'en',
          showLanguageSwitcher: false,
        },
      }));
      showToast('✦ Site locked to English only (EN)');
    }
  };

  const handleToggleLanguageSwitcher = () => {
    const curLangs = settingsForm.languages || defaultLanguages;
    setSettingsForm((prev) => ({
      ...prev,
      languages: {
        ...curLangs,
        showLanguageSwitcher: curLangs.showLanguageSwitcher === false ? true : false,
      },
    }));
  };

  const handleChangeDefaultLang = (dl: Language) => {
    const curLangs = settingsForm.languages || defaultLanguages;
    setSettingsForm((prev) => ({
      ...prev,
      languages: {
        ...curLangs,
        defaultLang: dl,
      },
    }));
  };

  const handleToggleSocialIcon = (iconKey: keyof SocialIconSettings) => {
    const curIcons = settingsForm.socialIcons || defaultSocialIcons;
    setSettingsForm((prev) => ({
      ...prev,
      socialIcons: {
        ...curIcons,
        [iconKey]: curIcons[iconKey] === false ? true : false,
      },
    }));
  };

  const [previewExitIntent, setPreviewExitIntent] = useState(false);
  const [testNotificationToast, setTestNotificationToast] = useState<string | null>(null);
  const [isSavingBoosters, setIsSavingBoosters] = useState(false);

  const currentBoosters = settingsForm.boosters || defaultBoosters;

  const activeBoostersCount = [
    currentBoosters.enableWhatsAppOrder,
    currentBoosters.enableFreeShippingBar,
    currentBoosters.enableSocialProof,
    currentBoosters.enableUrgencyBadges,
    currentBoosters.enableGiftOption,
    currentBoosters.enableCodReassurance,
    currentBoosters.enableExitIntentPopup,
  ].filter(Boolean).length;

  const handleToggleBooster = (key: keyof SalesBoostersConfig) => {
    const cur = settingsForm.boosters || defaultBoosters;
    setSettingsForm((prev) => ({
      ...prev,
      boosters: {
        ...cur,
        [key]: !cur[key],
      },
    }));
  };

  const handleUpdateBoosterField = <K extends keyof SalesBoostersConfig>(
    key: K,
    value: SalesBoostersConfig[K]
  ) => {
    const cur = settingsForm.boosters || defaultBoosters;
    setSettingsForm((prev) => ({
      ...prev,
      boosters: {
        ...cur,
        [key]: value,
      },
    }));
  };

  const handleToggleAllBoosters = (enable: boolean) => {
    const cur = settingsForm.boosters || defaultBoosters;
    setSettingsForm((prev) => ({
      ...prev,
      boosters: {
        ...cur,
        enableWhatsAppOrder: enable,
        enableFreeShippingBar: enable,
        enableSocialProof: enable,
        enableUrgencyBadges: enable,
        enableGiftOption: enable,
        enableCodReassurance: enable,
        enableExitIntentPopup: enable,
      },
    }));
    showToast(enable ? '✦ Tous les leviers de vente activés !' : 'Tous les leviers de vente désactivés.');
  };

  const handleSaveBoosters = async () => {
    setIsSavingBoosters(true);
    try {
      await onUpdateContent({ settings: settingsForm });
      showToast('✦ Options de vente et leviers de conversion enregistrés avec succès !');
    } catch {
      showToast('Erreur lors de la sauvegarde des leviers.');
    } finally {
      setIsSavingBoosters(false);
    }
  };

  const handleSavePromotionRules = async (newRules: PromotionOfferRule[]) => {
    const cur = settingsForm.boosters || defaultBoosters;
    const updatedBoosters: SalesBoostersConfig = {
      ...cur,
      promotionRules: newRules,
    };
    const updatedSettings = {
      ...settingsForm,
      boosters: updatedBoosters,
    };
    setSettingsForm(updatedSettings);
    try {
      await onUpdateContent({
        settings: updatedSettings,
      });
      showToast('✦ Offres Cross-Sell & Upsell enregistrées avec succès !');
    } catch {
      showToast('Erreur lors de la sauvegarde des règles.');
    }
  };

  const handleToggleEnableCrossSell = async (enabled: boolean) => {
    const cur = settingsForm.boosters || defaultBoosters;
    const updatedBoosters: SalesBoostersConfig = {
      ...cur,
      enableCrossSell: enabled,
    };
    setSettingsForm((prev) => ({
      ...prev,
      boosters: updatedBoosters,
    }));
    try {
      await onUpdateContent({
        settings: {
          ...settingsForm,
          boosters: updatedBoosters,
        },
      });
      showToast(enabled ? '✦ Cross-Sell activé sur la boutique' : 'Cross-Sell désactivé');
    } catch {
      showToast('Erreur lors de la mise à jour.');
    }
  };

  const handleToggleEnableUpsell = async (enabled: boolean) => {
    const cur = settingsForm.boosters || defaultBoosters;
    const updatedBoosters: SalesBoostersConfig = {
      ...cur,
      enableUpsell: enabled,
    };
    setSettingsForm((prev) => ({
      ...prev,
      boosters: updatedBoosters,
    }));
    try {
      await onUpdateContent({
        settings: {
          ...settingsForm,
          boosters: updatedBoosters,
        },
      });
      showToast(enabled ? '✦ Upsell activé sur la boutique' : 'Upsell désactivé');
    } catch {
      showToast('Erreur lors de la mise à jour.');
    }
  };

  // Flash sales edit
  const [localFlash, setLocalFlash] = useState<FlashSaleItem[]>(flash);

  // Order detail modal
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // Warranty certificate modal
  const [activeWarrantyOrder, setActiveWarrantyOrder] = useState<Order | null>(null);

  // Sorting state for Products in Bijoux & Catalogue
  const [productSort, setProductSort] = useState<
    'default' | 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc'
  >('default');

  // In-app Bulletproof Delete Confirmation Modal (works reliably in all iframes and browsers without window.confirm blocking)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'order' | 'contact' | 'client' | 'team';
    id: string | number;
    title: string;
    subtitle?: string;
  } | null>(null);

  // Client Password Management Modal state
  const [clientPasswordModal, setClientPasswordModal] = useState<{
    client: RegisteredUser;
    newPass: string;
    isSubmitting: boolean;
  } | null>(null);

  // Reorder product position
  const handleMoveProduct = async (productId: number, direction: 'up' | 'down') => {
    const idx = products.findIndex((p) => p.id === productId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= products.length) return;

    const newOrder = [...products];
    const item = newOrder[idx];
    newOrder[idx] = newOrder[targetIdx];
    newOrder[targetIdx] = item;

    if (onReorderProducts) {
      await onReorderProducts(newOrder);
      showToast(`Position de « ${item.name} » mise à jour ✦`);
    }
  };

  // Central delete executor
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    const { type, id, title } = deleteTarget;
    setDeleteTarget(null);

    try {
      if (type === 'product') {
        await onDeleteProduct(Number(id));
        showToast(`« ${title} » supprimé du catalogue`);
      } else if (type === 'order') {
        if (onDeleteOrder) {
          await onDeleteOrder(String(id));
          showToast(`Commande supprimée définitivement`);
        }
      } else if (type === 'contact') {
        if (onDeleteContact) {
          await onDeleteContact(String(id));
          showToast(`Message supprimé`);
          setLocalContacts((prev) => prev.filter((it) => it.id !== String(id)));
        }
      } else if (type === 'client') {
        if (onDeleteClient) {
          await onDeleteClient(String(id));
          showToast(`Compte client supprimé`);
        }
      } else if (type === 'team') {
        if (onDeleteClient) {
          await onDeleteClient(String(id));
          showToast(`Compte commercial supprimé`);
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Erreur lors de la suppression');
    }
  };

  // Handle save client password from Admin
  const handleSaveClientPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPasswordModal) return;
    const { client, newPass } = clientPasswordModal;
    if (!newPass || newPass.length < 4) {
      showToast('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    setClientPasswordModal((prev) => (prev ? { ...prev, isSubmitting: true } : null));
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_set_password',
          targetUserId: client.id,
          newPassword: newPass.trim(),
          requesterRole: currentUser?.role || 'admin',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Erreur lors de la mise à jour du mot de passe');
        return;
      }
      showToast(`✦ Nouveau mot de passe enregistré pour ${client.name}`);
      setClientPasswordModal(null);
      if (onRefreshUsers) await onRefreshUsers();
    } catch {
      showToast('Erreur de connexion avec le serveur');
    } finally {
      setClientPasswordModal((prev) => (prev ? { ...prev, isSubmitting: false } : null));
    }
  };

  // Logo upload and management helpers
  const handleUploadLogoPng = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image valide (de préférence .PNG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setContentForm((prev) => ({
          ...prev,
          settings: {
            ...prev.settings,
            customLogoUrl: base64,
          },
        }));
        setSettingsForm((prev) => ({
          ...prev,
          customLogoUrl: base64,
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem('ovelzya_custom_logo', base64);
          window.dispatchEvent(new CustomEvent('ovelzya_logo_updated', { detail: base64 }));
        }
        showToast('Logo .PNG importé avec succès ✦ Pensez à enregistrer.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomLogoUrlChange = (url: string) => {
    setContentForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        customLogoUrl: url,
      },
    }));
    setSettingsForm((prev) => ({
      ...prev,
      customLogoUrl: url,
    }));
    if (typeof window !== 'undefined') {
      if (url) {
        localStorage.setItem('ovelzya_custom_logo', url);
      } else {
        localStorage.removeItem('ovelzya_custom_logo');
      }
      window.dispatchEvent(new CustomEvent('ovelzya_logo_updated', { detail: url || null }));
    }
  };

  const handleResetToDefaultLogo = () => {
    handleCustomLogoUrlChange('');
    showToast('Logo vectoriel officiel OVELZYA réactivé ✦');
  };

  // Order search
  const [orderSearch, setOrderSearch] = useState('');

  // Overview calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status !== 'livree').length;
  const unreadMessages = contacts.filter((c) => !c.read).length;

  const categories = ['Colliers', 'Bracelets', 'Bagues', "Boucles d'oreilles", 'Ensembles', 'Sacs'];

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    const catPrefix = (p.cat || 'Colliers').startsWith('Collier')
      ? 'COL'
      : (p.cat || '').startsWith('Bracelet')
      ? 'BRA'
      : (p.cat || '').startsWith('Bague')
      ? 'BAG'
      : (p.cat || '').startsWith('Boucle')
      ? 'BOU'
      : (p.cat || '').startsWith('Sac')
      ? 'SAC'
      : 'PAR';
    const fallbackNum = ((p.id * 83 + 17) % 900) + 100;
    const initialImages = Array.isArray(p.images) && p.images.length > 0
      ? [...p.images]
      : (p.img ? [p.img] : []);

    setProdForm({
      ...p,
      img: p.img || initialImages[0] || '',
      images: initialImages,
      video: p.video || '',
      stock: p.stock !== undefined ? p.stock : 10,
      sku: p.sku || `MD-${catPrefix}-${String(p.id).padStart(3, '0')}`,
      barcode: p.barcode || `6111000${String(p.id).padStart(4, '0')}${fallbackNum % 10}`,
    });
    setNewPhotoUrlInput('');
    setIsCreatingProduct(false);
  };

  const handleOpenCreateProduct = () => {
    setIsCreatingProduct(true);
    setEditingProduct(null);
    const nextId = products.length > 0 ? Math.max(...products.map((pr) => pr.id)) + 1 : 1;
    const rndNum = ((nextId * 83 + 17) % 900) + 100;
    setProdForm({
      name: '',
      name_ar: '',
      cat: 'Colliers',
      cat_ar: 'قلادات',
      sku: `MD-COL-${rndNum}`,
      barcode: `6111000${String(rndNum).padStart(4, '0')}7`,
      price: 890,
      badge: '',
      badge_ar: '',
      rating: 5.0,
      reviews: 1,
      img: '',
      images: [],
      video: '',
      seed: `bijou-creation-${nextId}`,
      desc: '',
      desc_ar: '',
      specs: [
        ['Matériau', 'Acier 316L'],
        ['Plaquage', 'Or 18K — PVD'],
      ],
      specs_ar: [
        ['المادة', 'فولاذ 316L'],
        ['الطلاء', 'ذهب 18K — PVD'],
      ],
      inStock: true,
      stock: 12,
    });
    setNewPhotoUrlInput('');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) {
      showToast('Veuillez renseigner le nom et le prix');
      return;
    }

    const catPrefix = (prodForm.cat || 'Colliers').startsWith('Collier')
      ? 'COL'
      : (prodForm.cat || '').startsWith('Bracelet')
      ? 'BRA'
      : (prodForm.cat || '').startsWith('Bague')
      ? 'BAG'
      : (prodForm.cat || '').startsWith('Boucle')
      ? 'BOU'
      : 'PAR';
    const fallbackNum = (((prodForm.id || 1) * 83 + 17) % 900) + 100;
    const finalSku = (prodForm.sku && prodForm.sku.trim()) || `MD-${catPrefix}-${fallbackNum}`;
    const finalBarcode = (prodForm.barcode && prodForm.barcode.trim()) || `6111000${String(fallbackNum).padStart(4, '0')}7`;

    // Process images: ensure list of strings and main img is synchronized
    const rawImages = Array.isArray(prodForm.images) ? prodForm.images : [];
    const validImages = rawImages.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
    const mainImg = prodForm.img?.trim() || validImages[0] || '';
    if (mainImg && !validImages.includes(mainImg)) {
      validImages.unshift(mainImg);
    }

    const productPayload = {
      ...prodForm,
      img: mainImg,
      images: validImages,
      video: prodForm.video?.trim() || '',
      sku: finalSku,
      barcode: finalBarcode,
      stock: prodForm.stock !== undefined ? Number(prodForm.stock) : 10,
    };

    if (isCreatingProduct) {
      await onCreateProduct(productPayload);
      showToast('Bijou avec photos & vidéo ajouté avec succès au catalogue ✦');
    } else if (editingProduct) {
      await onUpdateProduct({ ...(editingProduct as Product), ...(productPayload as Product) });
      showToast('Bijou mis à jour avec succès ✦');
    }
    setEditingProduct(null);
    setIsCreatingProduct(false);
  };

  const handleSaveContent = async () => {
    setIsSavingContent(true);
    try {
      await onUpdateContent(contentForm);
      if (typeof window !== 'undefined') {
        const logo = contentForm.settings?.customLogoUrl || '';
        if (logo) {
          localStorage.setItem('ovelzya_custom_logo', logo);
        } else {
          localStorage.removeItem('ovelzya_custom_logo');
        }
        window.dispatchEvent(new CustomEvent('ovelzya_logo_updated', { detail: logo || null }));
      }
      showToast('Contenu des pages et logo enregistrés ✦');
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleSaveSettings = async () => {
    await onUpdateContent({ settings: settingsForm });
    if (typeof window !== 'undefined') {
      const logo = settingsForm.customLogoUrl || '';
      if (logo) {
        localStorage.setItem('ovelzya_custom_logo', logo);
      } else {
        localStorage.removeItem('ovelzya_custom_logo');
      }
      window.dispatchEvent(new CustomEvent('ovelzya_logo_updated', { detail: logo || null }));
      if (settingsForm.languages) {
        localStorage.setItem('ovelzya_languages_config', JSON.stringify(settingsForm.languages));
      }
      if (settingsForm.socialIcons) {
        localStorage.setItem('ovelzya_social_icons_config', JSON.stringify(settingsForm.socialIcons));
      }
      if (settingsForm.socialLinks) {
        localStorage.setItem('ovelzya_social_links_config', JSON.stringify(settingsForm.socialLinks));
      }
      window.dispatchEvent(new CustomEvent('ovelzya_settings_updated', { detail: settingsForm }));
    }
    showToast('Paramètres, langues, URLs réseaux sociaux et logo enregistrés ✦');
  };

  const handleSaveFlash = async () => {
    await onUpdateFlash(localFlash);
    showToast('Offres flash mises à jour ✦');
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasswordForm.newPassword || adminPasswordForm.newPassword.length < 4) {
      showToast('Le nouveau mot de passe doit comporter au moins 4 caractères');
      return;
    }
    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      showToast('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    const isCommercial = currentUser?.role === 'commercial';
    setIsSubmittingPassword(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          userId: isCommercial ? currentUser?.id : (currentUser?.id || 'usr_admin'),
          email: isCommercial ? currentUser?.email : (currentUser?.email || 'admin@ovelzya.com'),
          requesterRole: currentUser?.role || 'admin',
          requesterEmail: currentUser?.email || 'admin@ovelzya.com',
          currentPassword: adminPasswordForm.currentPassword,
          newPassword: adminPasswordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Erreur lors du changement de mot de passe');
        return;
      }
      showToast(isCommercial ? 'Mot de passe commercial modifié avec succès ✦' : 'Mot de passe administrateur mis à jour avec succès ✦');
      setAdminPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      if (data.user && onUpdateUser) {
        await onUpdateUser(data.user);
      }
      if (onRefreshUsers) await onRefreshUsers();
    } catch {
      showToast('Erreur de connexion au serveur');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordModalUser) return;
    if (!resetPasswordInput || resetPasswordInput.length < 4) {
      showToast('Le mot de passe doit comporter au moins 4 caractères');
      return;
    }
    setIsSubmittingReset(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_set_password',
          targetUserId: resetPasswordModalUser.id,
          newPassword: resetPasswordInput,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Erreur lors de la réinitialisation');
        return;
      }
      showToast(`Mot de passe réinitialisé avec succès pour ${resetPasswordModalUser.name} ✦`);
      setResetPasswordModalUser(null);
      setResetPasswordInput('');
      if (onRefreshUsers) await onRefreshUsers();
    } catch {
      showToast('Erreur de connexion au serveur');
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const handleCreateCommercial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommercialForm.name || !newCommercialForm.email || !newCommercialForm.password) {
      showToast('Veuillez renseigner le nom, email et mot de passe');
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_commercial',
          name: newCommercialForm.name,
          email: newCommercialForm.email,
          phone: newCommercialForm.phone,
          city: newCommercialForm.city,
          password: newCommercialForm.password,
          permissions: newCommercialForm.permissions,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erreur lors de la création du commercial');
        return;
      }
      showToast(`Compte commercial créé avec succès pour ${newCommercialForm.name} ✦`);
      setIsCreatingCommercial(false);
      setNewCommercialForm({
        name: '',
        email: '',
        phone: '',
        city: 'Casablanca',
        password: '',
        permissions: {
          canManageOrders: true,
          canManageProducts: true,
          canManageClients: false,
          canPrintInvoices: true,
          canPrintTickets: true,
          canViewReports: false,
        },
      });
      if (onRefreshUsers) await onRefreshUsers();
    } catch {
      showToast('Erreur lors de la création du commercial');
    }
  };

  const handleTogglePermission = async (commercial: RegisteredUser, permKey: keyof CommercialPermissions) => {
    if (!onUpdateUser) return;
    const currentPerms = commercial.permissions || {
      canManageOrders: true,
      canManageProducts: true,
      canManageClients: false,
      canPrintInvoices: true,
      canPrintTickets: true,
      canViewReports: false,
    };
    const updatedPerms = {
      ...currentPerms,
      [permKey]: !currentPerms[permKey],
    };
    await onUpdateUser({
      id: commercial.id,
      permissions: updatedPerms,
    });
    showToast(`Droits mis à jour pour ${commercial.name} ✦`);
    if (onRefreshUsers) await onRefreshUsers();
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = productCat === 'Tous' || p.cat === productCat;
      const matchQ =
        !productSearch ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.name_ar?.includes(productSearch) ||
        p.cat.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.barcode && p.barcode.toLowerCase().includes(productSearch.toLowerCase()));
      return matchCat && matchQ;
    });

    switch (productSort) {
      case 'newest':
        return [...list].sort((a, b) => b.id - a.id);
      case 'oldest':
        return [...list].sort((a, b) => a.id - b.id);
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...list].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      case 'name-desc':
        return [...list].sort((a, b) => b.name.localeCompare(a.name, 'fr'));
      case 'stock-asc':
        return [...list].sort((a, b) => (a.stock ?? 10) - (b.stock ?? 10));
      case 'stock-desc':
        return [...list].sort((a, b) => (b.stock ?? 10) - (a.stock ?? 10));
      case 'default':
      default:
        return list;
    }
  }, [products, productCat, productSearch, productSort]);

  const filteredOrders = orders.filter((o) => {
    if (!orderSearch) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.num.toLowerCase().includes(q) ||
      o.name.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      (o.city && o.city.toLowerCase().includes(q))
    );
  });

  const exportOrdersCSV = () => {
    if (filteredOrders.length === 0) {
      showToast('Aucune commande à exporter');
      return;
    }
    const headers = ['Numero', 'Date', 'Client', 'Telephone', 'Email', 'Ville', 'Total_DH', 'Methode_Paiement', 'Statut', 'Articles_SKU'];
    const rows = filteredOrders.map((o) => [
      `"${o.num}"`,
      `"${new Date(o.date).toISOString().slice(0, 10)}"`,
      `"${(o.name || '').replace(/"/g, '""')}"`,
      `"${o.phone || ''}"`,
      `"${o.email || ''}"`,
      `"${(o.city || '').replace(/"/g, '""')}"`,
      o.total,
      `"${o.payMethod || ''}"`,
      `"${o.status}"`,
      `"${o.items.map((i) => `${i.sku || `MD-${i.id}`}(x${i.qty})`).join('; ')}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `commandes_maison_doree_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Export CSV téléchargé avec succès ✦');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0d0d0d] text-[#f4f1ea] flex flex-col font-sans no-print">
      {/* Top Admin Navigation Header */}
      <header className="border-b border-[rgba(212,175,55,0.25)] bg-[#121212]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <OvelzyaLogo variant="header" size="sm" />
          <div>
            <div className="flex items-center gap-2">
              {currentUser?.role === 'commercial' ? (
                <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase bg-blue-500/15 border border-blue-500/40 text-blue-400 rounded font-semibold">
                  Espace Commercial · {currentUser.name}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] rounded font-semibold">
                  Admin Studio · {currentUser?.name || 'Administrateur'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#9a958a]">
              Gestion du catalogue, stocks, commandes et droits d&apos;accès
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              className="w-9 h-9 rounded border border-[#2a2a2a] hover:border-[#d4af37]/50 text-[#cfcbc2] hover:text-[#d4af37] flex items-center justify-center transition cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#a07409]" />}
            </button>
          )}

          <button
            onClick={onResetData}
            title="Réinitialiser le catalogue et contenu par défaut"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider text-[#9a958a] hover:text-[#d4af37] border border-[#2a2a2a] hover:border-[#d4af37]/50 rounded transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser démo
          </button>
          <button
            onClick={onCloseAdmin}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black text-xs font-semibold uppercase tracking-wider transition rounded"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Voir le site boutique
          </button>
        </div>
      </header>

      {/* Main Admin Body with Sidebar and Content Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Admin Sidebar Tabs */}
        <aside className="w-64 border-r border-[rgba(212,175,55,0.2)] bg-[#101010] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <nav className="space-y-1.5">
            {/* TAB: DASHBOARD (RECHARTS METRICS 30 DAYS) */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#d4af37] text-black font-semibold shadow-lg shadow-[#d4af37]/10'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Dashboard (30j)</span>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  activeTab === 'dashboard'
                    ? 'bg-black/20 text-black'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                Recharts
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#d4af37] text-black font-semibold shadow-lg shadow-[#d4af37]/10'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Synthèse Boutique</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                activeTab === 'products'
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Bijoux & Catalogue</span>
              </div>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded ${
                  activeTab === 'products' ? 'bg-black/20 text-black' : 'bg-[#222] text-[#9a958a]'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                activeTab === 'content'
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Contenu des Pages</span>
            </button>

            <button
              onClick={() => setActiveTab('flash')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                activeTab === 'flash'
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Offres Flash</span>
              </div>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded ${
                  activeTab === 'flash' ? 'bg-black/20 text-black' : 'bg-[#222] text-[#9a958a]'
                }`}
              >
                {flash.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                activeTab === 'orders'
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Commandes</span>
              </div>
              {pendingOrders > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${
                    activeTab === 'orders' ? 'bg-black/20 text-black' : 'bg-[#e05a4e] text-white'
                  }`}
                >
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                activeTab === 'clients'
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Clients Inscrits</span>
              </div>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded ${
                  activeTab === 'clients' ? 'bg-black/20 text-black' : 'bg-[#222] text-[#9a958a]'
                }`}
              >
                {clients.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                activeTab === 'messages'
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Messages & Conciergerie</span>
              </div>
              {unreadMessages > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${
                    activeTab === 'messages' ? 'bg-black/20 text-black' : 'bg-[#d4af37] text-black'
                  }`}
                >
                  {unreadMessages}
                </span>
              )}
            </button>

            {/* TAB: Équipe, Commerciaux & Sécurité (Admin Only) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                  activeTab === 'team'
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Équipe & Droits</span>
                </div>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded ${
                    activeTab === 'team' ? 'bg-black/20 text-black' : 'bg-[#222] text-[#9a958a]'
                  }`}
                >
                  {clients.filter((c) => c.role === 'commercial').length}
                </span>
              </button>
            )}

            {/* TAB: BOOSTER DE VENTES */}
            <button
              onClick={() => setActiveTab('boosters')}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                activeTab === 'boosters'
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Rocket className="w-4 h-4 text-amber-400" />
                <span>Booster de Ventes</span>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  activeTab === 'boosters'
                    ? 'bg-black/20 text-black'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {activeBoostersCount}/7
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider rounded transition text-left ${
                activeTab === 'settings'
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'text-[#cfcbc2] hover:bg-[#181818] hover:text-[#d4af37]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Paramètres Maison</span>
            </button>
          </nav>

          <div className="border-t border-[#222] pt-4 text-[11px] text-[#9a958a] space-y-1">
            <p className="font-semibold text-neutral-300">Maison Ovelzya</p>
            <p className="text-[#666]">Haute Joaillerie 316L & Sacs d&apos;Exception</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0a0a0a]">
          {/* TAB: DASHBOARD (RECHARTS 30-DAY BUSINESS METRICS) */}
          {activeTab === 'dashboard' && (
            <AdminBusinessDashboard orders={orders} products={products} />
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37]">Synthèse</span>
                <h1 className="text-3xl font-serif text-white mt-1">Aperçu Général de la Boutique</h1>
                <p className="text-sm text-[#9a958a] mt-1">
                  Statistiques en direct, gestion du catalogue et suivi des commandes.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded border border-[rgba(212,175,55,0.25)] bg-[#141414]">
                  <span className="text-xs uppercase tracking-wider text-[#9a958a]">Chiffre d&apos;Affaires</span>
                  <div className="text-3xl font-serif text-[#d4af37] mt-2 font-bold">
                    {totalRevenue.toLocaleString('fr-FR')} DH
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Commandes enregistrées
                  </span>
                </div>

                <div className="p-5 rounded border border-[rgba(212,175,55,0.25)] bg-[#141414]">
                  <span className="text-xs uppercase tracking-wider text-[#9a958a]">Commandes Totales</span>
                  <div className="text-3xl font-serif text-white mt-2 font-bold">{orders.length}</div>
                  <span className="text-[11px] text-amber-400 mt-1 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pendingOrders} en cours de traitement
                  </span>
                </div>

                <div className="p-5 rounded border border-[rgba(212,175,55,0.25)] bg-[#141414]">
                  <span className="text-xs uppercase tracking-wider text-[#9a958a]">Pièces au Catalogue</span>
                  <div className="text-3xl font-serif text-[#d4af37] mt-2 font-bold">
                    {products.length}
                  </div>
                  <span className="text-[11px] text-[#9a958a] mt-1 block">
                    {products.filter((p) => p.inStock !== false).length} en stock actif
                  </span>
                </div>

                <div className="p-5 rounded border border-[rgba(212,175,55,0.25)] bg-[#141414]">
                  <span className="text-xs uppercase tracking-wider text-[#9a958a]">Messages Clients</span>
                  <div className="text-3xl font-serif text-white mt-2 font-bold">
                    {contacts.length}
                  </div>
                  <span className="text-[11px] text-[#d4af37] mt-1 block">
                    {unreadMessages} non lu{unreadMessages > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded border border-[#262626] bg-[#121212] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-serif text-white">Dernières Commandes</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs uppercase tracking-wider text-[#d4af37] hover:underline"
                    >
                      Voir toutes →
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-sm text-[#9a958a] py-6 text-center">Aucune commande enregistrée.</p>
                  ) : (
                    <div className="divide-y divide-[#222]">
                      {orders.slice(0, 5).map((o) => (
                        <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-[#d4af37] font-semibold">
                                {o.num}
                              </span>
                              <span className="text-xs text-white font-medium">{o.name}</span>
                            </div>
                            <p className="text-[11px] text-[#9a958a] mt-0.5">
                              {new Date(o.date).toLocaleDateString('fr-FR')} · {o.city || 'Maroc'} ·{' '}
                              {o.payMethod}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-serif font-semibold text-[#d4af37]">
                              {o.total.toLocaleString('fr-FR')} DH
                            </span>
                            <span
                              className={`block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded mt-0.5 ${
                                o.status === 'livree'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : o.status === 'expediee'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}
                            >
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts */}
                <div className="rounded border border-[#262626] bg-[#121212] p-6 space-y-4">
                  <h2 className="text-lg font-serif text-white">Actions Rapides</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveTab('products');
                        handleOpenCreateProduct();
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-[#181818] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#d4af37]/40 rounded text-left transition text-xs uppercase tracking-wider text-white"
                    >
                      <Plus className="w-4 h-4 text-[#d4af37]" />
                      Ajouter un nouveau bijou
                    </button>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="w-full flex items-center gap-3 p-3 bg-[#181818] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#d4af37]/40 rounded text-left transition text-xs uppercase tracking-wider text-white"
                    >
                      <FileText className="w-4 h-4 text-[#d4af37]" />
                      Modifier les textes de la page d&apos;accueil
                    </button>
                    <button
                      onClick={() => setActiveTab('flash')}
                      className="w-full flex items-center gap-3 p-3 bg-[#181818] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#d4af37]/40 rounded text-left transition text-xs uppercase tracking-wider text-white"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      Configurer les ventes flash
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full flex items-center gap-3 p-3 bg-[#181818] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#d4af37]/40 rounded text-left transition text-xs uppercase tracking-wider text-white"
                    >
                      <Settings className="w-4 h-4 text-[#d4af37]" />
                      Modifier WhatsApp & Coordonnées
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d4af37]">Catalogue</span>
                  <h1 className="text-3xl font-serif text-white mt-1">Gestion des Bijoux</h1>
                  <p className="text-sm text-[#9a958a]">
                    Ajoutez, modifiez ou retirez des pièces en acier chirurgical 316L et or 18K PVD.
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateProduct}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un bijou
                </button>
              </div>

              {/* Filter bar with sorting selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141414] p-3 rounded border border-[#262626]">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-[#9a958a]" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, SKU ou catégorie..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  {/* Sorter Selector */}
                  <div className="flex items-center gap-2 bg-[#1b1b1b] border border-[#333] px-3 py-1.5 rounded">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37]" />
                    <label className="text-[11px] uppercase tracking-wider text-[#9a958a] font-semibold whitespace-nowrap">
                      Trier :
                    </label>
                    <select
                      value={productSort}
                      onChange={(e) => setProductSort(e.target.value as any)}
                      className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="default" className="bg-[#1b1b1b] text-white">Ordre Catalogue (Manuel)</option>
                      <option value="newest" className="bg-[#1b1b1b] text-white">Plus récents d&apos;abord</option>
                      <option value="oldest" className="bg-[#1b1b1b] text-white">Plus anciens d&apos;abord</option>
                      <option value="price-asc" className="bg-[#1b1b1b] text-white">Prix : Moins cher → Plus cher</option>
                      <option value="price-desc" className="bg-[#1b1b1b] text-white">Prix : Plus cher → Moins cher</option>
                      <option value="name-asc" className="bg-[#1b1b1b] text-white">Nom : Alphabétique (A → Z)</option>
                      <option value="name-desc" className="bg-[#1b1b1b] text-white">Nom : Alphabétique (Z → A)</option>
                      <option value="stock-asc" className="bg-[#1b1b1b] text-white">Stock : Ruptures d&apos;abord</option>
                      <option value="stock-desc" className="bg-[#1b1b1b] text-white">Stock : Plus élevé d&apos;abord</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {['Tous', ...categories].map((c) => (
                    <button
                      key={c}
                      onClick={() => setProductCat(c)}
                      className={`px-3 py-1.5 text-xs rounded uppercase tracking-wider whitespace-nowrap transition ${
                        productCat === c
                          ? 'bg-[#d4af37] text-black font-semibold'
                          : 'bg-[#1e1e1e] text-[#cfcbc2] hover:bg-[#282828]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="border border-[#282828] hover:border-[#d4af37]/40 bg-[#141414] rounded p-4 flex flex-col justify-between transition group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-16 h-20 bg-[#222] rounded overflow-hidden shrink-0 border border-[#333]">
                          <img
                            src={p.img || `https://picsum.photos/seed/${p.seed}/200/250`}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.seed}/200/250`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-[#9a958a] block">
                            {p.cat} {p.badge ? `· ${p.badge}` : ''}
                          </span>
                          <h3 className="text-base font-semibold text-white truncate font-serif mt-0.5">
                            {p.name}
                          </h3>
                          <p className="text-xs text-[#9a958a] truncate font-arabic">{p.name_ar}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-sm font-serif font-bold text-[#d4af37]">
                              {p.price.toLocaleString('fr-FR')} DH
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                                (p.stock ?? 10) > 3
                                  ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50'
                                  : (p.stock ?? 10) > 0
                                  ? 'bg-amber-950/50 text-amber-400 border border-amber-800/50'
                                  : 'bg-red-950/50 text-red-400 border border-red-800/50'
                              }`}
                            >
                              {(p.stock ?? 10) > 0 ? `${p.stock ?? 10} en stock` : 'Rupture'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Barcode & SKU Badges */}
                      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#1e1e1e] text-[10px] font-mono flex-wrap">
                        <span className="text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 flex items-center gap-1 font-semibold">
                          <span className="text-[9px] text-[#9a958a]">SKU:</span> {p.sku || `MD-${String(p.id).padStart(3, '0')}`}
                        </span>
                        {p.barcode && (
                          <span className="text-[#ccc] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333] flex items-center gap-1">
                            <Barcode className="w-3 h-3 text-[#9a958a]" />
                            {p.barcode}
                          </span>
                        )}
                      </div>

                      {/* Media indicators (photos count & video) */}
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1e1e1e] text-[#ccc] border border-[#333]">
                          <ImageIcon className="w-3 h-3 text-[#d4af37]" />
                          <span>
                            {Array.isArray(p.images) && p.images.length > 0
                              ? p.images.length
                              : p.img
                              ? 1
                              : 0}{' '}
                            photo
                            {(Array.isArray(p.images) && p.images.length > 0
                              ? p.images.length
                              : p.img
                              ? 1
                              : 0) > 1
                              ? 's'
                              : ''}
                          </span>
                        </span>
                        {p.video && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40">
                            <Film className="w-3 h-3 text-purple-400" />
                            <span>Vidéo</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#9a958a] line-clamp-2 mt-2 font-light">
                        {p.desc || 'Pas de description'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#222] pt-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[#777]">ID #{p.id}</span>
                        {/* Position reorder buttons */}
                        {onReorderProducts && (
                          <div className="flex items-center gap-0.5 bg-[#1b1b1b] border border-[#2b2b2b] rounded px-1 py-0.5 ml-1">
                            <button
                              type="button"
                              onClick={() => handleMoveProduct(p.id, 'up')}
                              disabled={products.findIndex((it) => it.id === p.id) === 0}
                              title="Monter ce bijou dans l'ordre du catalogue"
                              className="p-1 hover:text-[#d4af37] text-[#888] disabled:opacity-20 cursor-pointer transition"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveProduct(p.id, 'down')}
                              disabled={products.findIndex((it) => it.id === p.id) === products.length - 1}
                              title="Descendre ce bijou dans l'ordre du catalogue"
                              className="p-1 hover:text-[#d4af37] text-[#888] disabled:opacity-20 cursor-pointer transition"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 text-xs text-[#cfcbc2] hover:text-[#d4af37] bg-[#1c1c1c] hover:bg-[#252525] rounded transition cursor-pointer"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget({
                              type: 'product',
                              id: p.id,
                              title: p.name,
                              subtitle: `${p.cat} · ${p.price.toLocaleString('fr-FR')} DH`,
                            });
                          }}
                          className="p-1.5 text-xs text-red-400 hover:text-red-300 bg-[#1c1c1c] hover:bg-red-950/40 rounded transition cursor-pointer"
                          title="Supprimer ce bijou"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CONTENT MANAGEMENT */}
          {activeTab === 'content' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d4af37]">Rédaction</span>
                  <h1 className="text-3xl font-serif text-white mt-1">Contenu des Pages</h1>
                  <p className="text-sm text-[#9a958a]">
                    Modifiez tous les titres, slogans, textes d&apos;accroche et bannières du site.
                  </p>
                </div>
                <button
                  onClick={handleSaveContent}
                  disabled={isSavingContent}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition"
                >
                  <Save className="w-4 h-4" />
                  {isSavingContent ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>

              {/* Section: Logo Officiel & Identité Visuelle (.PNG) */}
              <div className="p-6 rounded border border-[#d4af37]/40 bg-[#141310] space-y-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a261a] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Identité de Marque</span>
                      {contentForm.settings?.customLogoUrl ? (
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-medium">
                          Logo .PNG Personnalisé Actif
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 rounded font-medium">
                          Logo Vectoriel Or 18K Officiel
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-serif text-white mt-1">Logo Officiel de la Maison (.PNG)</h2>
                    <p className="text-xs text-[#9a958a] mt-0.5">
                      Ajoutez manuellement votre logo au format image (.png avec fond transparent recommandé).
                      Il s&apos;appliquera automatiquement sur le site (en-tête, pied de page), les factures officielles PDF et les tickets de caisse.
                    </p>
                  </div>
                  {contentForm.settings?.customLogoUrl && (
                    <button
                      type="button"
                      onClick={handleResetToDefaultLogo}
                      className="shrink-0 px-3 py-1.5 text-xs text-rose-400 hover:text-white hover:bg-rose-950/60 border border-rose-900/40 rounded transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Rétablir le logo par défaut
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Upload Controls & URL input */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* File Upload Dropzone */}
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-2 font-medium">
                        1. Importer un fichier image .PNG depuis votre appareil
                      </label>
                      <label className="relative flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] bg-[#1a1812] hover:bg-[#201d14] rounded-lg cursor-pointer transition group">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={handleUploadLogoPng}
                          className="hidden"
                        />
                        <div className="w-11 h-11 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-white font-medium">
                          Cliquez pour sélectionner votre fichier logo (.png)
                        </span>
                        <span className="text-[11px] text-[#9a958a] mt-1">
                          PNG avec transparence recommandé &bull; Formats acceptés : .PNG, .WEBP, .SVG
                        </span>
                      </label>
                    </div>

                    {/* Or URL input */}
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                        2. Ou saisir directement l&apos;URL de votre logo .PNG
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="https://.../logo.png ou data:image/png;base64,..."
                            value={contentForm.settings?.customLogoUrl || ''}
                            onChange={(e) => handleCustomLogoUrlChange(e.target.value)}
                            className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                          />
                        </div>
                        {contentForm.settings?.customLogoUrl && (
                          <button
                            type="button"
                            onClick={() => handleCustomLogoUrlChange('')}
                            className="px-3 py-2 bg-[#222] hover:bg-[#333] text-[#9a958a] hover:text-white rounded text-xs transition"
                            title="Effacer l'URL"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dual Preview Box: Luxury Dark & Invoice Clean Light */}
                  <div className="lg:col-span-5 space-y-3">
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block font-medium">
                      Aperçu en direct du Logo
                    </label>

                    {/* Dark Background (Store Theme) */}
                    <div className="p-4 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] flex flex-col items-center justify-center min-h-[90px] relative">
                      <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider text-[#777] font-mono">
                        Aperçu Site (Fond Sombre)
                      </span>
                      <div className="pt-4 flex items-center justify-center">
                        <OvelzyaLogo
                          variant="header"
                          size="md"
                          customLogoUrl={contentForm.settings?.customLogoUrl}
                        />
                      </div>
                    </div>

                    {/* Light Background (Invoice / Ticket Theme) */}
                    <div className="p-4 rounded-lg border border-neutral-300 bg-white flex flex-col items-center justify-center min-h-[90px] relative">
                      <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider text-neutral-500 font-mono">
                        Aperçu Facture PDF / Caisse (Fond Blanc)
                      </span>
                      <div className="pt-4 flex items-center justify-center">
                        <OvelzyaLogo
                          variant="invoice"
                          lightMode={true}
                          customLogoUrl={contentForm.settings?.customLogoUrl}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Hero */}
              <div className="p-6 rounded border border-[#2a2a2a] bg-[#121212] space-y-5">
                <div className="border-b border-[#222] pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-serif text-white">Section Héro (Bannière Principale)</h2>
                    <p className="text-xs text-[#9a958a]">
                      Le message d&apos;accueil affiché en pleine page sur le site en 3 langues (FR, AR, EN).
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#1a1a1a] text-[#d4af37] border border-[#333] rounded">
                    🇫🇷 FR &bull; 🇸🇦 AR &bull; 🇬🇧 EN
                  </span>
                </div>

                {/* KICKER / BADGE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Kicker / Badge (Français 🇫🇷)
                    </label>
                    <input
                      type="text"
                      value={contentForm.hero.tag_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, tag_fr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Kicker / Badge (Arabe 🇸🇦)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentForm.hero.tag_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, tag_ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Kicker / Badge (Anglais 🇬🇧)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. High Jewelry & Artisanal Craft"
                      value={contentForm.hero.tag_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, tag_en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* GRAND TITRE H1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Grand Titre H1 (Français 🇫🇷)
                    </label>
                    <input
                      type="text"
                      value={contentForm.hero.h1_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, h1_fr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Grand Titre H1 (Arabe 🇸🇦)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentForm.hero.h1_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, h1_ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Grand Titre H1 (Anglais 🇬🇧)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Timeless Fine Jewelry"
                      value={contentForm.hero.h1_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, h1_en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* MOT DORÉ EMPHASE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Mot Doré Emphase (Français 🇫🇷)
                    </label>
                    <input
                      type="text"
                      value={contentForm.hero.h1_em_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, h1_em_fr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-[#d4af37] rounded focus:border-[#d4af37] focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Mot Doré Emphase (Arabe 🇸🇦)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentForm.hero.h1_em_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, h1_em_ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-[#d4af37] rounded focus:border-[#d4af37] focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Mot Doré Emphase (Anglais 🇬🇧)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eternal Radiance"
                      value={contentForm.hero.h1_em_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, h1_em_en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-[#d4af37] rounded focus:border-[#d4af37] focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* PARAGRAPHES DESCRIPTIFS HERO */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Paragraphe descriptif (Français 🇫🇷)
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.hero.p_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, p_fr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Paragraphe descriptif (Arabe 🇸🇦)
                    </label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={contentForm.hero.p_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, p_ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Paragraphe descriptif (Anglais 🇬🇧)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Crafted in 316L surgical steel plated in pure 18K gold, guaranteed water-resistant and hypoallergenic for life."
                      value={contentForm.hero.p_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          hero: { ...contentForm.hero, p_en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Image de fond Héro (URL)
                  </label>
                  <input
                    type="text"
                    value={contentForm.hero.img}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: { ...contentForm.hero, img: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Section 2: Marquee (Bande Défilante) */}
              <div className="p-6 rounded border border-[#2a2a2a] bg-[#121212] space-y-4">
                <div className="border-b border-[#222] pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-serif text-white">Bande Défilante (Marquee)</h2>
                    <p className="text-xs text-[#9a958a]">
                      Textes dorés qui défilent en continu sous le Héro.
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#1a1a1a] text-[#d4af37] border border-[#333] rounded">
                    3 Langues
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Texte Marquee (Français 🇫🇷)
                    </label>
                    <input
                      type="text"
                      value={contentForm.marquee.fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          marquee: { ...contentForm.marquee, fr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Texte Marquee (Arabe 🇸🇦)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentForm.marquee.ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          marquee: { ...contentForm.marquee, ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Texte Marquee (Anglais 🇬🇧)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ✦ 316L SURGICAL STEEL ✦ 18K GOLD PVD COATING ✦ WATERPROOF ✦ LIFETIME WARRANTY ✦ FAST DELIVERY"
                      value={contentForm.marquee.en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          marquee: { ...contentForm.marquee, en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Savoir-faire */}
              <div className="p-6 rounded border border-[#2a2a2a] bg-[#121212] space-y-4">
                <div className="border-b border-[#222] pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-serif text-white">Section Savoir-Faire (316L & Or PVD)</h2>
                    <p className="text-xs text-[#9a958a]">Présentation de l&apos;acier chirurgical, du plaquage et des certifications.</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#1a1a1a] text-[#d4af37] border border-[#333] rounded">
                    Multilingue
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Titre (Français 🇫🇷)
                    </label>
                    <input
                      type="text"
                      value={contentForm.craft.h2_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, h2_fr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Titre (Arabe 🇸🇦)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={contentForm.craft.h2_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, h2_ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Titre (Anglais 🇬🇧)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Master Craftsmanship & Eternal Lustre"
                      value={contentForm.craft.h2_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, h2_en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* PARAGRAPHE 1 */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Paragraphe 1 (Français 🇫🇷)
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.craft.p1_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, p1_fr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Paragraphe 1 (Arabe 🇸🇦)
                    </label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={contentForm.craft.p1_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, p1_ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Paragraphe 1 (Anglais 🇬🇧)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Crafted from surgical 316L stainless steel, our jewelry resists corrosion, perspiration and perfumes, preserving its authentic golden mirror sheen."
                      value={contentForm.craft.p1_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, p1_en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* PARAGRAPHE 2 */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Paragraphe 2 (Français 🇫🇷)
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.craft.p2_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, p2_fr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Paragraphe 2 (Arabe 🇸🇦)
                    </label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={contentForm.craft.p2_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, p2_ar: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Paragraphe 2 (Anglais 🇬🇧)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Our physical vapor deposition (PVD) gold bonding process embeds pure 18-karat gold onto surgical steel at high temperatures in a vacuum."
                      value={contentForm.craft.p2_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          craft: { ...contentForm.craft, p2_en: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 4: BANNIÈRE PROMOTIONS & VENTES FLASH (FR / AR / EN) */}
              <div className="p-6 rounded border border-[rgba(212,175,55,0.3)] bg-[#121212] space-y-4">
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    <h2 className="text-base font-serif font-semibold text-white">
                      Section 4 · Bannière Ventes Flash & Offres Privilège (Multilingue)
                    </h2>
                  </div>
                  <span className="text-[10px] text-[#d4af37] uppercase tracking-wider font-mono">
                    3 Langues (FR / AR / EN)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Titre de l&apos;Offre (Français 🇫🇷)
                    </label>
                    <input
                      type="text"
                      placeholder="Ventes Flash du Mois"
                      value={contentForm.flashBanner?.title_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          flashBanner: {
                            ...(contentForm.flashBanner || { sub_fr: '', sub_ar: '' }),
                            title_fr: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Titre de l&apos;Offre (Arabe 🇸🇦)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="عروض الشهر الحصرية"
                      value={contentForm.flashBanner?.title_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          flashBanner: {
                            ...(contentForm.flashBanner || { sub_fr: '', sub_ar: '' }),
                            title_ar: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Titre de l&apos;Offre (Anglais 🇬🇧)
                    </label>
                    <input
                      type="text"
                      placeholder="Exclusive Monthly Flash Sales"
                      value={contentForm.flashBanner?.title_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          flashBanner: {
                            ...(contentForm.flashBanner || { sub_fr: '', sub_ar: '' }),
                            title_en: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Sous-titre / Promesse (Français 🇫🇷)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Pièces d'exception à tarif privilégié dans la limite des stocks disponibles."
                      value={contentForm.flashBanner?.sub_fr || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          flashBanner: {
                            ...(contentForm.flashBanner || { title_fr: '', title_ar: '' }),
                            sub_fr: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Sous-titre / Promesse (Arabe 🇸🇦)
                    </label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      placeholder="قطع استثنائية بأسعار حصرية حتى نفاد الكمية."
                      value={contentForm.flashBanner?.sub_ar || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          flashBanner: {
                            ...(contentForm.flashBanner || { title_fr: '', title_ar: '' }),
                            sub_ar: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                      Sous-titre / Promesse (Anglais 🇬🇧)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Exceptional pieces at exclusive privileged rates while supplies last."
                      value={contentForm.flashBanner?.sub_en || ''}
                      onChange={(e) =>
                        setContentForm({
                          ...contentForm,
                          flashBanner: {
                            ...(contentForm.flashBanner || { title_fr: '', title_ar: '' }),
                            sub_en: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FLASH SALES */}
          {activeTab === 'flash' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-400">Promotions</span>
                  <h1 className="text-3xl font-serif text-white mt-1">Ventes Flash du Mois</h1>
                  <p className="text-sm text-[#9a958a]">
                    Sélectionnez les pièces bénéficiant d&apos;une remise immédiate avec compte à rebours.
                  </p>
                </div>
                <button
                  onClick={handleSaveFlash}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer les offres
                </button>
              </div>

              <div className="p-6 rounded border border-[#2a2a2a] bg-[#121212] space-y-4">
                <div className="space-y-3">
                  {products.map((p) => {
                    const flashEntry = localFlash.find((f) => f.id === p.id);
                    const isChecked = !!flashEntry;
                    const pct = flashEntry ? flashEntry.pct : 20;

                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-3 rounded border transition ${
                          isChecked
                            ? 'border-amber-500/50 bg-amber-500/5'
                            : 'border-[#262626] bg-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setLocalFlash([...localFlash, { id: p.id, pct: 20 }]);
                              } else {
                                setLocalFlash(localFlash.filter((f) => f.id !== p.id));
                              }
                            }}
                            className="w-4 h-4 accent-[#d4af37]"
                          />
                          <div>
                            <span className="text-sm text-white font-medium block">{p.name}</span>
                            <span className="text-xs text-[#9a958a]">
                              Prix standard : {p.price.toLocaleString('fr-FR')} DH
                            </span>
                          </div>
                        </div>

                        {isChecked && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#9a958a]">Remise :</span>
                            <select
                              value={pct}
                              onChange={(e) => {
                                const newPct = Number(e.target.value);
                                setLocalFlash(
                                  localFlash.map((f) => (f.id === p.id ? { ...f, pct: newPct } : f))
                                );
                              }}
                              className="bg-[#202020] border border-[#444] text-xs text-[#d4af37] font-bold px-2 py-1 rounded"
                            >
                              <option value={10}>−10 %</option>
                              <option value={15}>−15 %</option>
                              <option value={20}>−20 %</option>
                              <option value={25}>−25 %</option>
                              <option value={30}>−30 %</option>
                              <option value={40}>−40 %</option>
                            </select>
                            <span className="text-xs font-serif font-bold text-amber-400 min-w-[70px] text-right">
                              → {Math.round(p.price * (1 - pct / 100)).toLocaleString('fr-FR')} DH
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d4af37]">Logistique</span>
                  <h1 className="text-3xl font-serif text-white mt-1">Commandes Clients</h1>
                  <p className="text-sm text-[#9a958a]">
                    Consultez les commandes et mettez à jour le statut du suivi en temps réel.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportOrdersCSV}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] hover:border-[#d4af37]/40 text-xs text-[#cfcbc2] hover:text-[#d4af37] rounded transition cursor-pointer"
                    title="Exporter les commandes affichées au format CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="font-semibold">Export CSV</span>
                  </button>

                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9a958a]" />
                    <input
                      type="text"
                      placeholder="Numéro, client, ville..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-[#141414] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="border border-[#262626] bg-[#121212] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#181818] text-[#9a958a] text-xs uppercase tracking-wider border-b border-[#262626]">
                      <tr>
                        <th className="p-3.5">Numéro & Date</th>
                        <th className="p-3.5">Client & Contact</th>
                        <th className="p-3.5">Articles</th>
                        <th className="p-3.5">Total & Paiement</th>
                        <th className="p-3.5">Statut de Suivi</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#9a958a]">
                            Aucune commande trouvée.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#161616] transition">
                            <td className="p-3.5">
                              <span className="font-mono text-xs font-bold text-[#d4af37] block">
                                {o.num}
                              </span>
                              <span className="text-[11px] text-[#777]">
                                {new Date(o.date).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-white">{o.name}</div>
                              <div className="text-xs text-[#9a958a]">{o.email}</div>
                              {o.phone && <div className="text-[11px] text-[#777]">{o.phone}</div>}
                            </td>
                            <td className="p-3.5">
                              <span className="text-xs text-[#cfcbc2]">
                                {o.items.reduce((s, i) => s + i.qty, 0)} pièce(s)
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-serif font-bold text-[#d4af37]">
                                {o.total.toLocaleString('fr-FR')} DH
                              </div>
                              <div className="text-[11px] text-[#9a958a]">{o.payMethod}</div>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={o.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as OrderStatus;
                                  onUpdateOrderStatus(o.id, newStatus);
                                  showToast(`Statut mis à jour : ${newStatus}`);
                                }}
                                className="bg-[#1e1e1e] border border-[#333] text-xs text-white rounded px-2.5 py-1.5 focus:border-[#d4af37] focus:outline-none"
                              >
                                <option value="reçue">1. Commande reçue</option>
                                <option value="preparation">2. Préparation en cours</option>
                                <option value="expediee">3. Expédiée</option>
                                <option value="livraison">4. En livraison</option>
                                <option value="livree">5. Livrée ✦</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {onPrintInvoice && (
                                  <button
                                    onClick={() => onPrintInvoice(o)}
                                    title="Imprimer ou enregistrer en Facture PDF (A4)"
                                    className="p-1.5 text-xs text-[#cfcbc2] hover:text-[#d4af37] bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] hover:border-[#d4af37]/40 rounded transition inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                                    <span className="hidden md:inline font-medium">Facture PDF</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    if (onPrintWarranty) onPrintWarranty(o);
                                    else setActiveWarrantyOrder(o);
                                  }}
                                  title="Générer et télécharger le Certificat de Garantie PDF personnalisé"
                                  className="p-1.5 text-xs text-[#d4af37] hover:text-[#e8c878] bg-[#1a1a1a] hover:bg-[#252525] border border-[#d4af37]/50 rounded transition inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                                  <span className="hidden lg:inline font-semibold">Garantie PDF</span>
                                </button>
                                {onPrintReceipt && (
                                  <button
                                    onClick={() => onPrintReceipt(o)}
                                    title="Imprimer Ticket Caisse 80 mm (2ème imprimante)"
                                    className="p-1.5 text-xs text-black font-semibold bg-[#d4af37] hover:bg-[#e8c878] rounded transition inline-flex items-center gap-1 cursor-pointer shadow"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span className="hidden md:inline">Ticket 80mm</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => setViewOrder(o)}
                                  className="p-1.5 text-xs text-[#cfcbc2] hover:text-[#d4af37] bg-[#1c1c1c] hover:bg-[#252525] border border-[#333] rounded transition inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Détails</span>
                                </button>
                                {onDeleteOrder && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeleteTarget({
                                        type: 'order',
                                        id: o.id,
                                        title: `Commande ${o.num}`,
                                        subtitle: `${o.name} · ${o.total.toLocaleString('fr-FR')} DH · ${o.city || 'Maroc'}`,
                                      });
                                    }}
                                    title="Supprimer cette commande"
                                    className="p-1.5 text-xs text-red-400 hover:text-red-300 bg-[#1c1c1c] hover:bg-red-950/40 border border-red-900/40 rounded transition inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="hidden xl:inline">Supprimer</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37]">Conciergerie</span>
                <h1 className="text-3xl font-serif text-white mt-1">Messages & Demandes</h1>
                <p className="text-sm text-[#9a958a]">
                  Demandes envoyées via le formulaire de contact ou la conciergerie.
                </p>
              </div>

              <div className="space-y-3">
                {localContacts.length === 0 ? (
                  <div className="p-12 text-center text-[#9a958a] border border-[#262626] bg-[#121212] rounded">
                    Aucun message reçu pour le moment.
                  </div>
                ) : (
                  localContacts.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4 rounded border transition ${
                        c.read ? 'border-[#262626] bg-[#121212]' : 'border-[#d4af37]/40 bg-[#161616]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                            <span className="text-xs text-[#9a958a]">({c.email})</span>
                            {!c.read && (
                              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-[#d4af37] text-black font-bold rounded">
                                Nouveau
                              </span>
                            )}
                            {c.userId && (
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-semibold rounded flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Compte Client Ovelzya
                              </span>
                            )}
                            {c.orderNumber && (
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-950/40 border border-blue-600/40 text-blue-300 rounded">
                                Commande liée : #{c.orderNumber}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#d4af37] font-medium block mt-1">
                            Sujet : {c.subject}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#777]">
                          {new Date(c.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-[#cfcbc2] mt-2 whitespace-pre-wrap font-light bg-[#191919] p-3 rounded border border-[#242424]">
                        {c.message}
                      </p>

                      {/* Official Maison Response Thread */}
                      {c.reply && (
                        <div className="mt-3 p-3 bg-[#1e1a12] border border-[#d4af37]/50 rounded text-xs space-y-1">
                          <div className="flex items-center justify-between text-[#d4af37] font-semibold text-[11px]">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              Réponse officielle de la Maison Ovelzya
                            </span>
                            {c.repliedAt && (
                              <span className="text-[#888] font-normal text-[10px]">
                                {new Date(c.repliedAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-[#e8decb] whitespace-pre-wrap leading-relaxed">{c.reply}</p>
                        </div>
                      )}

                      {/* Inline Reply Form */}
                      {replyingContactId === c.id && (
                        <div className="mt-3 p-3.5 bg-[#141414] border border-[#d4af37]/60 rounded-lg space-y-2">
                          <label className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                            Votre réponse officielle (transmise dans l&apos;espace client) :
                          </label>
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Chère cliente, nous avons bien pris en compte votre demande…"
                            className="w-full p-2.5 bg-[#1b1b1b] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingContactId(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1.5 text-xs text-[#aaa] hover:text-white border border-[#333] rounded cursor-pointer"
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              disabled={isSendingReply}
                              onClick={() => handleSendContactReply(c.id)}
                              className="px-4 py-1.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow"
                            >
                              <Send className="w-3 h-3" />
                              <span>{isSendingReply ? 'Envoi…' : 'Envoyer la réponse'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[#222]">
                        <button
                          type="button"
                          onClick={() => {
                            if (replyingContactId === c.id) {
                              setReplyingContactId(null);
                              setReplyText('');
                            } else {
                              setReplyingContactId(c.id);
                              setReplyText(c.reply || '');
                            }
                          }}
                          className="px-3 py-1 text-xs text-black bg-[#d4af37] hover:bg-[#e8c878] font-semibold rounded flex items-center gap-1 cursor-pointer transition"
                        >
                          <Send className="w-3 h-3" />
                          <span>{c.reply ? 'Modifier la réponse' : 'Répondre au client'}</span>
                        </button>
                        <a
                          href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                          className="px-3 py-1 text-xs text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37]/10 rounded"
                        >
                          Email externe
                        </a>
                        <button
                          onClick={() => {
                            onMarkContactRead(c.id, !c.read);
                            showToast(c.read ? 'Marqué comme non lu' : 'Marqué comme lu');
                            setLocalContacts((prev) =>
                              prev.map((it) => (it.id === c.id ? { ...it, read: !it.read } : it))
                            );
                          }}
                          className="px-3 py-1 text-xs text-[#9a958a] hover:text-white border border-[#333] rounded cursor-pointer"
                        >
                          {c.read ? 'Marquer non lu' : 'Marquer comme lu'}
                        </button>
                        {onDeleteContact && (
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget({
                                type: 'contact',
                                id: c.id,
                                title: `Message de ${c.name}`,
                                subtitle: `${c.email} · Objet: ${c.subject}`,
                              });
                            }}
                            className="px-3 py-1 text-xs text-red-400 hover:text-red-300 border border-red-900/50 hover:bg-red-950/40 rounded flex items-center gap-1 cursor-pointer transition"
                            title="Supprimer ce message"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Supprimer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d4af37]">Configuration</span>
                  <h1 className="text-3xl font-serif text-white mt-1">Paramètres de la Maison</h1>
                  <p className="text-sm text-[#9a958a]">
                    Coordonnées, seuil de livraison offerte et numéro WhatsApp commercial.
                  </p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>

              <div className="p-6 rounded border border-[#2a2a2a] bg-[#121212] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Numéro WhatsApp (avec indicatif sans +)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.waNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, waNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                    <small className="text-[10px] text-[#777]">Exemple: 212600000000</small>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Email Conciergerie
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Téléphone Service Client
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contactPhone}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Horaires d&apos;ouverture
                    </label>
                    <input
                      type="text"
                      value={settingsForm.openingHours}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, openingHours: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Adresse Showroom & Atelier
                  </label>
                  <input
                    type="text"
                    value={settingsForm.showroomAddress}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, showroomAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="border-t border-[#222] pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Seuil Livraison Offerte (DH)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          freeShippingThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Frais de Livraison Standard (DH)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.shippingCost}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, shippingCost: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Frais Contre-Remboursement COD (DH)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.codFee}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, codFee: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="border-t border-[#222] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Code Promo VIP
                    </label>
                    <input
                      type="text"
                      value={settingsForm.promoCode}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          promoCode: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-[#d4af37] font-mono font-bold rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Remise Code Promo (%)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.promoDiscountPct}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          promoDiscountPct: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="border-t border-[#222] pt-4">
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Lien Web QR Code (Factures A4 & Tickets de Caisse 80 mm)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <QrCode className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        placeholder="https://ovelzya.com/verif-joaillerie"
                        value={settingsForm.qrVerificationUrl || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, qrVerificationUrl: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 bg-[#181818] border border-[#333] text-sm text-[#d4af37] font-mono rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#777] mt-1">
                    Ce lien est automatiquement encodé dans le QR code imprimé sur les factures et tickets avec le numéro de commande et les références (SKU) des bijoux.
                  </p>
                </div>
              </div>

              {/* CARD: GESTION DES VERSIONS LINGUISTIQUES (FR / AR / EN) */}
              <div className="p-6 rounded-xl border border-[rgba(212,175,55,0.3)] bg-[#121212] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-serif font-semibold text-white">
                        Versions Linguistiques & Verrouillage de Langue (FR · AR · EN)
                      </h2>
                      <p className="text-xs text-[#9a958a] mt-0.5">
                        Verrouillez le site sur une seule langue exclusive (Anglais, Arabe ou Français) ou activez le mode multilingue avec le sélecteur.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#9a958a] uppercase tracking-wider">Langue par défaut :</span>
                    <select
                      value={settingsForm.languages?.defaultLang || 'fr'}
                      onChange={(e) => handleChangeDefaultLang(e.target.value as Language)}
                      className="px-3 py-1.5 bg-[#181818] border border-[#333] text-xs text-[#d4af37] font-semibold rounded focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value="fr">Français (FR)</option>
                      <option value="ar">العربية (AR)</option>
                      <option value="en">English (EN)</option>
                    </select>
                  </div>
                </div>

                {/* QUICK PRESET BUTTONS: SINGLE LANGUAGE LOCK vs MULTILINGUAL */}
                <div className="p-4 rounded-lg bg-[#181818] border border-[#2c2c2c] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Mode Rapide : Laisser une seule langue ou activer le multilingue
                    </span>
                    <span className="text-[11px] text-[#888]">1 clic pour configurer l&apos;ensemble du site</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetExclusiveLanguage('fr')}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1 ${
                        settingsForm.languages?.enableFr !== false &&
                        settingsForm.languages?.enableAr === false &&
                        settingsForm.languages?.enableEn === false
                          ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37] shadow-sm'
                          : 'border-[#333] bg-[#121212] text-[#ccc] hover:border-[#555] hover:text-white'
                      }`}
                    >
                      <span className="text-base">🇫🇷</span>
                      <span className="font-bold">Français Unique</span>
                      <span className="text-[10px] text-[#888]">100% en Français</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetExclusiveLanguage('ar')}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1 ${
                        settingsForm.languages?.enableAr !== false &&
                        settingsForm.languages?.enableFr === false &&
                        settingsForm.languages?.enableEn === false
                          ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37] shadow-sm'
                          : 'border-[#333] bg-[#121212] text-[#ccc] hover:border-[#555] hover:text-white'
                      }`}
                    >
                      <span className="text-base">🇸🇦</span>
                      <span className="font-bold">العربية فقط</span>
                      <span className="text-[10px] text-[#888]">100% بالعربية RTL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetExclusiveLanguage('en')}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1 ${
                        settingsForm.languages?.enableEn !== false &&
                        settingsForm.languages?.enableFr === false &&
                        settingsForm.languages?.enableAr === false
                          ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37] shadow-sm'
                          : 'border-[#333] bg-[#121212] text-[#ccc] hover:border-[#555] hover:text-white'
                      }`}
                    >
                      <span className="text-base">🇬🇧</span>
                      <span className="font-bold">English Only</span>
                      <span className="text-[10px] text-[#888]">100% in English</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetExclusiveLanguage('all')}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer flex flex-col items-center gap-1 ${
                        settingsForm.languages?.enableFr !== false &&
                        settingsForm.languages?.enableAr !== false &&
                        settingsForm.languages?.enableEn !== false
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                          : 'border-[#333] bg-[#121212] text-[#ccc] hover:border-[#555] hover:text-white'
                      }`}
                    >
                      <span className="text-base">🌐</span>
                      <span className="font-bold">Multilingue (FR+AR+EN)</span>
                      <span className="text-[10px] text-[#888]">Avec sélecteur header</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* FR TOGGLE */}
                  <div
                    className={`p-4 rounded-lg border transition-all ${
                      settingsForm.languages?.enableFr !== false
                        ? 'border-[#d4af37]/50 bg-[#161616]'
                        : 'border-[#262626] bg-[#0d0d0d] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#1e293b] text-[#94a3b8] font-mono text-[10px] font-bold flex items-center justify-center border border-[#334155]">
                          FR
                        </span>
                        <span className="font-semibold text-sm text-white">Français</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleLanguage('enableFr')}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                          settingsForm.languages?.enableFr !== false
                            ? 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                            : 'bg-[#222] text-[#888] hover:text-white'
                        }`}
                      >
                        {settingsForm.languages?.enableFr !== false ? 'Activé' : 'Désactivé'}
                      </button>
                    </div>
                    <p className="text-xs text-[#9a958a]">
                      Version francophone par défaut. Fiches bijoux, devis personnalisés, factures et catalogue.
                    </p>
                  </div>

                  {/* AR TOGGLE */}
                  <div
                    className={`p-4 rounded-lg border transition-all ${
                      settingsForm.languages?.enableAr !== false
                        ? 'border-[#d4af37]/50 bg-[#161616]'
                        : 'border-[#262626] bg-[#0d0d0d] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#14321c] text-[#4ade80] font-mono text-[10px] font-bold flex items-center justify-center border border-[#166534]">
                          AR
                        </span>
                        <span className="font-semibold text-sm text-white">العربية</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleLanguage('enableAr')}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                          settingsForm.languages?.enableAr !== false
                            ? 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                            : 'bg-[#222] text-[#888] hover:text-white'
                        }`}
                      >
                        {settingsForm.languages?.enableAr !== false ? 'Activé' : 'Désactivé'}
                      </button>
                    </div>
                    <p className="text-xs text-[#9a958a]">
                      Version arabe avec direction droite-à-gauche (RTL) et mise en page adaptée pour le marché local et du Golfe.
                    </p>
                  </div>

                  {/* EN TOGGLE */}
                  <div
                    className={`p-4 rounded-lg border transition-all ${
                      settingsForm.languages?.enableEn !== false
                        ? 'border-[#d4af37]/50 bg-[#161616]'
                        : 'border-[#262626] bg-[#0d0d0d] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#312e81] text-[#a5b4fc] font-mono text-[10px] font-bold flex items-center justify-center border border-[#4338ca]">
                          EN
                        </span>
                        <span className="font-semibold text-sm text-white">English</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleLanguage('enableEn')}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                          settingsForm.languages?.enableEn !== false
                            ? 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                            : 'bg-[#222] text-[#888] hover:text-white'
                        }`}
                      >
                        {settingsForm.languages?.enableEn !== false ? 'Activé' : 'Désactivé'}
                      </button>
                    </div>
                    <p className="text-xs text-[#9a958a]">
                      International English edition for high jewelry connoisseurs, international shipping and diaspora clients.
                    </p>
                  </div>
                </div>

                {/* SÉLECTEUR DE LANGUE DANS LE HEADER */}
                <div className="p-3.5 rounded-lg bg-[#161616] border border-[#2a2a2a] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Afficher le sélecteur de langue dans l&apos;en-tête (Header)
                      </span>
                      <p className="text-[11px] text-[#888]">
                        Permet aux visiteurs de basculer instantanément entre les versions activées en haut de chaque page.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleLanguageSwitcher}
                    className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                      settingsForm.languages?.showLanguageSwitcher !== false
                        ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {settingsForm.languages?.showLanguageSwitcher !== false ? 'Affiché' : 'Masqué'}
                  </button>
                </div>
              </div>

              {/* CARD: GESTION DES ICÔNES ET LIENS DES RÉSEAUX SOCIAUX OFFICIELS */}
              <div className="p-6 rounded-xl border border-[rgba(212,175,55,0.4)] bg-[#121212] space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-serif font-semibold text-white">
                        Liens & Réseaux Sociaux Officiels de la Maison
                      </h2>
                      <p className="text-xs text-[#9a958a] mt-0.5">
                        Configurez les adresses (URLs) directes et choisissez les plateformes visibles sur le site et dans le pied de page.
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#333] text-[11px] text-[#d4af37]">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {[
                        settingsForm.socialIcons?.showYouTube !== false,
                        settingsForm.socialIcons?.showInstagram !== false,
                        settingsForm.socialIcons?.showTikTok !== false,
                        settingsForm.socialIcons?.showFacebook !== false,
                        settingsForm.socialIcons?.showWhatsApp !== false,
                        settingsForm.socialIcons?.showPinterest !== false,
                      ].filter(Boolean).length}
                      /6 plateformes actives
                    </span>
                  </div>
                </div>

                {/* GUIDE PRATIQUE / BANNIÈRE EXPLICATIVE */}
                <div className="p-4 rounded-lg bg-[#191610] border border-[#d4af37]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#f5ecd5] block">
                        ✦ Où mettre les liens des réseaux sociaux de la Maison ?
                      </span>
                      <p className="text-[11px] text-[#c4b998] mt-0.5 leading-relaxed">
                        C&apos;est précisément ici ! Renseignez ci-dessous les liens complets de vos pages (ex : <span className="font-mono text-[#d4af37]">https://instagram.com/votrecompte</span>). Ces liens sont instantanément connectés à l&apos;ensemble de la boutique, dans le <strong>Pied de Page (Footer)</strong> et dans la <strong>Vitrine Réseaux Sociaux</strong> de la page d&apos;accueil.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="shrink-0 px-3.5 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Sauvegarder les liens</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* INSTAGRAM */}
                  <div
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      settingsForm.socialIcons?.showInstagram !== false
                        ? 'border-pink-500/40 bg-[#161616]'
                        : 'border-[#262626] bg-[#0e0e0e] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center text-white shrink-0 shadow-xs">
                          <Instagram className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block">Instagram Officiel</span>
                          <span className="text-[10px] text-[#888]">Reels, stories et vitrine joaillière</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSocialIcon('showInstagram')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          settingsForm.socialIcons?.showInstagram !== false
                            ? 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                            : 'bg-[#222] text-[#777] hover:text-white'
                        }`}
                      >
                        {settingsForm.socialIcons?.showInstagram !== false ? 'Actif' : 'Masqué'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block font-mono">
                        Lien URL Instagram
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://www.instagram.com/ovelzya_officiel"
                          value={settingsForm.socialLinks?.instagram || ''}
                          onChange={(e) => handleUpdateSocialLink('instagram', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#101010] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                        {settingsForm.socialLinks?.instagram && (
                          <a
                            href={settingsForm.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-[#222] hover:bg-[#333] text-[#d4af37] rounded text-xs flex items-center gap-1 border border-[#333]"
                            title="Ouvrir le lien dans un nouvel onglet"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Tester</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TIKTOK */}
                  <div
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      settingsForm.socialIcons?.showTikTok !== false
                        ? 'border-cyan-500/40 bg-[#161616]'
                        : 'border-[#262626] bg-[#0e0e0e] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00f2fe] to-[#4facfe] flex items-center justify-center text-black shrink-0 shadow-xs">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block">TikTok Joaillerie</span>
                          <span className="text-[10px] text-[#888]">Vidéos portées et brillance 316L</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSocialIcon('showTikTok')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          settingsForm.socialIcons?.showTikTok !== false
                            ? 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                            : 'bg-[#222] text-[#777] hover:text-white'
                        }`}
                      >
                        {settingsForm.socialIcons?.showTikTok !== false ? 'Actif' : 'Masqué'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block font-mono">
                        Lien URL TikTok
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://www.tiktok.com/@ovelzya_joaillerie"
                          value={settingsForm.socialLinks?.tiktok || ''}
                          onChange={(e) => handleUpdateSocialLink('tiktok', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#101010] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                        {settingsForm.socialLinks?.tiktok && (
                          <a
                            href={settingsForm.socialLinks.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-[#222] hover:bg-[#333] text-[#d4af37] rounded text-xs flex items-center gap-1 border border-[#333]"
                            title="Ouvrir le lien dans un nouvel onglet"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Tester</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* YOUTUBE */}
                  <div
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      settingsForm.socialIcons?.showYouTube !== false
                        ? 'border-red-500/40 bg-[#161616]'
                        : 'border-[#262626] bg-[#0e0e0e] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF0000] to-[#b30000] flex items-center justify-center text-white shrink-0 shadow-xs">
                          <Youtube className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block">YouTube Officiel</span>
                          <span className="text-[10px] text-[#888]">Documentaires ateliers & vidéos HD</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSocialIcon('showYouTube')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          settingsForm.socialIcons?.showYouTube !== false
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-[#222] text-[#777] hover:text-white'
                        }`}
                      >
                        {settingsForm.socialIcons?.showYouTube !== false ? 'Actif' : 'Masqué'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block font-mono">
                        Lien URL Chaîne YouTube
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/@OvelzyaJoaillerie"
                          value={settingsForm.socialLinks?.youtube || ''}
                          onChange={(e) => handleUpdateSocialLink('youtube', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#101010] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                        {settingsForm.socialLinks?.youtube && (
                          <a
                            href={settingsForm.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-[#222] hover:bg-[#333] text-[#d4af37] rounded text-xs flex items-center gap-1 border border-[#333]"
                            title="Ouvrir le lien dans un nouvel onglet"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Tester</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FACEBOOK */}
                  <div
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      settingsForm.socialIcons?.showFacebook !== false
                        ? 'border-blue-500/40 bg-[#161616]'
                        : 'border-[#262626] bg-[#0e0e0e] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1877F2] to-[#0d5ac1] flex items-center justify-center text-white shrink-0 shadow-xs">
                          <Facebook className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block">Facebook Page Officielle</span>
                          <span className="text-[10px] text-[#888]">Communauté et actualités de la Maison</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSocialIcon('showFacebook')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          settingsForm.socialIcons?.showFacebook !== false
                            ? 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                            : 'bg-[#222] text-[#777] hover:text-white'
                        }`}
                      >
                        {settingsForm.socialIcons?.showFacebook !== false ? 'Actif' : 'Masqué'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block font-mono">
                        Lien URL Page Facebook
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://www.facebook.com/ovelzya"
                          value={settingsForm.socialLinks?.facebook || ''}
                          onChange={(e) => handleUpdateSocialLink('facebook', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#101010] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                        {settingsForm.socialLinks?.facebook && (
                          <a
                            href={settingsForm.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-[#222] hover:bg-[#333] text-[#d4af37] rounded text-xs flex items-center gap-1 border border-[#333]"
                            title="Ouvrir le lien dans un nouvel onglet"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Tester</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* WHATSAPP VIP CONCIERGERIE */}
                  <div
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      settingsForm.socialIcons?.showWhatsApp !== false
                        ? 'border-emerald-500/40 bg-[#161616]'
                        : 'border-[#262626] bg-[#0e0e0e] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shrink-0 shadow-xs">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block">WhatsApp Conciergerie VIP</span>
                          <span className="text-[10px] text-[#888]">Assistance personnalisée 7j/7</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSocialIcon('showWhatsApp')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          settingsForm.socialIcons?.showWhatsApp !== false
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-[#222] text-[#777] hover:text-white'
                        }`}
                      >
                        {settingsForm.socialIcons?.showWhatsApp !== false ? 'Actif' : 'Masqué'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block font-mono">
                        Lien WhatsApp Direct (https://wa.me/...)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://wa.me/212620000000"
                          value={settingsForm.socialLinks?.whatsapp || ''}
                          onChange={(e) => handleUpdateSocialLink('whatsapp', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#101010] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                        {settingsForm.socialLinks?.whatsapp && (
                          <a
                            href={settingsForm.socialLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-[#222] hover:bg-[#333] text-emerald-400 rounded text-xs flex items-center gap-1 border border-[#333]"
                            title="Ouvrir la conversation WhatsApp"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Tester</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PINTEREST */}
                  <div
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      settingsForm.socialIcons?.showPinterest !== false
                        ? 'border-rose-500/40 bg-[#161616]'
                        : 'border-[#262626] bg-[#0e0e0e] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#BD081C] to-[#800512] flex items-center justify-center text-white shrink-0 shadow-xs">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-white block">Pinterest Joaillerie</span>
                          <span className="text-[10px] text-[#888]">Moodboards d&apos;inspiration et parures</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSocialIcon('showPinterest')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          settingsForm.socialIcons?.showPinterest !== false
                            ? 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                            : 'bg-[#222] text-[#777] hover:text-white'
                        }`}
                      >
                        {settingsForm.socialIcons?.showPinterest !== false ? 'Actif' : 'Masqué'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block font-mono">
                        Lien URL Profil Pinterest
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://www.pinterest.com/ovelzya"
                          value={settingsForm.socialLinks?.pinterest || ''}
                          onChange={(e) => handleUpdateSocialLink('pinterest', e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#101010] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                        />
                        {settingsForm.socialLinks?.pinterest && (
                          <a
                            href={settingsForm.socialLinks.pinterest}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-[#222] hover:bg-[#333] text-[#d4af37] rounded text-xs flex items-center gap-1 border border-[#333]"
                            title="Ouvrir le lien dans un nouvel onglet"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Tester</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOOSTER DE VENTES SHORTCUT BANNER IN SETTINGS */}
              <div className="p-6 rounded-xl border border-amber-500/30 bg-gradient-to-r from-[#18150f] to-[#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-semibold text-white">
                      Booster de Ventes & Leviers de Conversion
                    </h2>
                    <p className="text-xs text-[#9a958a] mt-0.5">
                      WhatsApp direct, preuve sociale, jauge port offert, alertes stock, coffret cadeau... ({activeBoostersCount}/7 activés)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('boosters')}
                  className="px-4 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shrink-0 flex items-center gap-2 shadow-md shadow-black/40"
                >
                  <span>Gérer les 7 leviers</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* WARRANTY CERTIFICATE TEXT CUSTOMIZATION */}
              <div className="p-6 rounded border border-[rgba(212,175,55,0.35)] bg-[#141414] space-y-4">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                    <div>
                      <h2 className="text-base font-serif font-semibold text-white">
                        Textes &amp; Clauses du Certificat de Garantie Officiel
                      </h2>
                      <p className="text-xs text-[#9a958a]">
                        Personnalisez le titre, les engagements de pureté, la durée et les 4 clauses techniques de garantie imprimées sur chaque certificat A4 et PDF.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsForm((prev: any) => ({
                        ...prev,
                        warranty: DEFAULT_WARRANTY_SETTINGS,
                      }));
                      showToast('Clauses réinitialisées aux valeurs par défaut');
                    }}
                    className="px-3 py-1.5 text-xs text-[#888] hover:text-white border border-[#333] hover:border-[#555] rounded flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Valeurs par défaut</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Titre du Certificat
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.certificateTitle || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, certificateTitle: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Sous-titre / Attestation Officielle
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.certificateSubtitle || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, certificateSubtitle: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Durée &amp; Validité (ex: 10 Ans, À vie)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.validityDuration || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, validityDuration: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-[#d4af37] font-semibold rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Mention Métallurgie &amp; Or
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.goldPurityText || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, goldPurityText: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-[#d4af37] font-semibold rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4 Clauses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-[#181818] border border-[#2a2a2a] rounded space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                      Clause 1 (Étanchéité / Immersion)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.clauseWaterproofTitle || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, clauseWaterproofTitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-xs text-white rounded font-medium focus:border-[#d4af37] focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={settingsForm.warranty?.clauseWaterproofText || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, clauseWaterproofText: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-xs text-[#bbb] rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-[#181818] border border-[#2a2a2a] rounded space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                      Clause 2 (Anti-Ternissement)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.clauseTarnishTitle || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, clauseTarnishTitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-xs text-white rounded font-medium focus:border-[#d4af37] focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={settingsForm.warranty?.clauseTarnishText || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, clauseTarnishText: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-xs text-[#bbb] rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-[#181818] border border-[#2a2a2a] rounded space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                      Clause 3 (Hypoallergénique &amp; Normes)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.clauseHypoTitle || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, clauseHypoTitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-xs text-white rounded font-medium focus:border-[#d4af37] focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={settingsForm.warranty?.clauseHypoText || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, clauseHypoText: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-xs text-[#bbb] rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-[#181818] border border-[#2a2a2a] rounded space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                      Clause 4 (Atelier &amp; Entretien)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.clausePolishTitle || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, clausePolishTitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-xs text-white rounded font-medium focus:border-[#d4af37] focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={settingsForm.warranty?.clausePolishText || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, clausePolishText: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-xs text-[#bbb] rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Nom du Signataire
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.signatoryName || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, signatoryName: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      Titre &amp; Fonction du Signataire
                    </label>
                    <input
                      type="text"
                      value={settingsForm.warranty?.signatoryTitle || ''}
                      onChange={(e) =>
                        setSettingsForm((prev: any) => ({
                          ...prev,
                          warranty: { ...prev.warranty, signatoryTitle: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Mention Légale Infalsifiable (Bas de page)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.warranty?.customLegalNotice || ''}
                    onChange={(e) =>
                      setSettingsForm((prev: any) => ({
                        ...prev,
                        warranty: { ...prev.warranty, customLegalNotice: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* SECURITY / PASSWORD CHANGE CARD */}
              <div className="p-6 rounded border border-[rgba(212,175,55,0.3)] bg-[#121212] space-y-4">
                <div className="flex items-center gap-2 border-b border-[#222] pb-3">
                  <Key className="w-5 h-5 text-[#d4af37]" />
                  <div>
                    <h2 className="text-base font-serif font-semibold text-white">
                      {currentUser?.role === 'commercial'
                        ? 'Sécurité · Mon Mot de passe Commercial'
                        : 'Sécurité · Mot de passe Administrateur'}
                    </h2>
                    <p className="text-xs text-[#9a958a]">
                      {currentUser?.role === 'commercial'
                        ? 'Modifiez votre mot de passe personnel de commercial'
                        : "Modifiez le mot de passe d'accès au panneau d'administration"}
                    </p>
                  </div>
                </div>

                {currentUser?.role === 'commercial' && (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded text-xs text-amber-300 flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Droits restreints :</strong> Les comptes commerciaux n&apos;ont pas l&apos;autorisation d&apos;accéder ou de modifier le mot de passe de l&apos;administrateur principal. Vous pouvez uniquement modifier votre propre mot de passe de connexion ci-dessous.
                    </span>
                  </div>
                )}

                <form onSubmit={handleChangeAdminPassword} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={adminPasswordForm.currentPassword}
                        onChange={(e) =>
                          setAdminPasswordForm({ ...adminPasswordForm, currentPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Au moins 6 caractères"
                        value={adminPasswordForm.newPassword}
                        onChange={(e) =>
                          setAdminPasswordForm({ ...adminPasswordForm, newPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Répétez le mot de passe"
                        value={adminPasswordForm.confirmPassword}
                        onChange={(e) =>
                          setAdminPasswordForm({ ...adminPasswordForm, confirmPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-[#777]">
                      Compte connecté :{' '}
                      <span className="text-[#d4af37] font-mono">
                        {currentUser?.email || (currentUser?.role === 'commercial' ? 'commercial' : 'admin@ovelzya.com')}
                      </span>{' '}
                      <span className="capitalize text-[#aaa]">({currentUser?.role || 'admin'})</span>
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmittingPassword}
                      className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingPassword ? 'Modification...' : 'Mettre à jour mon mot de passe'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB: SALES BOOSTERS & CONVERSION LEVERS */}
          {activeTab === 'boosters' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                      CRO & Optimisation des Ventes
                    </span>
                    <span className="text-xs text-[#9a958a]">
                      {activeBoostersCount} sur 7 leviers activés
                    </span>
                  </div>
                  <h1 className="text-3xl font-serif text-white mt-1.5 flex items-center gap-2.5">
                    <Rocket className="w-7 h-7 text-[#d4af37]" />
                    <span>Booster de Ventes & Leviers d&apos;Achat</span>
                  </h1>
                  <p className="text-sm text-[#9a958a] mt-1 max-w-2xl">
                    Activez et paramétrez en un clic les fonctionnalités créées pour inciter à l&apos;action, rassurer vos clientes et maximiser votre panier moyen.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggleAllBoosters(true)}
                    className="px-3.5 py-2 rounded bg-[#1f1f1f] hover:bg-[#282828] text-xs text-[#cfcbc2] border border-[#333] transition cursor-pointer"
                  >
                    Tout activer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAllBoosters(false)}
                    className="px-3.5 py-2 rounded bg-[#1f1f1f] hover:bg-[#282828] text-xs text-[#888] border border-[#333] transition cursor-pointer"
                  >
                    Tout désactiver
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBoosters}
                    disabled={isSavingBoosters}
                    className="px-5 py-2 rounded bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#d4af37]/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingBoosters ? 'Enregistrement...' : 'Enregistrer les leviers'}</span>
                  </button>
                </div>
              </div>

              {/* SUB-TABS: Cross-sell & Upsell vs Standards Levers */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#262626] pb-3">
                <button
                  type="button"
                  onClick={() => setBoosterSubTab('cross_upsell')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
                    boosterSubTab === 'cross_upsell'
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                      : 'bg-[#181818] text-[#cfcbc2] hover:bg-[#222] border border-[#333]'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>🎯 Cross-Sell & Upsell Personnalisés (SKU & Réductions)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${boosterSubTab === 'cross_upsell' ? 'bg-black/30 text-black' : 'bg-[#2a2a2a] text-[#d4af37]'}`}>
                    {(currentBoosters.promotionRules || []).length} offres
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setBoosterSubTab('levers')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
                    boosterSubTab === 'levers'
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                      : 'bg-[#181818] text-[#cfcbc2] hover:bg-[#222] border border-[#333]'
                  }`}
                >
                  <Rocket className="w-4 h-4" />
                  <span>⚡ Leviers de Conversion Standards (7 Leviers)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${boosterSubTab === 'levers' ? 'bg-black/30 text-black' : 'bg-[#2a2a2a] text-emerald-400'}`}>
                    {activeBoostersCount}/7 actifs
                  </span>
                </button>
              </div>

              {boosterSubTab === 'cross_upsell' ? (
                <CrossSellUpsellManager
                  products={products}
                  rules={currentBoosters.promotionRules || []}
                  onSaveRules={handleSavePromotionRules}
                  enableCrossSell={currentBoosters.enableCrossSell ?? true}
                  enableUpsell={currentBoosters.enableUpsell ?? true}
                  onToggleEnableCrossSell={handleToggleEnableCrossSell}
                  onToggleEnableUpsell={handleToggleEnableUpsell}
                />
              ) : (
                <>
                  {/* Quick metrics summary strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121212] border border-[#262626] rounded-lg p-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#888] block">Statut Global</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-serif font-bold text-white">
                      {activeBoostersCount} / 7
                    </span>
                    <span className={`w-3 h-3 rounded-full ${activeBoostersCount > 0 ? 'bg-emerald-400' : 'bg-red-500'}`} />
                  </div>
                  <span className="text-xs text-[#9a958a] block mt-1">
                    {activeBoostersCount === 7 ? '✦ Performance maximale active' : `${7 - activeBoostersCount} levier(s) en veille`}
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#262626] rounded-lg p-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#888] block">Ventes WhatsApp</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-serif font-semibold text-emerald-400">
                      {currentBoosters.enableWhatsAppOrder ? 'Actif sur Fiches' : 'Désactivé'}
                    </span>
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs text-[#9a958a] block mt-1">
                    Commande 1 clic sans formulaire
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#262626] rounded-lg p-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#888] block">Livraison Offerte</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-serif font-semibold text-[#d4af37]">
                      {currentBoosters.enableFreeShippingBar ? `${settingsForm.freeShippingThreshold} DH` : 'Désactivée'}
                    </span>
                    <Truck className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <span className="text-xs text-[#9a958a] block mt-1">
                    Jauge progressive dans le panier
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#262626] rounded-lg p-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#888] block">Offre Privilège Exit</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-serif font-semibold text-purple-400">
                      {currentBoosters.enableExitIntentPopup ? `−${currentBoosters.exitIntentDiscountPct}%` : 'Désactivée'}
                    </span>
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-xs text-[#9a958a] block mt-1">
                    Code : {currentBoosters.exitIntentPromoCode || 'BIENVENUE10'}
                  </span>
                </div>
              </div>

              {/* Interactive simulated test toast inside admin */}
              {testNotificationToast && (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Simulation Preuve Sociale :</p>
                      <p className="text-xs text-emerald-300">{testNotificationToast}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTestNotificationToast(null)}
                    className="text-xs text-[#888] hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* The 7 Detailed Boosters Cards */}
              <div className="space-y-4">
                {/* 1. WHATSAPP DIRECT ORDER */}
                <div className={`p-6 rounded-xl border transition duration-200 ${
                  currentBoosters.enableWhatsAppOrder
                    ? 'bg-[#141414] border-emerald-900/50 shadow-lg shadow-emerald-950/10'
                    : 'bg-[#111111] border-[#222] opacity-75'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-serif font-semibold text-white">
                            1. Commande Directe via WhatsApp sur Fiche Produit
                          </h2>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold">
                            Fiche Bijou · Fort Impact
                          </span>
                        </div>
                        <p className="text-xs text-[#9a958a] mt-1 max-w-2xl leading-relaxed">
                          Affiche un bouton vert WhatsApp sous le bouton d&apos;ajout au panier. La cliente clique et engage directement une conversation avec un message pré-rédigé contenant la photo, le titre, la référence SKU et le tarif du bijou. Idéal pour le marché marocain où beaucoup de clientes préfèrent finaliser par messagerie.
                        </p>
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleBooster('enableWhatsAppOrder')}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentBoosters.enableWhatsAppOrder ? 'bg-emerald-500' : 'bg-[#333]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentBoosters.enableWhatsAppOrder ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {currentBoosters.enableWhatsAppOrder && (
                    <div className="mt-5 pt-4 border-t border-[#262626] grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Texte affiché sur le bouton
                        </label>
                        <input
                          type="text"
                          value={currentBoosters.whatsAppButtonText || ''}
                          onChange={(e) =>
                            handleUpdateBoosterField('whatsAppButtonText', e.target.value)
                          }
                          placeholder="Commander directement via WhatsApp"
                          className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] text-sm text-white rounded focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Numéro WhatsApp commercial
                        </label>
                        <input
                          type="text"
                          value={settingsForm.waNumber || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, waNumber: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] text-sm text-emerald-400 font-mono rounded focus:border-emerald-500 focus:outline-none"
                        />
                        <span className="text-[10px] text-[#777] mt-1 block">
                          Format international sans le + (ex: 212600000000)
                        </span>
                      </div>

                      {/* Live preview */}
                      <div className="md:col-span-2 p-3 bg-[#0a0a0a] rounded-lg border border-[#222]">
                        <span className="text-[10px] uppercase tracking-wider text-[#666] block mb-2">Aperçu en direct sur le site</span>
                        <div className="w-full max-w-md py-3 px-4 rounded bg-[#25D366]/15 border border-[#25D366]/50 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          <span>{currentBoosters.whatsAppButtonText || 'Commander directement via WhatsApp'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. FREE SHIPPING PROGRESS BAR */}
                <div className={`p-6 rounded-xl border transition duration-200 ${
                  currentBoosters.enableFreeShippingBar
                    ? 'bg-[#141414] border-[#d4af37]/35 shadow-lg shadow-black/20'
                    : 'bg-[#111111] border-[#222] opacity-75'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-serif font-semibold text-white">
                            2. Jauge Progressive de Livraison Gratuite
                          </h2>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#d4af37]/15 text-[#d4af37] font-semibold">
                            Panier · Augmente le Panier Moyen
                          </span>
                        </div>
                        <p className="text-xs text-[#9a958a] mt-1 max-w-2xl leading-relaxed">
                          Affiche dans le tiroir du panier une barre dorée qui calcule en temps réel la somme manquante pour débloquer les frais de port offerts (ex: « Plus que 120 DH pour la livraison offerte ! »). Pousse les clientes à ajouter un deuxième ou troisième bijou.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBooster('enableFreeShippingBar')}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentBoosters.enableFreeShippingBar ? 'bg-[#d4af37]' : 'bg-[#333]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentBoosters.enableFreeShippingBar ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
                        }`}
                      />
                    </button>
                  </div>

                  {currentBoosters.enableFreeShippingBar && (
                    <div className="mt-5 pt-4 border-t border-[#262626] space-y-4 animate-fade-in">
                      <div className="max-w-xs">
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Seuil d&apos;achat pour livraison offerte (DH)
                        </label>
                        <input
                          type="number"
                          value={settingsForm.freeShippingThreshold}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              freeShippingThreshold: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] text-sm text-[#d4af37] font-mono font-bold rounded focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>

                      {/* Live preview */}
                      <div className="p-3 bg-[#0a0a0a] rounded-lg border border-[#222]">
                        <span className="text-[10px] uppercase tracking-wider text-[#666] block mb-2">Aperçu en direct dans le panier</span>
                        <div className="bg-[#151515] p-3 rounded border border-[#222] text-xs">
                          <span className="text-[#9a958a]">
                            Encore <b className="text-[#d4af37] font-semibold">180 DH</b> pour bénéficier de la livraison offerte !
                          </span>
                          <div className="w-full bg-[#252525] h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] h-full w-[65%] rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. SOCIAL PROOF LIVE NOTIFICATIONS */}
                <div className={`p-6 rounded-xl border transition duration-200 ${
                  currentBoosters.enableSocialProof
                    ? 'bg-[#141414] border-blue-900/50 shadow-lg shadow-black/20'
                    : 'bg-[#111111] border-[#222] opacity-75'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-serif font-semibold text-white">
                            3. Preuve Sociale en Temps Réel (Social Proof Toasts)
                          </h2>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-semibold">
                            Global · Réassurance & Effet de meute
                          </span>
                        </div>
                        <p className="text-xs text-[#9a958a] mt-1 max-w-2xl leading-relaxed">
                          Fait apparaître périodiquement en bas de l&apos;écran une notification discrète indiquant un achat récent (ex: « Sarah de Casablanca vient de commander le Collier Astral »). Rassure instantanément les nouveaux visiteurs sur la popularité de votre boutique.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBooster('enableSocialProof')}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentBoosters.enableSocialProof ? 'bg-blue-500' : 'bg-[#333]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentBoosters.enableSocialProof ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {currentBoosters.enableSocialProof && (
                    <div className="mt-5 pt-4 border-t border-[#262626] space-y-4 animate-fade-in">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                            Intervalle d&apos;affichage (secondes)
                          </label>
                          <input
                            type="number"
                            min={5}
                            max={60}
                            value={currentBoosters.socialProofIntervalSec || 15}
                            onChange={(e) =>
                              handleUpdateBoosterField('socialProofIntervalSec', Number(e.target.value))
                            }
                            className="w-32 px-3 py-2 bg-[#1c1c1c] border border-[#333] text-sm text-white font-mono rounded focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="pt-5">
                          <button
                            type="button"
                            onClick={() => {
                              const sampleProd = products[0] || { name: 'Collier Chaîne Perlée 18K', price: 420 };
                              setTestNotificationToast(`Sarah de Casablanca (Anfa) a commandé : ${sampleProd.name} (420 DH) il y a 3 min`);
                              showToast('Simulation de notification déclenchée');
                            }}
                            className="px-4 py-2 bg-[#222] hover:bg-[#2c2c2c] border border-[#3a3a3a] text-xs text-[#cfcbc2] rounded transition cursor-pointer flex items-center gap-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                            <span>Tester une notification d&apos;achat</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. URGENCY BADGES & LIVE VIEWERS */}
                <div className={`p-6 rounded-xl border transition duration-200 ${
                  currentBoosters.enableUrgencyBadges
                    ? 'bg-[#141414] border-amber-900/50 shadow-lg shadow-black/20'
                    : 'bg-[#111111] border-[#222] opacity-75'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-serif font-semibold text-white">
                            4. Alertes Stock Limité & Visiteurs en Direct
                          </h2>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold">
                            Fiche Bijou · Sentiment d&apos;Urgence
                          </span>
                        </div>
                        <p className="text-xs text-[#9a958a] mt-1 max-w-2xl leading-relaxed">
                          Affiche sur la page du bijou un badge rouge « Plus que X pièces disponibles en atelier » quand le stock est bas, ainsi qu&apos;un indicateur en temps réel du nombre de personnes consultant la pièce (ex: « 14 personnes consultent cette création »).
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBooster('enableUrgencyBadges')}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentBoosters.enableUrgencyBadges ? 'bg-amber-500' : 'bg-[#333]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentBoosters.enableUrgencyBadges ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {currentBoosters.enableUrgencyBadges && (
                    <div className="mt-5 pt-4 border-t border-[#262626] space-y-4 animate-fade-in">
                      <div className="max-w-xs">
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Seuil critique de stock (unités)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={currentBoosters.stockUrgencyThreshold || 5}
                          onChange={(e) =>
                            handleUpdateBoosterField('stockUrgencyThreshold', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] text-sm text-white font-mono rounded focus:border-amber-500 focus:outline-none"
                        />
                        <span className="text-[10px] text-[#777] mt-1 block">
                          L&apos;alerte rouge s&apos;affiche dès que le stock est inférieur ou égal à ce nombre.
                        </span>
                      </div>

                      {/* Live preview */}
                      <div className="p-3 bg-[#0a0a0a] rounded-lg border border-[#222]">
                        <span className="text-[10px] uppercase tracking-wider text-[#666] block mb-2">Aperçu des badges sur la fiche bijou</span>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/40 border border-red-800/40 text-red-300 font-medium">
                            <Flame className="w-3.5 h-3.5 text-red-400" />
                            <span>Plus que 3 exemplaires disponibles en atelier</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 font-medium">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span>12 personnes consultent ce bijou en ce moment</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. GIFT PACKAGING OPTION */}
                <div className={`p-6 rounded-xl border transition duration-200 ${
                  currentBoosters.enableGiftOption
                    ? 'bg-[#141414] border-purple-900/50 shadow-lg shadow-black/20'
                    : 'bg-[#111111] border-[#222] opacity-75'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-serif font-semibold text-white">
                            5. Option « Écrin Cadeau Joaillerie & Mot Personnalisé »
                          </h2>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-semibold">
                            Panier & Commande · Upsell Additionnel
                          </span>
                        </div>
                        <p className="text-xs text-[#9a958a] mt-1 max-w-2xl leading-relaxed">
                          Permet à la cliente de cocher une option d&apos;écrin de présentation haute joaillerie avec ruban satin et carte manuscrite cachetée à la cire pour un cadeau inoubliable. Génère un revenu additionnel direct sur chaque commande.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBooster('enableGiftOption')}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentBoosters.enableGiftOption ? 'bg-purple-500' : 'bg-[#333]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentBoosters.enableGiftOption ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {currentBoosters.enableGiftOption && (
                    <div className="mt-5 pt-4 border-t border-[#262626] space-y-4 animate-fade-in">
                      <div className="max-w-xs">
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Tarif de l&apos;option écrin cadeau (DH)
                        </label>
                        <input
                          type="number"
                          value={currentBoosters.giftOptionPrice !== undefined ? currentBoosters.giftOptionPrice : 35}
                          onChange={(e) =>
                            handleUpdateBoosterField('giftOptionPrice', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] text-sm text-purple-400 font-mono font-bold rounded focus:border-purple-500 focus:outline-none"
                        />
                        <span className="text-[10px] text-[#777] mt-1 block">
                          Mettre 0 si vous préférez l&apos;offrir gracieusement comme levier commercial.
                        </span>
                      </div>

                      {/* Live preview */}
                      <div className="p-3 bg-[#0a0a0a] rounded-lg border border-[#222]">
                        <span className="text-[10px] uppercase tracking-wider text-[#666] block mb-2">Aperçu de la case dans le panier</span>
                        <div className="p-3 bg-[#161616] border border-[#333] rounded-lg text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked readOnly className="accent-[#d4af37]" />
                            <span className="text-white font-semibold">
                              Écrin Cadeau Joaillerie & Ruban Satin (+{currentBoosters.giftOptionPrice || 35} DH)
                            </span>
                          </div>
                          <span className="text-[10px] text-purple-300 font-mono">Option cochable</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. COD REASSURANCE BADGE */}
                <div className={`p-6 rounded-xl border transition duration-200 ${
                  currentBoosters.enableCodReassurance
                    ? 'bg-[#141414] border-emerald-900/50 shadow-lg shadow-black/20'
                    : 'bg-[#111111] border-[#222] opacity-75'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-serif font-semibold text-white">
                            6. Garantie & Contrôle du Bijou à la Livraison
                          </h2>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold">
                            Fiche Bijou & Checkout · Zéro Risque
                          </span>
                        </div>
                        <p className="text-xs text-[#9a958a] mt-1 max-w-2xl leading-relaxed">
                          Lève le frein numéro 1 à l&apos;achat en ligne au Maroc : affiche la garantie que la cliente peut ouvrir son colis et inspecter le bijou en direct avec le livreur avant de régler en espèces.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBooster('enableCodReassurance')}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentBoosters.enableCodReassurance ? 'bg-emerald-500' : 'bg-[#333]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentBoosters.enableCodReassurance ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {currentBoosters.enableCodReassurance && (
                    <div className="mt-5 pt-4 border-t border-[#262626] animate-fade-in">
                      <div className="p-3 bg-[#0a0a0a] rounded-lg border border-[#222]">
                        <span className="text-[10px] uppercase tracking-wider text-[#666] block mb-2">Aperçu du badge affiché sur la boutique</span>
                        <div className="flex items-center gap-3 p-3 rounded bg-[#161616] border border-[#262626] text-xs text-[#cfcbc2]">
                          <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0" />
                          <div>
                            <span className="font-semibold text-white block">Contrôle à la livraison offert</span>
                            <span className="text-[11px] text-[#9a958a]">
                              Ouvrez votre écrin et vérifiez la conformité du bijou avant de régler en espèces au livreur.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. EXIT-INTENT PROMO POPUP */}
                <div className={`p-6 rounded-xl border transition duration-200 ${
                  currentBoosters.enableExitIntentPopup
                    ? 'bg-[#141414] border-purple-900/50 shadow-lg shadow-black/20'
                    : 'bg-[#111111] border-[#222] opacity-75'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-serif font-semibold text-white">
                            7. Pop-up Rétention / Offre Privilège (Exit-Intent)
                          </h2>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-semibold">
                            Rétention · Sauve les Visiteurs Hésitants
                          </span>
                        </div>
                        <p className="text-xs text-[#9a958a] mt-1 max-w-2xl leading-relaxed">
                          Détecte lorsque la souris de l&apos;utilisateur quitte l&apos;écran vers le haut (pour fermer l&apos;onglet) et ouvre un pop-up luxueux avec une remise immédiate à copier en 1 clic pour finaliser la commande.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBooster('enableExitIntentPopup')}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentBoosters.enableExitIntentPopup ? 'bg-purple-500' : 'bg-[#333]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentBoosters.enableExitIntentPopup ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {currentBoosters.enableExitIntentPopup && (
                    <div className="mt-5 pt-4 border-t border-[#262626] space-y-4 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                            Pourcentage de Remise (%)
                          </label>
                          <input
                            type="number"
                            min={5}
                            max={50}
                            value={currentBoosters.exitIntentDiscountPct || 10}
                            onChange={(e) =>
                              handleUpdateBoosterField('exitIntentDiscountPct', Number(e.target.value))
                            }
                            className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] text-sm text-white font-mono rounded focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                            Code Promo à Révéler
                          </label>
                          <input
                            type="text"
                            value={currentBoosters.exitIntentPromoCode || 'BIENVENUE10'}
                            onChange={(e) =>
                              handleUpdateBoosterField('exitIntentPromoCode', e.target.value.toUpperCase())
                            }
                            className="w-full px-3 py-2 bg-[#1c1c1c] border border-[#333] text-sm text-[#d4af37] font-mono font-bold rounded focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setPreviewExitIntent(true)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-900/60 to-purple-800/40 hover:from-purple-800/80 hover:to-purple-700/60 border border-purple-500/40 text-purple-200 text-xs font-semibold rounded transition cursor-pointer flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Prévisualiser le Pop-up en direct</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                  {/* Bottom Save Bar */}
                  <div className="flex items-center justify-between p-4 bg-[#121212] border border-[#262626] rounded-xl">
                    <span className="text-xs text-[#9a958a]">
                      Les modifications sont enregistrées dans la configuration globale de la boutique.
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveBoosters}
                      disabled={isSavingBoosters}
                      className="px-6 py-2.5 rounded bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#d4af37]/20 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingBoosters ? 'Enregistrement...' : 'Enregistrer tous les leviers'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PREVIEW EXIT INTENT POPUP (ADMIN PREVIEW) */}
          {previewExitIntent && (
            <ExitIntentModal
              isOpenManually={true}
              promoCode={currentBoosters.exitIntentPromoCode || 'BIENVENUE10'}
              discountPct={currentBoosters.exitIntentDiscountPct || 10}
              lang="fr"
              onApplyCode={(code) => {
                showToast(`Code ${code} appliqué pour le test !`);
                setPreviewExitIntent(false);
              }}
              onClose={() => setPreviewExitIntent(false)}
            />
          )}

          {/* TAB: TEAM & COMMERCIAL RIGHTS MANAGEMENT */}
          {activeTab === 'team' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-emerald-400">Collaborateurs</span>
                  <h1 className="text-3xl font-serif text-white mt-1">Équipe Commerciale & Droits</h1>
                  <p className="text-sm text-[#9a958a]">
                    Créez des comptes pour vos commerciaux et configurez précisément leurs droits d&apos;accès.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingCommercial(!isCreatingCommercial)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isCreatingCommercial ? 'Fermer le formulaire' : 'Créer un Commercial'}</span>
                </button>
              </div>

              {/* FORM: CREATE COMMERCIAL */}
              {isCreatingCommercial && (
                <div className="p-6 rounded-lg border border-[#d4af37]/40 bg-[#121212] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-base font-serif font-bold text-white">Nouveau Compte Commercial</h2>
                    </div>
                    <span className="text-xs text-[#9a958a]">Attribution des permissions directes</span>
                  </div>

                  <form onSubmit={handleCreateCommercial} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Karim Bennani"
                          value={newCommercialForm.name}
                          onChange={(e) =>
                            setNewCommercialForm({ ...newCommercialForm, name: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Email professionnel *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="karim@ovelzya.com"
                          value={newCommercialForm.email}
                          onChange={(e) =>
                            setNewCommercialForm({ ...newCommercialForm, email: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Mot de passe initial *
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Min 6 caractères"
                          value={newCommercialForm.password}
                          onChange={(e) =>
                            setNewCommercialForm({ ...newCommercialForm, password: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Téléphone WhatsApp
                        </label>
                        <input
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={newCommercialForm.phone}
                          onChange={(e) =>
                            setNewCommercialForm({ ...newCommercialForm, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                          Ville d&apos;affectation
                        </label>
                        <input
                          type="text"
                          value={newCommercialForm.city}
                          onChange={(e) =>
                            setNewCommercialForm({ ...newCommercialForm, city: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#181818] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* PERMISSIONS CHECKBOXES */}
                    <div className="border-t border-[#262626] pt-4">
                      <label className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold block mb-3">
                        Droits & Permissions accordés à ce commercial :
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <label className="flex items-start gap-2.5 p-3 rounded bg-[#161616] border border-[#2a2a2a] cursor-pointer hover:border-[#d4af37]/40 transition">
                          <input
                            type="checkbox"
                            checked={newCommercialForm.permissions.canManageOrders}
                            onChange={(e) =>
                              setNewCommercialForm({
                                ...newCommercialForm,
                                permissions: {
                                  ...newCommercialForm.permissions,
                                  canManageOrders: e.target.checked,
                                },
                              })
                            }
                            className="mt-0.5 accent-[#d4af37]"
                          />
                          <div>
                            <span className="text-xs font-medium text-white block">Gérer les Commandes</span>
                            <span className="text-[11px] text-[#888]">Suivre, valider et expédier les commandes</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded bg-[#161616] border border-[#2a2a2a] cursor-pointer hover:border-[#d4af37]/40 transition">
                          <input
                            type="checkbox"
                            checked={newCommercialForm.permissions.canManageProducts}
                            onChange={(e) =>
                              setNewCommercialForm({
                                ...newCommercialForm,
                                permissions: {
                                  ...newCommercialForm.permissions,
                                  canManageProducts: e.target.checked,
                                },
                              })
                            }
                            className="mt-0.5 accent-[#d4af37]"
                          />
                          <div>
                            <span className="text-xs font-medium text-white block">Catalogue & Stocks</span>
                            <span className="text-[11px] text-[#888]">Ajouter et modifier les bijoux et quantités</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded bg-[#161616] border border-[#2a2a2a] cursor-pointer hover:border-[#d4af37]/40 transition">
                          <input
                            type="checkbox"
                            checked={newCommercialForm.permissions.canPrintInvoices}
                            onChange={(e) =>
                              setNewCommercialForm({
                                ...newCommercialForm,
                                permissions: {
                                  ...newCommercialForm.permissions,
                                  canPrintInvoices: e.target.checked,
                                },
                              })
                            }
                            className="mt-0.5 accent-[#d4af37]"
                          />
                          <div>
                            <span className="text-xs font-medium text-white block">Imprimer Factures A4</span>
                            <span className="text-[11px] text-[#888]">Imprimante 1 - Facture officielle</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded bg-[#161616] border border-[#2a2a2a] cursor-pointer hover:border-[#d4af37]/40 transition">
                          <input
                            type="checkbox"
                            checked={newCommercialForm.permissions.canPrintTickets}
                            onChange={(e) =>
                              setNewCommercialForm({
                                ...newCommercialForm,
                                permissions: {
                                  ...newCommercialForm.permissions,
                                  canPrintTickets: e.target.checked,
                                },
                              })
                            }
                            className="mt-0.5 accent-[#d4af37]"
                          />
                          <div>
                            <span className="text-xs font-medium text-white block">Imprimer Tickets 80mm</span>
                            <span className="text-[11px] text-[#888]">Imprimante 2 - Ticket de caisse thermique</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded bg-[#161616] border border-[#2a2a2a] cursor-pointer hover:border-[#d4af37]/40 transition">
                          <input
                            type="checkbox"
                            checked={newCommercialForm.permissions.canManageClients}
                            onChange={(e) =>
                              setNewCommercialForm({
                                ...newCommercialForm,
                                permissions: {
                                  ...newCommercialForm.permissions,
                                  canManageClients: e.target.checked,
                                },
                              })
                            }
                            className="mt-0.5 accent-[#d4af37]"
                          />
                          <div>
                            <span className="text-xs font-medium text-white block">Gérer les Clients Inscrits</span>
                            <span className="text-[11px] text-[#888]">Accès au carnet d&apos;adresses clients</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-3 rounded bg-[#161616] border border-[#2a2a2a] cursor-pointer hover:border-[#d4af37]/40 transition">
                          <input
                            type="checkbox"
                            checked={newCommercialForm.permissions.canViewReports}
                            onChange={(e) =>
                              setNewCommercialForm({
                                ...newCommercialForm,
                                permissions: {
                                  ...newCommercialForm.permissions,
                                  canViewReports: e.target.checked,
                                },
                              })
                            }
                            className="mt-0.5 accent-[#d4af37]"
                          />
                          <div>
                            <span className="text-xs font-medium text-white block">Rapports & Chiffre d&apos;Affaires</span>
                            <span className="text-[11px] text-[#888]">Voir les statistiques financières globales</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
                      <button
                        type="button"
                        onClick={() => setIsCreatingCommercial(false)}
                        className="px-4 py-2 text-xs uppercase tracking-wider text-[#9a958a] hover:text-white"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow"
                      >
                        Créer le compte commercial
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* COMMERCIALS LIST */}
              <div className="border border-[#262626] bg-[#121212] rounded overflow-hidden">
                <div className="p-4 border-b border-[#262626] bg-[#151515] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#d4af37]" />
                    <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                      Commerciaux & Administrateurs ({clients.filter((c) => c.role === 'commercial' || c.role === 'admin').length})
                    </h2>
                  </div>
                  <span className="text-xs text-[#888]">
                    Cliquez sur les droits pour activer/désactiver instantanément
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181818] text-[#9a958a] uppercase tracking-wider border-b border-[#262626]">
                      <tr>
                        <th className="p-3.5">Collaborateur</th>
                        <th className="p-3.5">Rôle</th>
                        <th className="p-3.5">Droits d&apos;accès configurés</th>
                        <th className="p-3.5 text-center">Statut</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {clients
                        .filter((c) => c.role === 'commercial' || c.role === 'admin')
                        .map((member) => {
                          const perms = member.permissions || {
                            canManageOrders: true,
                            canManageProducts: true,
                            canManageClients: false,
                            canPrintInvoices: true,
                            canPrintTickets: true,
                            canViewReports: false,
                          };
                          const isAdminMember = member.role === 'admin';

                          return (
                            <tr key={member.id} className="hover:bg-[#161616] transition">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                      isAdminMember
                                        ? 'bg-[#d4af37] text-black'
                                        : 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                                    }`}
                                  >
                                    {member.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white text-sm">{member.name}</div>
                                    <div className="text-[11px] text-[#888]">{member.email}</div>
                                    {member.phone && (
                                      <div className="text-[10px] text-[#666]">{member.phone} · {member.city || 'Maroc'}</div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                    isAdminMember
                                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]'
                                      : 'bg-blue-500/15 border border-blue-500/40 text-blue-400'
                                  }`}
                                >
                                  {isAdminMember ? 'Administrateur' : 'Commercial'}
                                </span>
                              </td>

                              <td className="p-3.5">
                                {isAdminMember ? (
                                  <span className="text-[11px] text-emerald-400 font-medium">
                                    ✦ Accès complet sans restriction
                                  </span>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5">
                                    <button
                                      onClick={() => handleTogglePermission(member, 'canManageOrders')}
                                      title="Cliquer pour basculer ce droit"
                                      className={`px-2 py-1 rounded text-[10px] font-medium border transition cursor-pointer ${
                                        perms.canManageOrders
                                          ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                                          : 'bg-[#1a1a1a] border-[#333] text-[#666] line-through'
                                      }`}
                                    >
                                      Commandes
                                    </button>

                                    <button
                                      onClick={() => handleTogglePermission(member, 'canManageProducts')}
                                      title="Cliquer pour basculer ce droit"
                                      className={`px-2 py-1 rounded text-[10px] font-medium border transition cursor-pointer ${
                                        perms.canManageProducts
                                          ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                                          : 'bg-[#1a1a1a] border-[#333] text-[#666] line-through'
                                      }`}
                                    >
                                      Produits & Stock
                                    </button>

                                    <button
                                      onClick={() => handleTogglePermission(member, 'canPrintInvoices')}
                                      title="Cliquer pour basculer ce droit"
                                      className={`px-2 py-1 rounded text-[10px] font-medium border transition cursor-pointer ${
                                        perms.canPrintInvoices
                                          ? 'bg-blue-950/40 border-blue-700/60 text-blue-300 hover:bg-blue-900/60'
                                          : 'bg-[#1a1a1a] border-[#333] text-[#666] line-through'
                                      }`}
                                    >
                                      Facture A4
                                    </button>

                                    <button
                                      onClick={() => handleTogglePermission(member, 'canPrintTickets')}
                                      title="Cliquer pour basculer ce droit"
                                      className={`px-2 py-1 rounded text-[10px] font-medium border transition cursor-pointer ${
                                        perms.canPrintTickets
                                          ? 'bg-amber-950/40 border-amber-700/60 text-amber-300 hover:bg-amber-900/60'
                                          : 'bg-[#1a1a1a] border-[#333] text-[#666] line-through'
                                      }`}
                                    >
                                      Ticket 80mm
                                    </button>

                                    <button
                                      onClick={() => handleTogglePermission(member, 'canManageClients')}
                                      title="Cliquer pour basculer ce droit"
                                      className={`px-2 py-1 rounded text-[10px] font-medium border transition cursor-pointer ${
                                        perms.canManageClients
                                          ? 'bg-purple-950/40 border-purple-700/60 text-purple-300 hover:bg-purple-900/60'
                                          : 'bg-[#1a1a1a] border-[#333] text-[#666] line-through'
                                      }`}
                                    >
                                      Clients
                                    </button>

                                    <button
                                      onClick={() => handleTogglePermission(member, 'canViewReports')}
                                      title="Cliquer pour basculer ce droit"
                                      className={`px-2 py-1 rounded text-[10px] font-medium border transition cursor-pointer ${
                                        perms.canViewReports
                                          ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/30'
                                          : 'bg-[#1a1a1a] border-[#333] text-[#666] line-through'
                                      }`}
                                    >
                                      Rapports CA
                                    </button>
                                  </div>
                                )}
                              </td>

                              <td className="p-3.5 text-center">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                    member.status === 'active'
                                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                      : 'bg-red-950/60 text-red-400 border border-red-800/40'
                                  }`}
                                >
                                  {member.status === 'active' ? 'Actif' : 'Suspendu'}
                                </span>
                              </td>

                              <td className="p-3.5 text-right whitespace-nowrap">
                                {!isAdminMember && (
                                  <div className="flex items-center justify-end gap-1.5">
                                    {onUpdateUser && (
                                      <button
                                        onClick={() => {
                                          const newStatus = member.status === 'active' ? 'suspended' : 'active';
                                          onUpdateUser({ id: member.id, status: newStatus });
                                          showToast(`Compte ${newStatus === 'active' ? 'activé' : 'suspendu'}`);
                                        }}
                                        title={member.status === 'active' ? 'Suspendre l’accès' : 'Réactiver l’accès'}
                                        className="p-1.5 rounded bg-[#1c1c1c] hover:bg-[#282828] text-[#ccc] hover:text-white border border-[#333] transition cursor-pointer"
                                      >
                                        {member.status === 'active' ? <UserX className="w-3.5 h-3.5 text-amber-400" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                                      </button>
                                    )}

                                    {onDeleteClient && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setDeleteTarget({
                                            type: 'team',
                                            id: member.id,
                                            title: `Collaborateur ${member.name}`,
                                            subtitle: `${member.email} · Commercial`,
                                          });
                                        }}
                                        title="Supprimer ce commercial"
                                        className="p-1.5 rounded bg-red-950/30 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CLIENTS INSCRITS */}
          {activeTab === 'clients' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d4af37]">Gestion Clientèle</span>
                  <h1 className="text-3xl font-serif text-white mt-1">Clients & Membres Inscrits</h1>
                  <p className="text-sm text-[#9a958a] mt-1">
                    Gérez les comptes clients, suivez leurs commandes et administrez les accès.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingClient(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition shadow cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nouveau Client</span>
                </button>
              </div>

              {/* Clients Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3.5 rounded border border-[#262626] bg-[#121212]">
                  <span className="text-[11px] uppercase tracking-wider text-[#9a958a]">Total Inscrits</span>
                  <div className="text-2xl font-serif text-[#d4af37] mt-1 font-bold">
                    {clients.length}
                  </div>
                  <span className="text-[10px] text-[#777] mt-0.5 block">Comptes enregistrés</span>
                </div>

                <div className="p-3.5 rounded border border-emerald-900/30 bg-[#121212]">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Abonnés Newsletter
                  </span>
                  <div className="text-2xl font-serif text-emerald-400 mt-1 font-bold">
                    {clients.filter((c) => c.isNewsletterSubscriber).length}
                  </div>
                  <span className="text-[10px] text-[#777] mt-0.5 block">Recevront nouveautés</span>
                </div>

                <div className="p-3.5 rounded border border-[#262626] bg-[#121212]">
                  <span className="text-[11px] uppercase tracking-wider text-[#9a958a]">Clients Actifs</span>
                  <div className="text-2xl font-serif text-white mt-1 font-bold">
                    {clients.filter((c) => c.status === 'active').length}
                  </div>
                  <span className="text-[10px] text-[#777] mt-0.5 block">Accès autorisés</span>
                </div>

                <div className="p-3.5 rounded border border-[#262626] bg-[#121212]">
                  <span className="text-[11px] uppercase tracking-wider text-[#9a958a]">Villes Desservies</span>
                  <div className="text-2xl font-serif text-white mt-1 font-bold">
                    {new Set(clients.map((c) => c.city || 'Casablanca')).size}
                  </div>
                  <span className="text-[10px] text-[#777] mt-0.5 block">Maroc entier</span>
                </div>

                <div className="p-3.5 rounded border border-[#262626] bg-[#121212]">
                  <span className="text-[11px] uppercase tracking-wider text-[#9a958a]">Commandes Liées</span>
                  <div className="text-2xl font-serif text-[#d4af37] mt-1 font-bold">
                    {orders.length}
                  </div>
                  <span className="text-[10px] text-[#777] mt-0.5 block">Historique global</span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-[#141414] p-3 rounded-lg border border-[#262626] items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, téléphone ou ville…"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#1b1b1b] border border-[#333] rounded text-xs text-white placeholder-[#777] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <select
                  value={clientStatusFilter}
                  onChange={(e) => setClientStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-[#1b1b1b] border border-[#333] rounded text-xs text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="all">Tous les inscrits ({clients.length})</option>
                  <option value="newsletter">✦ Abonnés Newsletter ({clients.filter((c) => c.isNewsletterSubscriber).length})</option>
                  <option value="with_orders">Avec commandes passées</option>
                  <option value="active">Actifs uniquement</option>
                  <option value="suspended">Suspendus uniquement</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const subscriberEmails = clients
                      .filter((c) => c.isNewsletterSubscriber)
                      .map((c) => c.email);
                    if (subscriberEmails.length === 0) {
                      showToast('Aucun abonné newsletter pour le moment');
                      return;
                    }
                    navigator.clipboard.writeText(subscriberEmails.join(', '));
                    showToast(`✦ ${subscriberEmails.length} email(s) d'abonnés copiés dans le presse-papier !`);
                  }}
                  className="px-3.5 py-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/30 rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Copier les adresses pour l'envoi des nouveautés"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier Emails Newsletter</span>
                </button>
              </div>

              {/* Clients Table */}
              <div className="bg-[#121212] rounded-lg border border-[#262626] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#262626] text-[11px] uppercase tracking-wider text-[#d4af37] bg-[#161616]">
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Ville</th>
                        <th className="py-3 px-4">Date Inscription</th>
                        <th className="py-3 px-4 text-center">Commandes</th>
                        <th className="py-3 px-4 text-center">Statut</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e1e]">
                      {clients
                        .filter((c) => {
                          if (clientStatusFilter === 'newsletter') {
                            if (!c.isNewsletterSubscriber) return false;
                          } else if (clientStatusFilter === 'with_orders') {
                            if (!orders.some((o) => o.email.toLowerCase() === c.email.toLowerCase())) return false;
                          } else if (clientStatusFilter !== 'all' && c.status !== clientStatusFilter) {
                            return false;
                          }
                          if (clientSearch.trim()) {
                            const q = clientSearch.toLowerCase();
                            return (
                              c.name.toLowerCase().includes(q) ||
                              c.email.toLowerCase().includes(q) ||
                              (c.phone && c.phone.toLowerCase().includes(q)) ||
                              (c.city && c.city.toLowerCase().includes(q))
                            );
                          }
                          return true;
                        })
                        .map((c) => {
                          const clientOrders = orders.filter(
                            (o) => o.email.toLowerCase() === c.email.toLowerCase()
                          );
                          const totalSpent = clientOrders.reduce((sum, o) => sum + o.total, 0);
                          const cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');

                          return (
                            <tr key={c.id} className="hover:bg-[#171717] transition">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center font-serif font-bold text-xs">
                                    {c.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-semibold text-white">{c.name}</span>
                                      {c.role === 'admin' ? (
                                        <span className="px-1.5 py-0.5 rounded bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-wider">
                                          Admin
                                        </span>
                                      ) : (
                                        <span className="px-1.5 py-0.5 rounded bg-[#222] text-[#d4af37] text-[9px] uppercase tracking-wider">
                                          VIP
                                        </span>
                                      )}
                                      {c.isNewsletterSubscriber && (
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5" />
                                          Newsletter
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-[#666]">{c.notes || 'Client boutique'}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <p className="text-white flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#777]" />
                                  <span>{c.email}</span>
                                </p>
                                {c.phone && (
                                  <p className="text-[#888] text-[11px] flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3 text-[#666]" />
                                    <span>{c.phone}</span>
                                  </p>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-[#ccc]">
                                {c.city || 'Casablanca'}
                              </td>

                              <td className="py-3.5 px-4 text-[#888] font-mono text-[11px]">
                                {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <span className="font-mono font-bold text-white">{clientOrders.length}</span>
                                {totalSpent > 0 && (
                                  <span className="text-[10px] text-[#d4af37] block font-mono">
                                    {totalSpent.toLocaleString('fr-FR')} DH
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                    c.status === 'active'
                                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                      : 'bg-red-950/60 text-red-400 border border-red-800/40'
                                  }`}
                                >
                                  {c.status === 'active' ? 'Actif' : 'Suspendu'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Direct WhatsApp Contact */}
                                  {cleanPhone && (
                                    <a
                                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Bonjour ${c.name}, la Maison Ovelzya reste à votre entière disposition.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Contacter sur WhatsApp"
                                      className="w-7 h-7 rounded bg-[#25d366]/15 hover:bg-[#25d366] text-[#25d366] hover:text-black flex items-center justify-center transition cursor-pointer"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                  )}

                                  {/* Direct Email */}
                                  <a
                                    href={`mailto:${c.email}?subject=Ovelzya — Haute Joaillerie & Maroquinerie`}
                                    title="Envoyer un email"
                                    className="w-7 h-7 rounded bg-[#1e1e1e] hover:bg-[#2e2e2e] text-[#aaa] hover:text-white flex items-center justify-center transition cursor-pointer"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </a>

                                  {/* Toggle Status (Active/Suspend) */}
                                  {c.role !== 'admin' && onUpdateClientStatus && (
                                    <button
                                      onClick={() =>
                                        onUpdateClientStatus(
                                          c.id,
                                          c.status === 'active' ? 'suspended' : 'active'
                                        )
                                      }
                                      title={c.status === 'active' ? 'Suspendre le compte' : 'Réactiver le compte'}
                                      className={`w-7 h-7 rounded flex items-center justify-center transition cursor-pointer ${
                                        c.status === 'active'
                                          ? 'bg-amber-950/40 hover:bg-amber-800/60 text-amber-300'
                                          : 'bg-emerald-950/40 hover:bg-emerald-800/60 text-emerald-300'
                                      }`}
                                    >
                                      {c.status === 'active' ? (
                                        <UserX className="w-3.5 h-3.5" />
                                      ) : (
                                        <UserCheck className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  )}

                                  {/* Manage/Reset Password */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setClientPasswordModal({
                                        client: c,
                                        newPass: '',
                                        isSubmitting: false,
                                      });
                                    }}
                                    title="Définir / Mémoriser le mot de passe de ce client"
                                    className="w-7 h-7 rounded bg-[#d4af37]/15 hover:bg-[#d4af37]/30 text-[#d4af37] flex items-center justify-center transition cursor-pointer"
                                  >
                                    <Key className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Client */}
                                  {c.role !== 'admin' && onDeleteClient && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDeleteTarget({
                                          type: 'client',
                                          id: c.id,
                                          title: `Client ${c.name}`,
                                          subtitle: `${c.email} · ${c.city || 'Maroc'}`,
                                        });
                                      }}
                                      title="Supprimer ce client"
                                      className="w-7 h-7 rounded bg-red-950/30 hover:bg-red-900/60 text-red-400 hover:text-red-200 flex items-center justify-center transition cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: PRODUCT EDIT / CREATE */}
      {(editingProduct || isCreatingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#d4af37]/40 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col my-8 shadow-2xl">
            <div className="p-4 border-b border-[#262626] flex items-center justify-between">
              <h2 className="text-lg font-serif text-white">
                {isCreatingProduct ? 'Ajouter une Pièce de Joaillerie' : `Modifier: ${prodForm.name}`}
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingProduct(false);
                }}
                className="text-[#9a958a] hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* NOM DU BIJOU MULTILINGUE (FR / AR / EN) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Nom du bijou (Français 🇫🇷) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="ex: Bague Solitaire Céleste"
                    value={prodForm.name || ''}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Nom du bijou (Arabe 🇸🇦)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثال: خاتم سوليتير سماوي"
                    value={prodForm.name_ar || ''}
                    onChange={(e) => setProdForm({ ...prodForm, name_ar: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                    Nom du bijou (Anglais 🇬🇧)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Celestial Solitaire Ring"
                    value={prodForm.name_en || ''}
                    onChange={(e) => setProdForm({ ...prodForm, name_en: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Catégorie
                  </label>
                  <select
                    value={prodForm.cat || 'Colliers'}
                    onChange={(e) => setProdForm({ ...prodForm, cat: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Prix (DH) *
                  </label>
                  <input
                    required
                    type="number"
                    value={prodForm.price || ''}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-[#d4af37] font-bold rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Quantité en Stock *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="ex: 15"
                    value={prodForm.stock !== undefined ? prodForm.stock : 10}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-emerald-400 font-bold rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    Badge (FR 🇫🇷)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Best-seller, Icône"
                    value={prodForm.badge || ''}
                    onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                    Badge (EN 🇬🇧)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best-seller"
                    value={prodForm.badge_en || ''}
                    onChange={(e) => setProdForm({ ...prodForm, badge_en: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* SKU & BARCODE TRACEABILITY SECTION */}
              <div className="p-4 rounded-lg bg-[#181818] border border-[#2e2e2e] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-white">
                      Traçabilité · Référence (SKU) & Code à barres (EAN-13)
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9a958a] font-mono">
                    Factures A4 & Tickets de caisse
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs uppercase tracking-wider text-[#9a958a]">
                        Référence / SKU *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const catPrefix = (prodForm.cat || 'Colliers').startsWith('Collier')
                            ? 'COL'
                            : (prodForm.cat || '').startsWith('Bracelet')
                            ? 'BRA'
                            : (prodForm.cat || '').startsWith('Bague')
                            ? 'BAG'
                            : (prodForm.cat || '').startsWith('Boucle')
                            ? 'BOU'
                            : (prodForm.cat || '').startsWith('Sac')
                            ? 'SAC'
                            : 'PAR';
                          const rnd = Math.floor(100 + Math.random() * 900);
                          setProdForm({ ...prodForm, sku: `MD-${catPrefix}-${rnd}` });
                        }}
                        className="text-[10px] text-[#d4af37] hover:underline cursor-pointer"
                      >
                        Générer SKU
                      </button>
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="ex: MD-COL-101"
                      value={prodForm.sku || ''}
                      onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#333] text-sm text-[#d4af37] font-mono font-bold rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs uppercase tracking-wider text-[#9a958a]">
                        Code à Barres (EAN-13) *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const rnd = Math.floor(100000 + Math.random() * 900000);
                          setProdForm({ ...prodForm, barcode: `6111000${rnd}`.slice(0, 13) });
                        }}
                        className="text-[10px] text-[#d4af37] hover:underline cursor-pointer"
                      >
                        Générer Barcode
                      </button>
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="ex: 6111000100123"
                      value={prodForm.barcode || ''}
                      onChange={(e) => setProdForm({ ...prodForm, barcode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#333] text-sm text-white font-mono rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* VISUAL BARCODE PREVIEW */}
                <div className="bg-white p-2.5 rounded flex items-center justify-between text-black">
                  <div className="flex items-center gap-3">
                    <div className="flex items-end h-8 gap-[2px] px-1 bg-white">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3].map((h, i) => (
                        <div
                          key={i}
                          className="bg-black"
                          style={{
                            width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1.5px',
                            height: `${20 + h * 2.5}px`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="leading-tight">
                      <div className="text-[11px] font-mono font-bold tracking-widest">
                        {prodForm.barcode || '6111000100123'}
                      </div>
                      <div className="text-[9px] font-mono text-zinc-600">
                        {prodForm.sku || 'OV-COL-001'} · MAISON OVELZYA · HAUTE JOAILLERIE
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black text-[#d4af37] rounded">
                    EAN-13 Prêt
                  </span>
                </div>
              </div>

              {/* SECTION: PHOTOS MULTIPLES (GALERIE D'IMAGES) */}
              <div className="p-4 rounded-lg bg-[#181818] border border-[#2e2e2e] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#282828] pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-white block">
                        Photos du bijou ({Array.isArray(prodForm.images) ? prodForm.images.length : (prodForm.img ? 1 : 0)})
                      </span>
                      <span className="text-[10px] text-[#9a958a]">
                        Vous pouvez ajouter plusieurs angles, détails et photos portées. La 1ère photo sera la couverture.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateDemoPhotos}
                    className="text-[10px] text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <Sparkles className="w-3 h-3" />
                    Générer 3 photos d&apos;exemple
                  </button>
                </div>

                {/* Adding a photo: URL input + File upload button */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coller l'URL d'une photo (https://images...)"
                        value={newPhotoUrlInput}
                        onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPhotoUrl();
                          }
                        }}
                        className="w-full px-3 py-2 bg-[#121212] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono placeholder-[#666]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddPhotoUrl()}
                      className="px-3.5 py-2 bg-[#252525] hover:bg-[#303030] text-[#d4af37] border border-[#3d3d3d] hover:border-[#d4af37] rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0"
                    >
                      + Ajouter URL
                    </button>
                    <label className="px-3.5 py-2 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#e8c878] border border-[#d4af37]/40 rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Importer photo(s)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUploadPhotoFiles}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Thumbnails preview & management list */}
                {Array.isArray(prodForm.images) && prodForm.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {prodForm.images.map((imgUrl, index) => (
                      <div
                        key={index}
                        className={`group relative rounded-lg border overflow-hidden bg-[#111] p-1 transition flex flex-col ${
                          index === 0
                            ? 'border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                            : 'border-[#333] hover:border-[#555]'
                        }`}
                      >
                        <div className="aspect-[4/5] w-full rounded overflow-hidden relative bg-[#181818]">
                          <img
                            src={imgUrl}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${prodForm.seed || 'bijou'}-${index}/300/375`;
                            }}
                          />
                          {/* Badge cover */}
                          {index === 0 ? (
                            <span className="absolute top-1.5 left-1.5 bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                              ★ Couverture
                            </span>
                          ) : (
                            <span className="absolute top-1.5 left-1.5 bg-black/70 text-white/80 text-[9px] font-mono px-1.5 py-0.5 rounded">
                              #{index + 1}
                            </span>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            title="Supprimer cette photo"
                            className="absolute top-1.5 right-1.5 p-1 bg-red-950/80 hover:bg-red-800 text-red-300 rounded transition cursor-pointer shadow"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="pt-1.5 px-0.5 flex items-center justify-between text-[10px]">
                          {index !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryPhoto(index)}
                              className="text-[#d4af37] hover:underline cursor-pointer"
                            >
                              Mettre en 1ère
                            </button>
                          ) : (
                            <span className="text-[#9a958a] italic">Photo principale</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded border border-dashed border-[#333] text-center text-xs text-[#888] space-y-2">
                    <p>Aucune photo ajoutée pour le moment.</p>
                    <p className="text-[11px] text-[#666]">
                      Importez des photos depuis votre appareil ou collez des URLs. Si vide, un visuel par défaut sera généré.
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION: VIDÉO DU PRODUIT */}
              <div className="p-4 rounded-lg bg-[#181818] border border-[#2e2e2e] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#282828] pb-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-white block">
                        Vidéo du produit (Optionnelle)
                      </span>
                      <span className="text-[10px] text-[#9a958a]">
                        Vidéo de présentation du bijou porté, reflets de l&apos;or 18K ou détails des finitions.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleInsertDemoVideo}
                    className="text-[10px] text-purple-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <Play className="w-3 h-3" />
                    Insérer vidéo démo
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="URL vidéo (ex: https://.../video.mp4 ou lien YouTube https://youtu.be/...)"
                    value={prodForm.video || ''}
                    onChange={(e) => setProdForm({ ...prodForm, video: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#121212] border border-[#333] text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono placeholder-[#666]"
                  />
                  <label className="px-3.5 py-2 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/50 rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Importer vidéo</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleUploadVideoFile}
                      className="hidden"
                    />
                  </label>
                  {prodForm.video && (
                    <button
                      type="button"
                      onClick={() => setProdForm({ ...prodForm, video: '' })}
                      className="px-3 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 rounded text-xs transition cursor-pointer"
                      title="Effacer la vidéo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Video Player Preview if a video exists */}
                {prodForm.video ? (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#9a958a] block font-semibold">
                      Aperçu de la vidéo intégrée :
                    </span>
                    <div className="aspect-video w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden border border-[#333] shadow-lg relative">
                      {(() => {
                        const parsed = parseVideoUrl(prodForm.video);
                        if (!parsed) return null;
                        if (parsed.type === 'youtube' || parsed.type === 'vimeo') {
                          return (
                            <iframe
                              src={parsed.embedUrl}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="Aperçu vidéo"
                            />
                          );
                        }
                        return (
                          <video
                            src={parsed.embedUrl}
                            controls
                            playsInline
                            className="w-full h-full object-contain bg-black"
                          />
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#666]">
                    Aucune vidéo liée. Les vidéos augmentent le taux de conversion en montrant la brillance de l&apos;acier 316L.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                  Description (Français 🇫🇷)
                </label>
                <textarea
                  rows={2}
                  placeholder="Description détaillée de la pièce en français..."
                  value={prodForm.desc || ''}
                  onChange={(e) => setProdForm({ ...prodForm, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                  Description (Arabe 🇸🇦)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  placeholder="وصف دقيق للقطعة باللغة العربية..."
                  value={prodForm.desc_ar || ''}
                  onChange={(e) => setProdForm({ ...prodForm, desc_ar: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#d4af37] block mb-1 font-medium">
                  Description (Anglais 🇬🇧)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed description of the jewelry piece in English (e.g. Crafted in 316L steel plated with 18K gold)..."
                  value={prodForm.desc_en || ''}
                  onChange={(e) => setProdForm({ ...prodForm, desc_en: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#d4af37]/40 text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={prodForm.inStock !== false}
                  onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                  className="w-4 h-4 accent-[#d4af37]"
                />
                <label htmlFor="inStock" className="text-sm text-white cursor-pointer">
                  Pièce disponible en stock immédiat
                </label>
              </div>

              <div className="pt-4 border-t border-[#262626] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                  }}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-[#9a958a] hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded"
                >
                  {isCreatingProduct ? 'Créer le bijou' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#d4af37]/40 rounded-lg w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#262626] pb-3">
              <div>
                <span className="font-mono text-sm text-[#d4af37] font-bold">{viewOrder.num}</span>
                <p className="text-xs text-[#9a958a]">
                  Passée le {new Date(viewOrder.date).toLocaleString('fr-FR')}
                </p>
              </div>
              <button onClick={() => setViewOrder(null)} className="text-[#9a958a] hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#9a958a] block">Client:</span>
                <span className="text-white font-medium text-sm">{viewOrder.name}</span>
              </div>
              <div>
                <span className="text-[#9a958a] block">Email & Téléphone:</span>
                <span className="text-white">
                  {viewOrder.email} {viewOrder.phone ? `· ${viewOrder.phone}` : ''}
                </span>
              </div>
              <div>
                <span className="text-[#9a958a] block">Adresse de livraison:</span>
                <span className="text-white">
                  {viewOrder.street || 'Non précisé'}, {viewOrder.city || 'Maroc'}
                </span>
              </div>
              <div>
                <span className="text-[#9a958a] block">Mode de paiement:</span>
                <span className="text-[#d4af37] font-semibold">{viewOrder.payMethod}</span>
              </div>
            </div>

            <div className="border-t border-[#262626] pt-3">
              <span className="text-xs uppercase tracking-wider text-[#9a958a] block mb-2">
                Articles commandés
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {viewOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-[#1f1f1f]">
                    <span className="text-white">
                      {it.name || `Bijou #${it.id}`} × {it.qty}
                    </span>
                    <span className="text-[#d4af37] font-serif font-semibold">
                      {(it.price * it.qty).toLocaleString('fr-FR')} DH
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#262626] pt-3 flex items-center justify-between text-sm font-semibold">
              <span className="text-white">Total Commande</span>
              <span className="text-[#d4af37] text-lg font-serif">
                {viewOrder.total.toLocaleString('fr-FR')} DH
              </span>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                {onPrintInvoice && (
                  <button
                    onClick={() => {
                      onPrintInvoice(viewOrder);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Facture PDF (A4)</span>
                  </button>
                )}
                {onPrintReceipt && (
                  <button
                    onClick={() => {
                      onPrintReceipt(viewOrder);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#1e1e1e] hover:bg-[#282828] border border-[#d4af37]/50 text-[#d4af37] font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Ticket PDF (80mm)</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (onPrintWarranty) onPrintWarranty(viewOrder);
                  else setActiveWarrantyOrder(viewOrder);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-[#d4af37] text-[#d4af37] hover:text-[#e8c878] font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow"
              >
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Générer le Certificat de Garantie PDF</span>
              </button>
              <button
                onClick={() => setViewOrder(null)}
                className="w-full py-2 bg-[#222] hover:bg-[#333] text-xs uppercase tracking-wider text-[#bbb] hover:text-white rounded transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CLIENT */}
      {isCreatingClient && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#d4af37]/40 rounded-lg w-full max-w-md flex flex-col my-8 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#0e0e0e]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#d4af37]" />
                <h2 className="text-base font-serif font-bold text-white">Ajouter un Client Inscrit</h2>
              </div>
              <button
                onClick={() => setIsCreatingClient(false)}
                className="text-[#9a958a] hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newClientForm.name || !newClientForm.email) return;
                if (onCreateClient) {
                  await onCreateClient(newClientForm);
                }
                setNewClientForm({ name: '', email: '', phone: '', city: 'Casablanca' });
                setIsCreatingClient(false);
                showToast('Client enregistré avec succès ✦');
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#9a958a] block mb-1">
                  Nom et Prénom *
                </label>
                <input
                  required
                  type="text"
                  placeholder="ex: Amina Tazi"
                  value={newClientForm.name}
                  onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#9a958a] block mb-1">
                  Adresse Email *
                </label>
                <input
                  required
                  type="email"
                  placeholder="amina.tazi@exemple.ma"
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#9a958a] block mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+212 6..."
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#9a958a] block mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Casablanca"
                    value={newClientForm.city}
                    onChange={(e) => setNewClientForm({ ...newClientForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-[10px] text-[#666]">
                Le mot de passe par défaut est <b className="text-white font-mono">Ovelzya2026!</b>. Le client pourra se connecter immédiatement.
              </p>

              <div className="border-t border-[#262626] pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingClient(false)}
                  className="px-4 py-2 border border-[#333] hover:border-[#555] text-[#aaa] hover:text-white rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold uppercase tracking-wider rounded transition shadow"
                >
                  Enregistrer Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warranty Certificate Modal */}
      {activeWarrantyOrder && (
        <WarrantyModal
          isOpen={!!activeWarrantyOrder}
          onClose={() => setActiveWarrantyOrder(null)}
          order={activeWarrantyOrder}
          lang={lang}
          qrVerificationUrl={settingsForm.qrVerificationUrl}
          warrantySettings={settingsForm.warranty}
          onSaveWarrantySettings={async (w) => {
            setSettingsForm((prev: any) => ({ ...prev, warranty: w }));
            await onUpdateContent({ settings: { ...settingsForm, warranty: w } });
            showToast('✦ Textes officiels du certificat enregistrés avec succès');
          }}
          canEdit={currentUser?.role === 'admin'}
        />
      )}

      {/* Bulletproof In-App Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-red-500/40 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Confirmer la suppression</h3>
                <p className="text-xs text-[#9a958a]">Cette action est irréversible</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] text-xs space-y-1">
              <div className="font-semibold text-white text-sm">{deleteTarget.title}</div>
              {deleteTarget.subtitle && (
                <div className="text-[#9a958a]">{deleteTarget.subtitle}</div>
              )}
            </div>

            <p className="text-xs text-[#aaa] leading-relaxed">
              Êtes-vous certain de vouloir supprimer définitivement cet élément de la base de données ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded border border-[#333] hover:border-[#555] text-xs text-[#aaa] hover:text-white transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                Supprimer Définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Password Setting / Reset Modal */}
      {clientPasswordModal && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-[#d4af37]/40 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Définir le mot de passe client</h3>
                  <p className="text-[11px] text-[#9a958a]">{clientPasswordModal.client.name} ({clientPasswordModal.client.email})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setClientPasswordModal(null)}
                className="text-[#888] hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClientPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#9a958a] mb-1.5">
                  Nouveau mot de passe pour le compte
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Ovelzya2026! ou mot de passe choisi"
                  value={clientPasswordModal.newPass}
                  onChange={(e) =>
                    setClientPasswordModal({
                      ...clientPasswordModal,
                      newPass: e.target.value,
                    })
                  }
                  className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                />
                <p className="text-[10px] text-[#666] mt-1">
                  Recommandé : au moins 6 caractères. Le client pourra se connecter immédiatement avec ce mot de passe ou le mémoriser.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClientPasswordModal(null)}
                  className="px-4 py-2 border border-[#333] hover:border-[#555] text-xs text-[#aaa] hover:text-white rounded cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={clientPasswordModal.isSubmitting || !clientPasswordModal.newPass}
                  className="px-5 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer disabled:opacity-50"
                >
                  {clientPasswordModal.isSubmitting ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
