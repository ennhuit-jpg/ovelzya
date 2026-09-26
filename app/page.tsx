'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import ChatWidget from '@/components/ChatWidget';
import SizeGuideModal from '@/components/SizeGuideModal';
import AdminDashboard from '@/components/AdminDashboard';
import AuthModal from '@/components/AuthModal';
import InvoiceModal from '@/components/InvoiceModal';
import ReceiptModal from '@/components/ReceiptModal';
import WarrantyModal from '@/components/WarrantyModal';
import WishlistView from '@/components/WishlistView';
import SocialProofNotification from '@/components/SocialProofNotification';
import ExitIntentModal from '@/components/ExitIntentModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import ShareModal from '@/components/ShareModal';
import HomeSocialChannels from '@/components/HomeSocialChannels';
import NewsletterSection from '@/components/NewsletterSection';
import OvelzyaLogo from '@/components/OvelzyaLogo';
import ProductImageZoom from '@/components/ProductImageZoom';
import CustomerReviewsSection from '@/components/CustomerReviewsSection';
import ProductCrossSellUpsellSection from '@/components/ProductCrossSellUpsellSection';
import { CustomerReview } from '@/lib/types';
import { getSavedReviews, persistReviews } from '@/lib/reviewsData';
import { TRANSLATIONS } from '@/lib/translations';
import { getProductLocalized, getCategoryLabel } from '@/lib/productTranslations';
import {
  Product,
  Order,
  ContactMessage,
  SiteContent,
  FlashSaleItem,
  Quote,
  OrderStatus,
  RegisteredUser,
  Language,
} from '@/lib/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_FLASH,
  INITIAL_QUOTES,
  INITIAL_CONTENT,
  INITIAL_ORDERS,
  INITIAL_CONTACTS,
} from '@/lib/initialData';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Star,
  Check,
  Shield,
  Clock,
  Heart,
  Share2,
  Maximize2,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  Search,
  CheckCircle2,
  Printer,
  Receipt,
  Image as ImageIcon,
  Film,
  Video,
  Play,
  ChevronLeft,
  ChevronRight,
  Camera,
  MessageCircle,
  Flame,
  ShieldCheck,
  Gift,
  Droplets,
  Gem,
  Layers,
  Award,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

function generateNewOrderInfo() {
  const stamp = Date.now();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return {
    id: `ord_${stamp}`,
    num: `MD-${rand}`,
    date: new Date(stamp).toISOString(),
  };
}

export default function StorePage() {
  // Localization
  const [lang, setLang] = useState<Language>('fr');

  // Main Data States (synced with backend API)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [flash, setFlash] = useState<FlashSaleItem[]>(INITIAL_FLASH);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [contacts, setContacts] = useState<ContactMessage[]>(INITIAL_CONTACTS);

  // Active View navigation
  // 'home' | 'collection' | 'product' | 'promos' | 'materials' | 'about' | 'contact' | 'track' | 'checkout' | 'confirmation'
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<number>(1);

  // Cart state with persistence
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customer Reviews state with persistence
  const [reviews, setReviews] = useState<CustomerReview[]>([]);

  // Blur effect when product is added to cart
  const [blurredProductIds, setBlurredProductIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setReviews(getSavedReviews());
  }, []);

  const handleAddReview = (newRev: CustomerReview) => {
    setReviews((prev) => {
      const updated = [newRev, ...prev];
      persistReviews(updated);
      return updated;
    });
    showToast('✦ Votre avis avec photos a été publié avec succès !');
  };

  const triggerAddToCartBlur = (id: number) => {
    setBlurredProductIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setBlurredProductIds((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 2200);
  };

  // Admin view toggle
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Authentication & Client User state
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [clients, setClients] = useState<RegisteredUser[]>([]);

  // Invoice Print Modal state
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Thermal Receipt Print Modal state (80mm)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Warranty Certificate Modal state
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [warrantyOrder, setWarrantyOrder] = useState<Order | null>(null);

  const handlePrintWarranty = (order: Order) => {
    setWarrantyOrder(order);
    setIsWarrantyOpen(true);
  };

  // Visitor Social Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareProduct, setShareProduct] = useState<Product | null>(null);

  const handleOpenShare = (p?: Product | null) => {
    setShareProduct(p || null);
    setIsShareModalOpen(true);
  };

  // Theme Light / Dark Mode
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Size Guide Modal
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Sales Boosters state: Luxury gift packaging option
  const [isGiftPackaging, setIsGiftPackaging] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Wishlist
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Collection filters & search
  const [filterCat, setFilterCat] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'feat' | 'newest' | 'asc' | 'desc' | 'name-asc' | 'name-desc' | 'stock' | 'rating'>('feat');
  const [displayLimit, setDisplayLimit] = useState<number>(8);

  // Product detail view quantity & selected image
  const [productQty, setProductQty] = useState<number>(1);
  const [activeImageSrc, setActiveImageSrc] = useState<string>('');
  const [activeMediaMode, setActiveMediaMode] = useState<'photos' | 'video'>('photos');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Checkout form state
  const [checkoutData, setCheckoutData] = useState({
    email: '',
    fname: '',
    lname: '',
    phone: '',
    street: '',
    city: 'Casablanca',
    cp: '20000',
    pay: 'cod',
    promo: '',
    appliedDiscount: 0,
  });
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Tracking page input
  const [trackQuery, setTrackQuery] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackError, setTrackError] = useState<boolean>(false);

  // Contact page form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Question sur un produit',
    message: '',
  });

  // Material guide filter tab
  const [materialFilter, setMaterialFilter] = useState<'all' | 'steel' | 'pvd' | 'gems' | 'comparison' | 'care'>('all');

  // Countdown timer for Flash Sale
  const [countdown, setCountdown] = useState({ d: '00', h: '00', m: '00', s: '00' });

  // Translation shortcut
  const t = (k: string) => TRANSLATIONS[lang]?.[k] || TRANSLATIONS['fr']?.[k] || k;

  // Show Toast
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  // Synchronize initial data from Backend API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          if (data.products) setProducts(data.products);
          if (data.flash) setFlash(data.flash);
          if (data.quotes) setQuotes(data.quotes);
          if (data.content) {
            setContent(data.content);
            if (data.content.settings?.customLogoUrl && typeof window !== 'undefined') {
              localStorage.setItem('ovelzya_custom_logo', data.content.settings.customLogoUrl);
              window.dispatchEvent(new CustomEvent('ovelzya_logo_updated', { detail: data.content.settings.customLogoUrl }));
            }
          }
        }

        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (Array.isArray(ordData)) setOrders(ordData);
        }

        const msgRes = await fetch('/api/contact');
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          if (Array.isArray(msgData)) setContacts(msgData);
        }

        const userRes = await fetch('/api/users');
        if (userRes.ok) {
          const userData = await userRes.json();
          if (Array.isArray(userData)) setClients(userData);
        }
      } catch (err) {
        console.warn('Using local store fallback:', err);
      }
    };
    fetchData();
  }, []);

  const isHydratedRef = useRef(false);

  // Restore client-stored preferences asynchronously after initial hydration to prevent SSR mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedLang = localStorage.getItem('md_lang_store');
        if (savedLang === 'ar' || savedLang === 'fr' || savedLang === 'en') {
          setLang(savedLang as Language);
          document.body.classList.toggle('ar', savedLang === 'ar');
          document.documentElement.lang = savedLang;
        }
        const savedCart = localStorage.getItem('md_cart_store');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        const savedUser = localStorage.getItem('md_user_store');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
        const savedTheme = localStorage.getItem('md_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
        const savedWish = localStorage.getItem('md_wish_store');
        if (savedWish) {
          setWishlist(JSON.parse(savedWish));
        }
      } catch (e) {}
      isHydratedRef.current = true;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save Cart & Wishlist to localStorage
  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('md_cart_store', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('md_wish_store', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      document.body.classList.toggle('ar', lang === 'ar');
      document.documentElement.lang = lang;
      if (isHydratedRef.current) {
        localStorage.setItem('md_lang_store', lang);
      }
    } catch (e) {}
  }, [lang]);

  // Synchronize language with admin configuration (locking to single language FR, AR, or EN if configured)
  useEffect(() => {
    const langsConfig = content.settings?.languages;
    if (!langsConfig) return;

    const frEnabled = langsConfig.enableFr !== false;
    const arEnabled = langsConfig.enableAr !== false;
    const enEnabled = langsConfig.enableEn !== false;
    const enabledCount = [frEnabled, arEnabled, enEnabled].filter(Boolean).length;

    if (enabledCount === 1) {
      const lockedLang: Language = frEnabled ? 'fr' : arEnabled ? 'ar' : 'en';
      if (lang !== lockedLang) {
        setLang(lockedLang);
      }
    } else {
      const isCurrentDisabled =
        (lang === 'fr' && !frEnabled) ||
        (lang === 'ar' && !arEnabled) ||
        (lang === 'en' && !enEnabled);
      if (isCurrentDisabled) {
        const fallback: Language =
          langsConfig.defaultLang &&
          ((langsConfig.defaultLang === 'fr' && frEnabled) ||
           (langsConfig.defaultLang === 'ar' && arEnabled) ||
           (langsConfig.defaultLang === 'en' && enEnabled))
            ? langsConfig.defaultLang
            : frEnabled ? 'fr' : arEnabled ? 'ar' : 'en';
        setLang(fallback);
      }
    }
  }, [content.settings?.languages, lang]);

  // Theme synchronization (Light / Dark Mode)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.body.classList.remove('light');
      }
      if (isHydratedRef.current) {
        try {
          localStorage.setItem('md_theme', theme);
        } catch (e) {}
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handlePrintInvoice = (order: Order) => {
    setInvoiceOrder(order);
    setIsInvoiceOpen(true);
  };

  const handlePrintReceipt = (order: Order) => {
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  // Flash Countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const d = Math.floor(diff / 864e5);
      const h = Math.floor(diff / 36e5) % 24;
      const m = Math.floor(diff / 6e4) % 60;
      const s = Math.floor(diff / 1e3) % 60;
      setCountdown({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Selected product object
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  // Computed multiple images list for selected product
  const selectedProductImages = useMemo(() => {
    if (!selectedProduct) return [];
    if (Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0) {
      return selectedProduct.images.filter(Boolean);
    }
    if (selectedProduct.img) {
      return [selectedProduct.img];
    }
    return [
      `https://picsum.photos/seed/${selectedProduct.seed}/900/1125`,
      `https://picsum.photos/seed/${selectedProduct.seed}-detail/900/1125`,
      `https://picsum.photos/seed/${selectedProduct.seed}-porte/900/1125`,
    ];
  }, [selectedProduct]);

  // Video embed parser helper
  const parseVideoUrl = (url?: string) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;

    const ytMatch = trimmed.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    if (ytMatch && ytMatch[1]) {
      return { type: 'youtube' as const, embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}` };
    }

    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return { type: 'vimeo' as const, embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&muted=1` };
    }

    return { type: 'direct' as const, embedUrl: trimmed };
  };

  // Selection handler to reset media state cleanly
  const handleSelectProduct = (id: number) => {
    setSelectedProductId(id);
    setActiveMediaMode('photos');
    setActivePhotoIndex(0);
    setActiveImageSrc('');
    setProductQty(1);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate discounted promo price for flash sales
  const getPromoPrice = (productId: number) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return 0;
    const f = flash.find((x) => x.id === productId);
    return f ? Math.round(p.price * (1 - f.pct / 100)) : p.price;
  };

  // Cart operations
  const handleAddToCart = (id: number, qty = 1, priceOverride?: number) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const itemPrice = priceOverride ?? p.price;

    triggerAddToCartBlur(id);

    setCart((prev) => {
      const existing = prev.find((it) => it.id === id);
      if (existing) {
        return prev.map((it) => (it.id === id ? { ...it, qty: it.qty + qty } : it));
      }
      return [...prev, { id, qty, price: itemPrice }];
    });

    const loc = p ? getProductLocalized(p, lang) : null;
    const name = loc ? loc.name : p.name;
    showToast(`${name} ${t('toast_added')}`);
  };

  const handleUpdateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.qty + delta;
            return nextQty > 0 ? { ...it, qty: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
  };

  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(t('toast_fav_rm'));
        return prev.filter((x) => x !== id);
      }
      showToast(t('toast_fav_add'));
      return [...prev, id];
    });
  };

  // Checkout totals
  const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const discountAmount = checkoutData.appliedDiscount
    ? Math.round(subtotal * (checkoutData.appliedDiscount / 100))
    : 0;
  const subAfterDiscount = subtotal - discountAmount;
  const shippingFee =
    cart.length > 0
      ? subAfterDiscount >= content.settings.freeShippingThreshold
        ? 0
        : content.settings.shippingCost
      : 0;
  const codFee = checkoutData.pay === 'cod' && cart.length > 0 ? content.settings.codFee : 0;
  const giftOptionFee =
    isGiftPackaging && content.settings.boosters?.enableGiftOption !== false
      ? (content.settings.boosters?.giftOptionPrice !== undefined ? content.settings.boosters.giftOptionPrice : 35)
      : 0;
  const finalTotal = subAfterDiscount + shippingFee + codFee + giftOptionFee;

  // Apply promo code (supports both VIP code and Exit-Intent Booster promo code)
  const handleApplyPromo = (overrideCode?: unknown) => {
    const code = (typeof overrideCode === 'string' ? overrideCode : checkoutData.promo).trim().toUpperCase();
    const vipCode = (content.settings.promoCode || '').toUpperCase();
    const exitCode = (content.settings.boosters?.exitIntentPromoCode || 'BIENVENUE10').toUpperCase();

    if (code && code === vipCode) {
      setCheckoutData((prev) => ({
        ...prev,
        promo: code,
        appliedDiscount: content.settings.promoDiscountPct,
      }));
      showToast(`Code ${code} appliqué : −${content.settings.promoDiscountPct} % ✦`);
    } else if (code && code === exitCode) {
      const discount = content.settings.boosters?.exitIntentDiscountPct || 10;
      setCheckoutData((prev) => ({
        ...prev,
        promo: code,
        appliedDiscount: discount,
      }));
      showToast(`Offre Privilège ${code} appliquée : −${discount} % ✦`);
    } else {
      setCheckoutData((prev) => ({ ...prev, appliedDiscount: 0 }));
      showToast(t('toast_invalid'));
    }
  };

  // Submit Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast(t('cart_empty'));
      return;
    }

    const payLabels: Record<string, string> = {
      cod: lang === 'en' ? 'Cash on Delivery' : (lang === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'),
      bank: lang === 'en' ? 'Bank Transfer' : (lang === 'ar' ? 'تحويل بنكي' : 'Virement bancaire'),
      applepay: 'Apple Pay',
      googlepay: 'Google Pay',
      paypal: 'PayPal',
      wa: lang === 'en' ? 'WhatsApp Order' : (lang === 'ar' ? 'الدفع عبر واتساب' : 'Paiement via WhatsApp'),
    };

    const orderInfo = generateNewOrderInfo();
    const newOrder: Order = {
      id: orderInfo.id,
      num: orderInfo.num,
      date: orderInfo.date,
      items: cart.map((it) => {
        const p = products.find((x) => x.id === it.id);
        const loc = p ? getProductLocalized(p, lang) : null;
        return {
          id: it.id,
          qty: it.qty,
          price: it.price,
          name: loc ? loc.name : `Article #${it.id}`,
        };
      }),
      sub: subtotal,
      disc: discountAmount,
      ship: shippingFee,
      cod: codFee,
      total: finalTotal,
      payMethod: payLabels[checkoutData.pay] || 'COD',
      email: checkoutData.email,
      name: `${checkoutData.fname} ${checkoutData.lname}`.trim(),
      phone: checkoutData.phone,
      street: checkoutData.street,
      city: checkoutData.city,
      status: 'reçue',
    };

    try {
      // POST to backend API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const saved = await res.json();
        setOrders((prev) => [saved, ...prev]);
        setLastPlacedOrder(saved);
      } else {
        setOrders((prev) => [newOrder, ...prev]);
        setLastPlacedOrder(newOrder);
      }
    } catch (err) {
      setOrders((prev) => [newOrder, ...prev]);
      setLastPlacedOrder(newOrder);
    }

    // Automated notification to configured store admin email, Telegram bot, or WhatsApp
    fetch('/api/notifications/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: newOrder,
        settings: content.settings.notifications,
      }),
    }).catch((notifErr) => console.error('Automated order notification error:', notifErr));

    // If WhatsApp payment selected, open WhatsApp conversation
    if (checkoutData.pay === 'wa') {
      const itemsList = newOrder.items
        .map((it) => `• ${it.name} x${it.qty} = ${it.price * it.qty} DH`)
        .join('\n');
      const waMsg = encodeURIComponent(
        `✦ ${lang === 'en' ? 'New Order Maison Ovelzya' : (lang === 'ar' ? 'طلب جديد أوفيلزيا' : 'Nouvelle commande Maison Ovelzya')} ${newOrder.num}\n` +
          `Client: ${newOrder.name} (${newOrder.phone})\n` +
          `Ville: ${newOrder.city}\n` +
          `${itemsList}\n` +
          `Total: ${newOrder.total} DH`
      );
      window.open(`https://wa.me/${content.settings.waNumber}?text=${waMsg}`, '_blank', 'noopener');
    }

    setCart([]);
    setActiveView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tracking query submit
  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackQuery.trim().toUpperCase();
    if (!query) return;

    try {
      const res = await fetch(`/api/orders?num=${encodeURIComponent(query)}`);
      if (res.ok) {
        const order = await res.json();
        setTrackedOrder(order);
        setTrackError(false);
        return;
      }
    } catch (err) {}

    // Fallback to local search
    const local = orders.find((o) => o.num.toUpperCase() === query);
    if (local) {
      setTrackedOrder(local);
      setTrackError(false);
    } else {
      setTrackedOrder(null);
      setTrackError(true);
    }
  };

  // Contact form submit
  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      date: new Date().toISOString(),
      name: contactForm.name,
      email: contactForm.email,
      subject: contactForm.subject,
      message: contactForm.message,
      read: false,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg),
      });
      if (res.ok) {
        const saved = await res.json();
        setContacts((prev) => [saved, ...prev]);
      } else {
        setContacts((prev) => [newMsg, ...prev]);
      }
    } catch (err) {
      setContacts((prev) => [newMsg, ...prev]);
    }

    showToast(t('toast_contact'));
    setContactForm({
      name: '',
      email: '',
      subject: 'Question sur un produit',
      message: '',
    });
  };

  // Admin Actions via API
  const handleAdminUpdateProduct = async (updated: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      }
    } catch (e) {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  const handleAdminCreateProduct = async (newProd: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
      }
    } catch (e) {
      const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
      const fallback = { ...newProd, id: maxId + 1 } as Product;
      setProducts((prev) => [fallback, ...prev]);
    }
  };

  const handleAdminDeleteProduct = async (id: number) => {
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFlash((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAdminDeleteOrder = async (id: string) => {
    try {
      await fetch(`/api/orders?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setOrders((prev) => prev.filter((o) => o.id !== id && o.num !== id));
    } catch (e) {
      setOrders((prev) => prev.filter((o) => o.id !== id && o.num !== id));
    }
  };

  const handleAdminDeleteContact = async (id: string) => {
    try {
      await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleAdminReorderProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: true, products: newProducts }),
      });
    } catch (e) {
      // silent fallback
    }
  };

  const handleAdminUpdateContent = async (updatedContent: Partial<SiteContent>) => {
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        if (typeof window !== 'undefined' && data.settings?.customLogoUrl !== undefined) {
          if (data.settings.customLogoUrl) {
            localStorage.setItem('ovelzya_custom_logo', data.settings.customLogoUrl);
          } else {
            localStorage.removeItem('ovelzya_custom_logo');
          }
          window.dispatchEvent(new CustomEvent('ovelzya_logo_updated', { detail: data.settings.customLogoUrl || null }));
        }
      }
    } catch (e) {
      setContent((prev) => ({
        ...prev,
        ...updatedContent,
        settings: { ...prev.settings, ...(updatedContent.settings || {}) },
      }));
    }
  };

  const handleAdminUpdateFlash = async (updatedFlash: FlashSaleItem[]) => {
    try {
      const res = await fetch('/api/flash', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFlash),
      });
      if (res.ok) {
        const data = await res.json();
        setFlash(data);
      }
    } catch (e) {
      setFlash(updatedFlash);
    }
  };

  const handleAdminUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        if (trackedOrder && trackedOrder.id === orderId) setTrackedOrder(updated);
      }
    } catch (e) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }
  };

  const handleAdminMarkContactRead = async (id: string, read: boolean) => {
    try {
      await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read }),
      });
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read } : c)));
    } catch (e) {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read } : c)));
    }
  };

  const handleAdminResetData = async () => {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les données aux valeurs de démonstration ?')) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.store.products);
          setFlash(data.store.flash);
          setContent(data.store.content);
          setOrders(data.store.orders);
          setContacts(data.store.contacts);
          showToast('Données réinitialisées avec succès ✦');
        }
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
        setFlash(INITIAL_FLASH);
        setContent(INITIAL_CONTENT);
        setOrders(INITIAL_ORDERS);
        setContacts(INITIAL_CONTACTS);
        showToast('Données réinitialisées localement ✦');
      }
    }
  };

  // Client Management Handlers
  const handleUpdateClientStatus = async (id: string, status: 'active' | 'suspended') => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setClients((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
        showToast(
          status === 'active'
            ? 'Compte client réactivé avec succès ✦'
            : 'Compte client suspendu ✦'
        );
      }
    } catch (e) {
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.id !== id));
        showToast('Compte client supprimé ✦');
      } else {
        const err = await res.json();
        showToast(err.error || 'Erreur lors de la suppression');
      }
    } catch (e) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleCreateClient = async (data: { name: string; email: string; phone?: string; city?: string }) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...data }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.user) {
          setClients((prev) => [result.user, ...prev]);
        }
      }
    } catch (e) {
      console.warn('Error creating client:', e);
    }
  };

  const handleUpdateUser = async (userUpdate: Partial<RegisteredUser> & { id: string }) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userUpdate),
      });
      if (res.ok) {
        const updated = await res.json();
        setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        if (currentUser?.id === updated.id) {
          const merged = { ...currentUser, ...updated };
          setCurrentUser(merged);
          try {
            localStorage.setItem('md_user_store', JSON.stringify(merged));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('Error updating user:', e);
    }
  };

  const fetchUsers = async () => {
    try {
      const userRes = await fetch('/api/users');
      if (userRes.ok) {
        const userData = await userRes.json();
        if (Array.isArray(userData)) setClients(userData);
      }
    } catch (e) {
      console.warn('Error fetching users:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('md_user_store');
    } catch (e) {}
    setIsAdminOpen(false);
    showToast('Session fermée ✦');
  };

  // Filtered and sorted products for Collection page
  const displayedCollection = useMemo(() => {
    let list = products.filter((p) => filterCat === 'Tous' || p.cat === filterCat);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.name_ar.includes(q) ||
          p.cat.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);
    else if (sortBy === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'stock') list.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    else if (sortBy === 'rating') list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    return list;
  }, [products, filterCat, searchQuery, sortBy]);

  // Featured products for Home page
  const homeFeatured = useMemo(
    () => [1, 5, 9, 20].map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[],
    [products]
  );

  return (
    <div className={`min-h-screen bg-[#0d0d0d] text-[#f4f1ea] selection:bg-[#d4af37] selection:text-black pb-16 lg:pb-0 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#d4af37] text-black font-semibold text-xs sm:text-sm px-5 py-3 rounded shadow-2xl animate-toast flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        lang={lang}
        setLang={setLang}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cart.reduce((s, it) => s + it.qty, 0)}
        openCart={() => setIsCartOpen(true)}
        openAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        theme={theme}
        toggleTheme={toggleTheme}
        wishlistCount={wishlist.length}
        customLogoUrl={content.settings?.customLogoUrl}
        languagesConfig={content.settings?.languages}
      />

      {/* Main Content View Switcher */}
      <main className="pt-24 pb-12">
        {/* ============================================================ */}
        {/* 1. ACCUEIL (HOME VIEW) */}
        {/* ============================================================ */}
        {activeView === 'home' && (
          <div>
            {/* HERO SECTION */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden border-b border-[rgba(212,175,55,0.2)] hero-section">
              <img
                src={content.hero.img || '/images/jewelry_hero_bg.jpg'}
                alt="Ovelzya Haute Joaillerie & Maroquinerie"
                className="absolute inset-0 w-full h-full object-cover saturate-[0.9] contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
              <div
                className={`absolute inset-0 hero-gradient-overlay bg-gradient-to-r ${
                  lang === 'ar'
                    ? 'from-[#0a0a0a]/95 via-[#0a0a0a]/60 to-[#0a0a0a]/40'
                    : 'from-[#0a0a0a]/95 via-[#0a0a0a]/60 to-[#0a0a0a]/40'
                }`}
              />

              <div className="wrap relative z-10 py-20 sm:py-28">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.08] max-w-4xl">
                  <span>
                    {lang === 'ar'
                      ? content.hero.h1_ar
                      : (lang === 'en'
                      ? (content.hero.h1_en || t('hero_h1'))
                      : content.hero.h1_fr)}
                  </span>
                  <br />
                  <em className="text-[#d4af37] not-italic font-medium">
                    {lang === 'ar'
                      ? content.hero.h1_em_ar
                      : (lang === 'en'
                      ? (content.hero.h1_em_en || t('hero_h1_em'))
                      : content.hero.h1_em_fr)}
                  </em>
                </h1>

                <p className="max-w-xl text-[#cfcbc2] text-base sm:text-lg font-light mt-6 mb-8 leading-relaxed">
                  {lang === 'ar'
                    ? content.hero.p_ar
                    : (lang === 'en'
                    ? (content.hero.p_en || t('hero_p'))
                    : content.hero.p_fr)}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setActiveView('collection');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.18em] transition rounded shadow-lg shadow-[#d4af37]/20 cursor-pointer"
                  >
                    {t('hero_cta1')}
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('promos');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-transparent hover:bg-[#d4af37]/10 text-white hover:text-[#d4af37] border border-[rgba(212,175,55,0.4)] font-semibold text-xs uppercase tracking-[0.18em] transition rounded cursor-pointer"
                  >
                    {t('hero_cta2')}
                  </button>
                </div>
              </div>

              {/* Float Scroll Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-[#9a958a] animate-float">
                ↓
              </div>
            </section>

            {/* CONTINUOUS MARQUEE */}
            <div className="border-y border-[rgba(212,175,55,0.25)] bg-[#0a0a0a] overflow-hidden py-3.5">
              <div className="animate-marquee whitespace-nowrap">
                {(
                  (lang === 'ar' ? content.marquee.ar : (lang === 'en' ? (content.marquee.en || t('marquee')) : content.marquee.fr)) +
                  ' ✦ ' +
                  (lang === 'ar' ? content.marquee.ar : (lang === 'en' ? (content.marquee.en || t('marquee')) : content.marquee.fr))
                )
                  .split('✦')
                  .filter((s) => s.trim())
                  .map((chunk, idx) => (
                    <span
                      key={idx}
                      className="px-6 text-xs font-semibold tracking-[0.2em] text-[#d4af37] uppercase inline-block"
                    >
                      {chunk.trim()} ✦
                    </span>
                  ))}
              </div>
            </div>

            {/* SAVOIR-FAIRE / CRAFT & STATS SECTION */}
            <section className="wrap py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-xs font-semibold tracking-[0.26em] uppercase text-[#d4af37] block mb-3">
                  {t('sec_craft_t')}
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-white leading-tight mb-6">
                  {lang === 'ar' ? content.craft.h2_ar : (lang === 'en' ? (content.craft.h2_en || t('craft_title')) : content.craft.h2_fr)}
                </h2>
                <p className="text-[#9a958a] font-light text-base leading-relaxed mb-4">
                  {lang === 'ar' ? content.craft.p1_ar : (lang === 'en' ? (content.craft.p1_en || t('craft_p1')) : content.craft.p1_fr)}
                </p>
                <p className="text-[#9a958a] font-light text-base leading-relaxed mb-6">
                  {lang === 'ar' ? content.craft.p2_ar : (lang === 'en' ? (content.craft.p2_en || t('craft_p2')) : content.craft.p2_fr)}
                </p>
                <button
                  onClick={() => {
                    setActiveView('materials');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs uppercase tracking-[0.16em] text-[#d4af37] border-b border-[rgba(212,175,55,0.4)] pb-1 hover:border-[#d4af37] transition inline-block font-semibold"
                >
                  {t('sec_craft_link')}
                </button>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 gap-px bg-[rgba(212,175,55,0.25)] border border-[rgba(212,175,55,0.25)]">
                <div className="bg-[#0d0d0d] p-8 text-center">
                  <b className="font-serif text-4xl sm:text-5xl font-semibold text-[#d4af37] block mb-1">
                    316L
                  </b>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#9a958a]">
                    {t('stat_316l')}
                  </span>
                </div>
                <div className="bg-[#0d0d0d] p-8 text-center">
                  <b className="font-serif text-4xl sm:text-5xl font-semibold text-[#d4af37] block mb-1">
                    18K
                  </b>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#9a958a]">
                    {t('stat_18k')}
                  </span>
                </div>
                <div className="bg-[#0d0d0d] p-8 text-center">
                  <b className="font-serif text-4xl sm:text-5xl font-semibold text-[#d4af37] block mb-1">
                    100%
                  </b>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#9a958a]">
                    {t('stat_hypo')}
                  </span>
                </div>
                <div className="bg-[#0d0d0d] p-8 text-center">
                  <b className="font-serif text-4xl sm:text-5xl font-semibold text-[#d4af37] block mb-1">
                    24
                  </b>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#9a958a]">
                    {t('stat_garantie')}
                  </span>
                </div>
              </div>
            </section>

            {/* FEATURED PIECES SHOWCASE */}
            <section className="wrap py-16">
              <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-2">
                    {t('nav_collection')}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-serif text-white font-semibold">
                    {t('col_h2')}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setActiveView('collection');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs uppercase tracking-[0.16em] text-[#d4af37] border-b border-[rgba(212,175,55,0.4)] pb-1 hover:border-[#d4af37] transition font-semibold"
                >
                  {lang === 'en' ? 'View all collection →' : (lang === 'ar' ? 'عرض التشكيلة كاملة ←' : 'Voir toute la collection →')}
                </button>
              </div>

              {/* 4 Feature cards - 2 cols on mobile, 4 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {homeFeatured.map((p) => {
                  const loc = getProductLocalized(p, lang);
                  const name = loc.name;
                  const cat = loc.cat;
                  const badge = loc.badge;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.id)}
                      className="group bg-[#151515] border border-[#262626] hover:border-[#d4af37] transition duration-300 rounded overflow-hidden cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/5] bg-[#111] overflow-hidden">
                        <img
                          src={p.img || `https://picsum.photos/seed/${p.seed}/600/750`}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.seed}/600/750`;
                          }}
                        />
                        {blurredProductIds[p.id] && (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center z-20 animate-fade-in pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold text-lg shadow-xl mb-1.5 ring-2 ring-white/30">
                              ✓
                            </div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/90 px-3 py-1 rounded-full shadow border border-[#d4af37]/50">
                              Ajouté au panier !
                            </span>
                          </div>
                        )}
                        {badge && (
                          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#d4af37] text-black text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm shadow">
                            {badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p.id, 1);
                          }}
                          className="absolute bottom-0 inset-x-0 bg-[#d4af37] text-black text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2 sm:py-3 sm:translate-y-full group-hover:translate-y-0 transition duration-300 cursor-pointer shadow-md"
                        >
                          {t('quick')}
                        </button>
                      </div>

                      <div className="p-3 sm:p-5">
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#9a958a] block truncate">
                          {cat}
                        </span>
                        <h3 className="font-serif text-sm sm:text-lg text-white font-semibold mt-1 truncate">
                          {name}
                        </h3>
                        <div className="flex items-center justify-between mt-2 sm:mt-3 flex-wrap gap-1">
                          <span className="font-serif text-[#d4af37] font-bold text-sm sm:text-base">
                            {p.price.toLocaleString('fr-FR')} DH
                          </span>
                          <span className="text-[10px] sm:text-xs text-[#9a958a] flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#d4af37] text-[#d4af37]" />
                            {p.rating.toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* WELCOME DISCOUNT CALL-TO-ACTION BAND */}
            <section className="wrap py-20">
              <div className="border border-[rgba(212,175,55,0.3)] bg-gradient-to-b from-[rgba(212,175,55,0.12)] to-transparent rounded-lg p-12 text-center">
                <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-3">
                  {t('sec_cta_t')}
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-white font-semibold">
                  {t('sec_cta_h1')} <em className="text-[#d4af37] not-italic">{t('sec_cta_h1_em')}</em>
                </h2>
                <p className="text-[#9a958a] max-w-lg mx-auto text-sm sm:text-base mt-4 mb-8 font-light">
                  {t('sec_cta_p')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setActiveView('collection');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.18em] transition rounded"
                  >
                    {t('sec_cta_btn')}
                  </button>
                  <span className="border border-dashed border-[#d4af37] text-[#d4af37] text-xs font-mono font-bold tracking-widest px-6 py-3 rounded select-all">
                    {t('code')}: {content.settings.promoCode}
                  </span>
                </div>
              </div>
            </section>

            {/* 1.6 MAISON OVELZYA OFFICIAL SOCIAL MEDIA CHANNELS */}
            <HomeSocialChannels
              lang={lang}
              waNumber={content.settings?.waNumber || '+212620000000'}
              socialIcons={content.settings?.socialIcons}
              socialLinks={content.settings?.socialLinks}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. COLLECTION CATALOG */}
        {/* ============================================================ */}
        {activeView === 'collection' && (
          <section className="wrap py-8">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-1">
                {t('nav_collection')}
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif text-white font-semibold">
                {t('col_h2')}
              </h1>
            </div>

            {/* Flash Sale Banner Link */}
            <div
              onClick={() => {
                setActiveView('promos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-4 border border-[#d4af37] bg-gradient-to-r from-[#d4af37]/15 to-[#d4af37]/5 p-4 sm:p-5 rounded mb-8 cursor-pointer hover:bg-[#d4af37]/20 transition"
            >
              <Zap className="w-7 h-7 text-amber-400 animate-pulse shrink-0" />
              <div className="flex-1">
                <b className="font-serif text-base sm:text-lg text-[#d4af37] block">
                  {lang === 'ar' ? content.flashBanner.title_ar : (lang === 'en' ? (content.flashBanner.title_en || t('flash_h2')) : content.flashBanner.title_fr)}
                </b>
                <span className="text-xs text-[#9a958a]">
                  {lang === 'ar' ? content.flashBanner.sub_ar : (lang === 'en' ? (content.flashBanner.sub_en || t('flash_sub')) : content.flashBanner.sub_fr)}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-[#d4af37]" />
            </div>

            {/* Category Chips and Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              {/* Category Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                {['Tous', 'Colliers', 'Bracelets', 'Bagues', "Boucles d'oreilles", 'Ensembles', 'Sacs'].map(
                  (c) => {
                    const count =
                      c === 'Tous' ? products.length : products.filter((x) => x.cat === c).length;
                    const catLabel = getCategoryLabel(c, lang);

                    return (
                      <button
                        key={c}
                        onClick={() => {
                          setFilterCat(c);
                          setDisplayLimit(8);
                        }}
                        className={`px-4 py-2.5 rounded text-xs uppercase tracking-wider transition whitespace-nowrap ${
                          filterCat === c
                            ? 'bg-[#d4af37] text-black font-semibold'
                            : 'border border-[#262626] bg-[#141414] text-[#f4f1ea] hover:border-[#d4af37] hover:text-[#d4af37]'
                        }`}
                      >
                        {catLabel} <small className="opacity-60 ml-1">({count})</small>
                      </button>
                    );
                  }
                )}
              </div>

              {/* Search & Sort Tools */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#9a958a]" />
                  <input
                    type="text"
                    placeholder={t('ph_search')}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setDisplayLimit(8);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#2a2a2a] rounded text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#121212] border border-[#2a2a2a] text-xs text-[#cfcbc2] rounded px-3 py-2 focus:border-[#d4af37] focus:outline-none cursor-pointer"
                >
                  <option value="feat">{t('sort_feat')}</option>
                  <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : (lang === 'en' ? 'Newest First' : 'Nouveautés d’abord')}</option>
                  <option value="asc">{t('sort_asc')}</option>
                  <option value="desc">{t('sort_desc')}</option>
                  <option value="name-asc">{lang === 'ar' ? 'الاسم : أ - ي' : 'Nom : A à Z'}</option>
                  <option value="name-desc">{lang === 'ar' ? 'الاسم : ي - أ' : 'Nom : Z à A'}</option>
                  <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً' : 'Mieux notés'}</option>
                  <option value="stock">{lang === 'ar' ? 'توفر المخزون' : 'Stock disponible'}</option>
                </select>
              </div>
            </div>

            {/* Counter text */}
            <p className="text-xs text-[#9a958a] mb-6">
              {displayedCollection.length} {t('count_pieces_p')} —{' '}
              {lang === 'en' ? 'Showing ' : (lang === 'ar' ? 'عرض ' : 'Affichage de ')}
              {Math.min(displayLimit, displayedCollection.length)} {t('shown_of_p')}
            </p>

            {/* Products Grid - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {displayedCollection.slice(0, displayLimit).map((p) => {
                const loc = getProductLocalized(p, lang);
                const name = loc.name;
                const cat = loc.cat;
                const badge = loc.badge;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
                    className="group bg-[#151515] border border-[#262626] hover:border-[#d4af37] transition duration-300 rounded overflow-hidden cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/5] bg-[#111] overflow-hidden">
                      <img
                        src={p.img || `https://picsum.photos/seed/${p.seed}/600/750`}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.seed}/600/750`;
                        }}
                      />
                      {blurredProductIds[p.id] && (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center z-20 animate-fade-in pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold text-lg shadow-xl mb-1.5 ring-2 ring-white/30">
                            ✓
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/90 px-3 py-1 rounded-full shadow border border-[#d4af37]/50">
                            Ajouté au panier !
                          </span>
                        </div>
                      )}
                      {badge && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#d4af37] text-black text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm shadow">
                          {badge}
                        </span>
                      )}

                      {/* Media indicators & Share button */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-1.5">
                        {Array.isArray(p.images) && p.images.length > 1 && (
                          <span className="bg-black/75 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10 shadow pointer-events-none">
                            <Camera className="w-2.5 h-2.5 text-[#d4af37]" />
                            {p.images.length}
                          </span>
                        )}
                        {p.video && (
                          <span className="bg-purple-950/80 backdrop-blur-sm text-purple-200 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-800/40 shadow pointer-events-none">
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span className="hidden sm:inline">Vidéo</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenShare(p);
                          }}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black flex items-center justify-center transition border border-white/10 shadow cursor-pointer"
                          title="Partager sur vos réseaux sociaux"
                          aria-label="Partager"
                        >
                          <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(p.id, 1);
                        }}
                        className="absolute bottom-0 inset-x-0 bg-[#d4af37] text-black text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2 sm:py-3 sm:translate-y-full group-hover:translate-y-0 transition duration-300 cursor-pointer shadow-md"
                      >
                        {t('quick')}
                      </button>
                    </div>

                    <div className="p-3 sm:p-5">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#9a958a] block truncate">
                        {cat}
                      </span>
                      <h3 className="font-serif text-sm sm:text-lg text-white font-semibold mt-1 truncate">
                        {name}
                      </h3>
                      <div className="flex items-center justify-between mt-2 sm:mt-3 flex-wrap gap-1">
                        <span className="font-serif text-[#d4af37] font-bold text-sm sm:text-base">
                          {p.price.toLocaleString('fr-FR')} DH
                        </span>
                        <span className="text-[10px] sm:text-xs text-[#9a958a] flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#d4af37] text-[#d4af37]" />
                          {p.rating.toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {displayedCollection.length > displayLimit && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 8)}
                  className="px-8 py-3.5 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-semibold text-xs uppercase tracking-[0.16em] transition rounded cursor-pointer"
                >
                  {t('more')} ({displayedCollection.length - displayLimit} {t('pieces_left')})
                </button>
              </div>
            )}
          </section>
        )}

        {/* ============================================================ */}
        {/* 3. FICHE PRODUIT DÉTAILLÉE */}
        {/* ============================================================ */}
        {activeView === 'product' && selectedProduct && (
          <section className="wrap py-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-[#9a958a] mb-8">
              <button
                onClick={() => setActiveView('home')}
                className="hover:text-[#d4af37] transition"
              >
                {t('crumb_home')}
              </button>
              <span>‹</span>
              <button
                onClick={() => setActiveView('collection')}
                className="hover:text-[#d4af37] transition"
              >
                {t('crumb_col')}
              </button>
              <span>‹</span>
              <span className="text-[#f4f1ea] truncate max-w-xs">
                {getProductLocalized(selectedProduct, lang).name}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Product Gallery & Media Showcase */}
              <div>
                {/* Media Switcher Tabs if product has video */}
                {selectedProduct.video && (
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setActiveMediaMode('photos')}
                      className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                        activeMediaMode === 'photos'
                          ? 'bg-[#d4af37] text-black shadow'
                          : 'bg-[#1a1a1a] text-[#aaa] hover:text-white border border-[#333]'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? `Photos (${selectedProductImages.length})` : (lang === 'ar' ? `الصور (${selectedProductImages.length})` : `Photos (${selectedProductImages.length})`)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaMode('video')}
                      className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                        activeMediaMode === 'video'
                          ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                          : 'bg-[#1a1a1a] text-purple-300 hover:text-white border border-purple-900/50'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'en' ? 'Jewel Video' : (lang === 'ar' ? 'فيديو القطعة' : 'Vidéo du bijou')}</span>
                    </button>
                  </div>
                )}

                {/* Main Media Stage */}
                <div className="relative aspect-[4/5] bg-[#141414] border border-[#2a2a2a] rounded overflow-hidden shadow-2xl group">
                  <div className="w-full h-full transition-all duration-300">
                    {activeMediaMode === 'video' && selectedProduct.video ? (
                      <div className="w-full h-full bg-black flex items-center justify-center relative">
                        {(() => {
                          const parsed = parseVideoUrl(selectedProduct.video);
                          if (!parsed) return null;
                          if (parsed.type === 'youtube' || parsed.type === 'vimeo') {
                            return (
                              <iframe
                                src={parsed.embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={selectedProduct.name}
                              />
                            );
                          }
                          return (
                            <video
                              src={parsed.embedUrl}
                              controls
                              autoPlay
                              loop
                              playsInline
                              className="w-full h-full object-contain bg-black"
                            />
                          );
                        })()}

                        <button
                          type="button"
                          onClick={() => setActiveMediaMode('photos')}
                          className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[11px] rounded border border-white/20 flex items-center gap-1 transition cursor-pointer"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Voir photos</span>
                        </button>
                      </div>
                    ) : (
                      <ProductImageZoom
                        src={
                          activeImageSrc ||
                          selectedProductImages[activePhotoIndex] ||
                          selectedProduct.img ||
                          `https://picsum.photos/seed/${selectedProduct.seed}/900/1125`
                        }
                        alt={selectedProduct.name}
                        fallbackSeed={selectedProduct.seed}
                        images={selectedProductImages}
                        currentIndex={activePhotoIndex}
                        onIndexChange={(idx) => {
                          setActivePhotoIndex(idx);
                          setActiveImageSrc(selectedProductImages[idx]);
                        }}
                        lang={lang}
                      />
                    )}
                  </div>

                  {/* Add to Cart Luxury Golden Confirmation (Crisp & Non-Blurry) */}
                  {blurredProductIds[selectedProduct.id] && (
                    <div className="absolute top-4 right-4 z-30 animate-fade-in pointer-events-none">
                      <div className="bg-black/90 text-white border border-[#d4af37] px-3.5 py-2 rounded-lg shadow-xl flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold text-xs">
                          ✓
                        </span>
                        <span className="text-xs font-serif font-bold text-[#d4af37]">
                          ✦ Ajouté au panier
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnails Row: All Photos + Video */}
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2">
                  {selectedProductImages.map((src, i) => {
                    const isSelected =
                      activeMediaMode === 'photos' &&
                      (activeImageSrc
                        ? activeImageSrc === src
                        : activePhotoIndex === i);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveMediaMode('photos');
                          setActivePhotoIndex(i);
                          setActiveImageSrc(src);
                        }}
                        className={`w-16 h-20 sm:w-20 sm:h-24 bg-[#161616] border rounded overflow-hidden transition cursor-pointer shrink-0 relative ${
                          isSelected
                            ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 shadow-md'
                            : 'border-[#2a2a2a] opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={src}
                          alt={`Vue ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedProduct.seed}-${i}/200/250`;
                          }}
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] font-mono px-1 rounded text-white/80">
                          {i + 1}
                        </span>
                      </button>
                    );
                  })}

                  {/* Video Thumbnail if available */}
                  {selectedProduct.video && (
                    <button
                      onClick={() => setActiveMediaMode('video')}
                      className={`w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-br from-purple-950 via-[#181818] to-black border rounded overflow-hidden transition cursor-pointer shrink-0 flex flex-col items-center justify-center gap-1 relative ${
                        activeMediaMode === 'video'
                          ? 'border-purple-400 ring-2 ring-purple-500/30'
                          : 'border-purple-900/50 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-600/80 flex items-center justify-center shadow">
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-purple-200 uppercase tracking-wider">
                        Vidéo
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Product Info & Purchase Controls */}
              <div className="space-y-6">
                {(() => {
                  const locP = getProductLocalized(selectedProduct, lang);
                  return (
                    <div>
                      <span className="text-xs uppercase tracking-[0.2em] text-[#9a958a] block">
                        {locP.cat}{' '}
                        {locP.badge ? `· ${locP.badge}` : ''}
                      </span>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white mt-1">
                        {locP.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-3 text-xs text-[#9a958a]">
                        <span className="text-[#d4af37] tracking-wider text-sm">
                          {'★'.repeat(Math.round(selectedProduct.rating))}
                        </span>
                        <span>
                          {selectedProduct.rating.toLocaleString('fr-FR')} / 5 ({selectedProduct.reviews}{' '}
                          {lang === 'en' ? 'verified reviews' : (lang === 'ar' ? 'تقييم مُثبَت' : 'avis vérifiés')})
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Price & SKU */}
                <div className="border-y border-[#262626] py-4">
                  <div className="text-3xl font-serif font-semibold text-[#d4af37]">
                    {selectedProduct.price.toLocaleString('fr-FR')} DH
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-[#9a958a] block mt-1">
                    SKU : MD-{String(selectedProduct.id).padStart(3, '0')}-OR
                  </span>
                </div>

                {/* Sales Booster: Urgency Badges & Live Viewers */}
                {content.settings.boosters?.enableUrgencyBadges !== false && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {selectedProduct.stock !== undefined &&
                      selectedProduct.stock <= (content.settings.boosters?.stockUrgencyThreshold || 5) && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-medium">
                        <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>
                          {lang === 'en'
                            ? `Only ${selectedProduct.stock} pieces left in our workshop`
                            : (lang === 'ar'
                            ? `بقي فقط ${selectedProduct.stock} قطع متوفرة في الورشة`
                            : `Plus que ${selectedProduct.stock} exemplaires disponibles en atelier`)}
                        </span>
                      </div>
                    )}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950/25 border border-amber-800/30 text-amber-300 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                      <span>
                        {lang === 'en'
                          ? '12 visitors are viewing this jewelry right now'
                          : (lang === 'ar'
                          ? '12 زبونة تشاهد هذه القطعة حالياً'
                          : '12 personnes consultent ce bijou en ce moment')}
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-[#cfcbc2] font-light leading-relaxed text-sm sm:text-base">
                  {getProductLocalized(selectedProduct, lang).desc}
                </p>

                {/* Quantity + Add + Buy Now */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-[#333] rounded">
                    <button
                      onClick={() => setProductQty((q) => Math.max(1, q - 1))}
                      className="w-12 h-12 flex items-center justify-center text-lg text-white hover:bg-[#d4af37] hover:text-black transition"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-sm font-semibold text-white">
                      {productQty}
                    </span>
                    <button
                      onClick={() => setProductQty((q) => Math.min(10, q + 1))}
                      className="w-12 h-12 flex items-center justify-center text-lg text-white hover:bg-[#d4af37] hover:text-black transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct.id, productQty);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 py-3.5 px-6 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.16em] transition rounded cursor-pointer"
                  >
                    {t('pp_add')}
                  </button>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct.id, productQty);
                      setActiveView('checkout');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="py-3.5 px-6 border border-[#d4af37] hover:bg-[#d4af37]/10 text-white hover:text-[#d4af37] font-semibold text-xs uppercase tracking-[0.16em] transition rounded cursor-pointer"
                  >
                    {t('buy_now')}
                  </button>
                </div>

                {/* Sales Booster: WhatsApp Direct Order Button */}
                {content.settings.boosters?.enableWhatsAppOrder !== false && (
                  <button
                    type="button"
                    onClick={() => {
                      const prodName = getProductLocalized(selectedProduct, lang).name;
                      const message = lang === 'en'
                        ? `Hello Ovelzya, I would like to order directly: *${prodName}* (Ref: OV-${String(selectedProduct.id).padStart(3, '0')}-OR, Price: ${selectedProduct.price} DH). Please assist me.`
                        : (lang === 'ar'
                        ? `مرحباً أوفيلزيا، أود طلب هذه القطعة مباشرة: *${prodName}* (المرجع: OV-${String(selectedProduct.id).padStart(3, '0')}-OR، السعر: ${selectedProduct.price} درهم). أرجو مساعدتي.`
                        : `Bonjour Ovelzya, je souhaite commander directement la pièce : *${prodName}* (Réf: OV-${String(selectedProduct.id).padStart(3, '0')}-OR, Prix: ${selectedProduct.price} DH). Merci de bien vouloir m'assister.`);
                      const wa = content.settings.waNumber || '212600000000';
                      window.open(`https://wa.me/${wa}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
                    }}
                    className="w-full py-3.5 px-4 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/50 text-emerald-400 hover:text-emerald-300 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-950/20"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>
                      {content.settings.boosters?.whatsAppButtonText ||
                        (lang === 'en' ? 'Order Directly via WhatsApp' : (lang === 'ar' ? 'الطلب الفوري والمباشر عبر واتساب' : 'Commander directement via WhatsApp'))}
                    </span>
                  </button>
                )}

                {/* Sales Booster: COD & Reassurance Badge */}
                {content.settings.boosters?.enableCodReassurance !== false && (
                  <div className="flex items-center gap-3 p-3.5 rounded bg-[#151515] border border-[#272727] text-xs text-[#cfcbc2]">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0" />
                    <div>
                      <span className="font-semibold text-white block text-xs">
                        {lang === 'en' ? 'Free Inspection on Delivery' : (lang === 'ar' ? 'المعاينة عند الاستلام مجاناً' : 'Contrôle à la livraison offert')}
                      </span>
                      <span className="text-[11px] text-[#9a958a] leading-tight block mt-0.5">
                        {lang === 'en'
                          ? 'Open your package and inspect the brilliance of your jewelry before paying cash.'
                          : (lang === 'ar'
                          ? 'افتحي طردكِ وتأكدي من بريق وجمال مجوهراتك قبل الدفع نقداً للموزع.'
                          : 'Ouvrez votre écrin et vérifiez la conformité du bijou avant de régler en espèces au livreur.')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions: Wishlist, Size Guide, Share */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleToggleWishlist(selectedProduct.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 border rounded text-xs transition cursor-pointer ${
                      wishlist.includes(selectedProduct.id)
                        ? 'border-red-500 text-red-400 bg-red-500/10'
                        : 'border-[#333] text-[#cfcbc2] hover:border-[#d4af37] hover:text-[#d4af37]'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        wishlist.includes(selectedProduct.id) ? 'fill-current' : ''
                      }`}
                    />
                    <span>{t('fav')}</span>
                  </button>

                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-[#333] hover:border-[#d4af37] text-[#cfcbc2] hover:text-[#d4af37] rounded text-xs transition cursor-pointer"
                  >
                    <span>{t('size_guide')}</span>
                  </button>

                  <button
                    onClick={() => handleOpenShare(selectedProduct)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-[#333] hover:border-[#d4af37] text-[#cfcbc2] hover:text-[#d4af37] rounded text-xs transition cursor-pointer"
                    title="Partager sur vos réseaux sociaux"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t('share')}</span>
                  </button>
                </div>

                {/* Specs Table */}
                <div className="border-t border-[#262626] pt-4 space-y-2">
                  {getProductLocalized(selectedProduct, lang).specs.map(
                    ([k, v], idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs py-1.5 border-b border-[#1f1f1f]"
                      >
                        <span className="text-[#9a958a]">{k}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    )
                  )}
                </div>

                {/* Detailed Accordions */}
                <div className="space-y-2 pt-2">
                  <details className="border border-[#262626] bg-[#141414] rounded p-3 text-xs">
                    <summary className="font-semibold uppercase tracking-wider text-white cursor-pointer select-none">
                      {t('acc_ship')}
                    </summary>
                    <p className="mt-3 text-[#9a958a] leading-relaxed font-light">
                      {t('acc_ship_body')}
                    </p>
                  </details>
                  <details className="border border-[#262626] bg-[#141414] rounded p-3 text-xs">
                    <summary className="font-semibold uppercase tracking-wider text-white cursor-pointer select-none">
                      {t('acc_care')}
                    </summary>
                    <p className="mt-3 text-[#9a958a] leading-relaxed font-light">
                      {t('acc_care_body')}
                    </p>
                  </details>
                </div>
              </div>
            </div>

            {/* CROSS-SELL & UPSELL SALES BOOSTER SECTION */}
            <ProductCrossSellUpsellSection
              currentProduct={selectedProduct}
              products={products}
              rules={content.settings.boosters?.promotionRules || []}
              lang={lang}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              blurredProductIds={blurredProductIds}
              enableCrossSell={content.settings.boosters?.enableCrossSell ?? true}
              enableUpsell={content.settings.boosters?.enableUpsell ?? true}
            />

            {/* CUSTOMER REVIEWS WITH PHOTOS & VERIFIED BADGES */}
            <CustomerReviewsSection
              productId={selectedProduct.id}
              products={products}
              reviews={reviews}
              onAddReview={handleAddReview}
              lang={lang}
            />
          </section>
        )}

        {/* ============================================================ */}
        {/* 4. OFFRES FLASH (PROMOS) */}
        {/* ============================================================ */}
        {activeView === 'promos' && (
          <section className="wrap py-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-[0.26em] text-amber-400 block mb-2">
                {t('promo_tag')}
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
                {t('promo_h1')} <em className="text-[#d4af37] not-italic">{t('promo_h1_em')}</em>
              </h1>
              <p className="text-[#9a958a] text-sm sm:text-base mt-4 font-light">{t('promo_p')}</p>

              {/* Animated Countdown */}
              <div className="mt-8 inline-flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider text-[#9a958a] mb-3">
                  {t('promo_ends')} :
                </span>
                <div className="flex gap-3">
                  <div className="border border-[#d4af37] bg-[#151515] p-3 min-w-[70px] rounded text-center">
                    <b className="font-serif text-3xl text-[#d4af37] block font-bold">
                      {countdown.d}
                    </b>
                    <small className="text-[10px] uppercase tracking-wider text-[#9a958a]">
                      {t('cd_days')}
                    </small>
                  </div>
                  <div className="border border-[#d4af37] bg-[#151515] p-3 min-w-[70px] rounded text-center">
                    <b className="font-serif text-3xl text-[#d4af37] block font-bold">
                      {countdown.h}
                    </b>
                    <small className="text-[10px] uppercase tracking-wider text-[#9a958a]">
                      {t('cd_hours')}
                    </small>
                  </div>
                  <div className="border border-[#d4af37] bg-[#151515] p-3 min-w-[70px] rounded text-center">
                    <b className="font-serif text-3xl text-[#d4af37] block font-bold">
                      {countdown.m}
                    </b>
                    <small className="text-[10px] uppercase tracking-wider text-[#9a958a]">
                      {t('cd_min')}
                    </small>
                  </div>
                  <div className="border border-[#d4af37] bg-[#151515] p-3 min-w-[70px] rounded text-center">
                    <b className="font-serif text-3xl text-[#d4af37] block font-bold">
                      {countdown.s}
                    </b>
                    <small className="text-[10px] uppercase tracking-wider text-[#9a958a]">
                      {t('cd_sec')}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Flash Sales Products Grid - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {flash.map((f) => {
                const p = products.find((x) => x.id === f.id);
                if (!p) return null;
                const loc = getProductLocalized(p, lang);
                const name = loc.name;
                const cat = loc.cat;
                const discountedPrice = Math.round(p.price * (1 - f.pct / 100));

                return (
                  <div
                    key={p.id}
                    className="group bg-[#151515] border border-[#262626] hover:border-[#d4af37] transition duration-300 rounded overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/5] bg-[#111] overflow-hidden">
                      <img
                        src={p.img || `https://picsum.photos/seed/${p.seed}/600/750`}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.seed}/600/750`;
                        }}
                      />
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#e05a4e] text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm shadow">
                        −{f.pct}%
                      </span>
                      <button
                        onClick={() => handleAddToCart(p.id, 1, discountedPrice)}
                        className="absolute bottom-0 inset-x-0 bg-[#d4af37] text-black text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2 sm:py-3 cursor-pointer shadow-md"
                      >
                        {t('promo_add')}
                      </button>
                    </div>

                    <div className="p-3 sm:p-5">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#9a958a] block truncate">
                        {cat}
                      </span>
                      <h3
                        onClick={() => handleSelectProduct(p.id)}
                        className="font-serif text-sm sm:text-lg text-white font-semibold mt-1 truncate hover:text-[#d4af37] cursor-pointer"
                      >
                        {name}
                      </h3>
                      <div className="flex items-center justify-between mt-2 sm:mt-3 flex-wrap gap-1">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <s className="text-[10px] sm:text-xs text-[#777] font-sans">
                            {p.price.toLocaleString('fr-FR')} DH
                          </s>
                          <span className="font-serif text-amber-400 font-bold text-sm sm:text-lg">
                            {discountedPrice.toLocaleString('fr-FR')} DH
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-[#9a958a] flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#d4af37] text-[#d4af37]" />
                          {p.rating.toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 5. MATÉRIAUX & NORMES (EDUCATIONAL MASTERCLASS) */}
        {/* ============================================================ */}
        {activeView === 'materials' && (
          <section className="wrap py-12 max-w-5xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#e8c878] text-[11px] uppercase tracking-[0.25em] font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {lang === 'en'
                    ? 'Fine Jewelry Metallurgy & Standards'
                    : lang === 'ar'
                    ? 'دليل المعادن والمعايير العالمية للمجوهرات'
                    : 'Science des Métaux & Haute Joaillerie'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight">
                {lang === 'en' ? (
                  <>
                    Understanding Materials. <em className="text-[#d4af37] not-italic">The Science of Eternity.</em>
                  </>
                ) : lang === 'ar' ? (
                  <>
                    افهم أسرار المادة. <em className="text-[#d4af37] not-italic">علم المجوهرات الأبدية.</em>
                  </>
                ) : (
                  <>
                    Comprendre les Matières. <em className="text-[#d4af37] not-italic">La Science de l&apos;Éternel.</em>
                  </>
                )}
              </h1>
              <p className="text-[#9a958a] text-sm sm:text-base max-w-3xl mx-auto font-light leading-relaxed">
                {lang === 'en'
                  ? 'Discover why Maison Ovelzya crafts exclusively in 316L surgical-grade stainless steel with 18-karat PVD atomic bonding, 5A cubic zirconia crystals, and genuine iridescent mother-of-pearl.'
                  : lang === 'ar'
                  ? 'اكتشف لماذا تبتكر دار أوفيلزيا مجوهراتها حصرياً بالفولاذ الجراحي 316L المطلي بالذهب عيار 18 بتفريغ الهواء PVD، وأحجار زركونيوم 5A فائقة النقاء، وعرق اللؤلؤ الطبيعي.'
                  : "Découvrez pourquoi la Maison Ovelzya façonne exclusivement ses pièces en acier chirurgical 316L sublimé d'or véritable 18K par dépôt sous vide PVD, d'oxydes de zirconium 5A et de nacre naturelle d'exception."}
              </p>
            </div>

            {/* 4 Guarantees Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl border border-[#2a2a2a] bg-[#141414] text-center space-y-2 hover:border-[#d4af37]/40 transition">
                <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">
                  {lang === 'en' ? '100% Waterproof' : lang === 'ar' ? 'مقاوم للماء 100%' : '100% Étanche'}
                </h2>
                <p className="text-[11px] text-[#9a958a]">
                  {lang === 'en'
                    ? 'Sea, shower, pool & perfumes without tarnishing'
                    : lang === 'ar'
                    ? 'البحر، الدوش، المسبح والعطور دون أي تأثير'
                    : 'Mer, piscine, douche & parfums sans aucune altération'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#2a2a2a] bg-[#141414] text-center space-y-2 hover:border-[#d4af37]/40 transition">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">
                  {lang === 'en' ? '18K PVD Real Gold' : lang === 'ar' ? 'ذهب 18K بتقنية PVD' : 'Or Véritable 18K PVD'}
                </h2>
                <p className="text-[11px] text-[#9a958a]">
                  {lang === 'en'
                    ? 'Atomic vacuum fusion at 400°C, 10x stronger'
                    : lang === 'ar'
                    ? 'اندماج ذري حراري تحت تفريغ الهواء، 10 أضعاف القوة'
                    : 'Fusion atomique sous vide à 400°C, 10x plus résistant'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#2a2a2a] bg-[#141414] text-center space-y-2 hover:border-[#d4af37]/40 transition">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">
                  {lang === 'en' ? 'Hypoallergenic' : lang === 'ar' ? 'مضاد للحساسية 100%' : 'Hypoallergénique'}
                </h2>
                <p className="text-[11px] text-[#9a958a]">
                  {lang === 'en'
                    ? 'EN 1811 & REACH certified, zero green skin'
                    : lang === 'ar'
                    ? 'مطابق لمعايير الاتحاد الأوروبي، بدون بقع خضراء'
                    : 'Normes EN 1811 & REACH UE, zéro trace verte'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#2a2a2a] bg-[#141414] text-center space-y-2 hover:border-[#d4af37]/40 transition">
                <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Gem className="w-5 h-5" />
                </div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">
                  {lang === 'en' ? '5A Grade Zirconia' : lang === 'ar' ? 'زركونيوم 5A ونورس' : 'Zirconium 5A & Nacre'}
                </h2>
                <p className="text-[11px] text-[#9a958a]">
                  {lang === 'en'
                    ? 'Diamond-like 2.15 refraction, hand set'
                    : lang === 'ar'
                    ? 'انكسار ضوئي مماثل للألماس 2.15 وترصيع يدوي'
                    : 'Éclat diamant 2.15, taillé laser & serti main'}
                </p>
              </div>
            </div>

            {/* Interactive Tab Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#2a2a2a] pb-4">
              {[
                { id: 'all', fr: 'Tout Explorer', ar: 'استكشاف الكل', en: 'Explore All' },
                { id: 'steel', fr: 'Acier 316L Chirurgical', ar: 'الفولاذ 316L', en: '316L Surgical Steel' },
                { id: 'pvd', fr: 'Or 18K & Procédé PVD', ar: 'الذهب وPVD', en: '18K Gold & PVD' },
                { id: 'gems', fr: 'Zirconium 5A & Nacre', ar: 'الزركونيوم والصدف', en: '5A Zirconia & Pearls' },
                { id: 'comparison', fr: 'Grand Comparatif Métaux', ar: 'مقارنة المعادن', en: 'Metals Comparison' },
                { id: 'care', fr: 'Normes & Entretien', ar: 'المعايير والعناية', en: 'Standards & Care' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMaterialFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition cursor-pointer ${
                    materialFilter === tab.id
                      ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                      : 'bg-[#181818] text-[#9a958a] hover:text-white border border-[#2a2a2a]'
                  }`}
                >
                  {lang === 'en' ? tab.en : lang === 'ar' ? tab.ar : tab.fr}
                </button>
              ))}
            </div>

            {/* SECTION 1: 316L SURGICAL STEEL */}
            {(materialFilter === 'all' || materialFilter === 'steel') && (
              <div className="space-y-6 border border-[#2a2a2a] bg-[#121212] p-6 sm:p-8 rounded-2xl">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block mb-1">
                      {lang === 'en' ? 'The Indestructible Core' : lang === 'ar' ? 'الجوهر غير القابل للتلف' : 'Le Cœur Inaltérable'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold flex items-center gap-2.5">
                      <span className="text-[#d4af37]">✦</span>
                      {lang === 'en'
                        ? '316L Surgical-Grade Stainless Steel'
                        : lang === 'ar'
                        ? 'الفولاذ المقاوم للصدأ الجراحي 316L'
                        : 'L’Acier Inoxydable Chirurgical 316L'}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#d4af37]/10 text-[#e8c878] text-[10px] font-mono border border-[#d4af37]/20 uppercase">
                      Grade L (Low Carbon)
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 uppercase">
                      ASTM F138
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#cfcbc2] leading-relaxed font-light">
                  {lang === 'en'
                    ? 'Unlike common fashion jewelry made of cheap brass or zinc alloys, Maison Ovelzya crafts all creations from authentic 316L surgical steel — the exact metallurgy trusted for luxury Swiss timepieces and orthopedic surgical implants.'
                    : lang === 'ar'
                    ? 'على عكس المجوهرات التجارية المصنوعة من النحاس الأصفر الرخيص أو الزنك المعرض للتآكل، تصوغ دار أوفيلزيا مجوهراتها من الفولاذ الجراحي 316L الأصلي المستخدم في الساعات السويسرية الفاخرة والغرسات الطبية الجراحية.'
                    : "Contrairement aux bijoux fantaisie ordinaires conçus en laiton ou en zamak corrosif, la Maison Ovelzya utilise exclusivement de l'acier chirurgical 316L — le même alliage noble sélectionné pour les garde-temps de haute horlogerie suisse et les implants médicaux les plus exigeants."}
                </p>

                {/* Metallurgy Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 bg-[#171717] border border-[#262626] rounded-xl">
                    <div className="text-[#d4af37] font-mono font-bold text-base">Cr (17,5%)</div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {lang === 'en' ? 'Chromium Shield' : lang === 'ar' ? 'درع الكروم الواقي' : 'Bouclier de Chrome'}
                    </div>
                    <p className="text-[11px] text-[#9a958a] mt-1">
                      {lang === 'en'
                        ? 'Forms an invisible, self-healing oxide layer that prevents any rust formation.'
                        : lang === 'ar'
                        ? 'يشكل طبقة أكسيد واقية ذاتية الالتئام تمنع الصدأ تماماً.'
                        : "Crée une pellicule d'oxyde protectrice invisible et auto-cicatrisante contre la rouille."}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#171717] border border-[#262626] rounded-xl">
                    <div className="text-[#e8c878] font-mono font-bold text-base">Mo (2,5%)</div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {lang === 'en' ? 'Molybdenum Armor' : lang === 'ar' ? 'الموليبدنوم الفولاذي' : 'Molybdène Noble'}
                    </div>
                    <p className="text-[11px] text-[#9a958a] mt-1">
                      {lang === 'en'
                        ? 'The secret mineral that neutralizes salt sea water, chlorine, and acidic perspiration.'
                        : lang === 'ar'
                        ? 'المعدن النادر الذي يبطل ملوحة البحر والكلور والأحماض الناتجة عن العرق.'
                        : "Le secret qui bloque l'agression du sel de mer, du chlore et de la transpiration acide."}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#171717] border border-[#262626] rounded-xl">
                    <div className="text-emerald-400 font-mono font-bold text-base">Ni (12% Trapped)</div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {lang === 'en' ? 'Austenitic Matrix' : lang === 'ar' ? 'مصفوفة بلورية آمنة' : 'Matrice Cristalline'}
                    </div>
                    <p className="text-[11px] text-[#9a958a] mt-1">
                      {lang === 'en'
                        ? 'Molecularly locked in crystalline lattice; zero skin migration under EN 1811.'
                        : lang === 'ar'
                        ? 'محبوس جزيئياً في الشبكة البلورية؛ انعدام التسرب للجلد وفق المعيار الأوروبي EN 1811.'
                        : "Atomes emprisonnés dans le réseau moléculaire : 0 relargage sur la peau (norme EN 1811)."}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#171717] border border-[#262626] rounded-xl">
                    <div className="text-blue-400 font-mono font-bold text-base">L (&lt;0,03% C)</div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {lang === 'en' ? 'Low Carbon' : lang === 'ar' ? 'كربون شديد الانخفاض' : 'Ultra-Bas Carbone'}
                    </div>
                    <p className="text-[11px] text-[#9a958a] mt-1">
                      {lang === 'en'
                        ? 'The "L" guarantees immunity against intergranular cracking across decades.'
                        : lang === 'ar'
                        ? 'يمنع التصدع المجهري ويمنح المجوهرات عمراً طويلاً عبر السنين.'
                        : "Le suffixe « L » élimine la corrosion intergranulaire même après plusieurs décennies."}
                    </p>
                  </div>
                </div>

                {/* Why skin turns green callout */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3.5">
                  <AlertTriangle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#cfcbc2] leading-relaxed">
                    <strong className="text-white block mb-0.5 font-medium">
                      {lang === 'en'
                        ? 'Why does ordinary jewelry leave green marks on the skin?'
                        : lang === 'ar'
                        ? 'لماذا تترك المجوهرات العادية بقعاً خضراء على بشرتك؟'
                        : 'Pourquoi les bijoux fantaisie ordinaires laissent-ils des traces vertes sur la peau ?'}
                    </strong>
                    {lang === 'en'
                      ? 'In cheaper jewelry, copper and zinc react with sweat acids, producing copper carbonate (green patina). 316L stainless steel contains zero free copper or loose zinc: it is chemically inert and will never discolor your skin.'
                      : lang === 'ar'
                      ? 'في المجوهرات المقلدة، يتفاعل النحاس والزنك مع العرق ليشكل كربونات النحاس الخضراء. أما فولاذ 316L فلا يحتوي على نحاس حر، وهو خامل كيميائياً ولا يترك أي أثر على الإطلاق.'
                      : "Dans les bijoux bas de gamme, le cuivre et le laiton réagissent avec l'acidité de l'épiderme pour créer du carbonate de cuivre (vert-de-gris). L'acier 316L ne contient aucun cuivre réactif : il est chimiquement inerte et ne laissera jamais la moindre trace verte sur votre peau."}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: 18K PVD GOLD PLATING */}
            {(materialFilter === 'all' || materialFilter === 'pvd') && (
              <div className="space-y-6 border border-[#2a2a2a] bg-[#121212] p-6 sm:p-8 rounded-2xl">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block mb-1">
                      {lang === 'en' ? 'Vacuum Atomic Bonding' : lang === 'ar' ? 'الاندماج الذري تحت الفراغ' : 'Liaison Atomique Sous Vide'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold flex items-center gap-2.5">
                      <span className="text-[#d4af37]">✦</span>
                      {lang === 'en'
                        ? '18K Gold PVD (Physical Vapor Deposition)'
                        : lang === 'ar'
                        ? 'طلاء الذهب عيار 18 بتقنية PVD'
                        : 'Le Placage Or 18K par Procédé PVD'}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded bg-[#d4af37]/15 text-[#e8c878] text-xs font-semibold border border-[#d4af37]/30">
                    400°C Thermal Vacuum
                  </span>
                </div>

                <p className="text-sm text-[#cfcbc2] leading-relaxed font-light">
                  {lang === 'en'
                    ? 'Physical Vapor Deposition (PVD) represents the gold standard in aerospace and high luxury. Inside a high-temperature vacuum chamber at 400°C, 18K pure gold is ionized into high-energy plasma, fusing atom by atom directly onto the 316L steel substrate.'
                    : lang === 'ar'
                    ? 'تعتبر تقنية PVD (الترسيب الفيزيائي للبخار) أعلى معيار للجودة في صناعات الفضاء والمجوهرات السويسرية. داخل غرفة مفرغة عند 400 درجة مئوية، يتأين الذهب عيار 18 ليخترق سطح الفولاذ ذرةً بذرة.'
                    : "Le procédé PVD (Physical Vapor Deposition) est la technologie de pointe issue de l'aérospatiale et de la haute horlogerie. Dans une chambre sous vide thermique chauffée à 400°C, l'or véritable 18 carats est vaporisé en plasma ionisé pour fusionner atome par atome au cœur de l'acier."}
                </p>

                {/* Comparison PVD vs Classic Electroplating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#161616] border border-[#d4af37]/40 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#e8c878] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                        {lang === 'en' ? 'Maison Ovelzya 18K PVD' : lang === 'ar' ? 'تقنية PVD من أوفيلزيا' : 'PVD Or 18K Ovelzya'}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#e8c878]">
                        Excellence
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#cfcbc2]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#d4af37]">✓</span>
                        <span>
                          {lang === 'en'
                            ? 'Molecular atomic bond: will never peel, flake, or blister.'
                            : lang === 'ar'
                            ? 'رابطة ذرية جزيئية: لا تتقشر ولا تتفتت إطلاقاً.'
                            : "Liaison atomique moléculaire : ne s'écaille et ne pèle jamais."}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#d4af37]">✓</span>
                        <span>
                          {lang === 'en'
                            ? '10x harder and more scratch resistant than dipped gold baths.'
                            : lang === 'ar'
                            ? 'صلابة ومقاومة للخدوش تفوق أحواض الطلاء التقليدي بـ 10 أضعاف.'
                            : '10 fois plus résistant aux frottements et micro-rayures.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#d4af37]">✓</span>
                        <span>
                          {lang === 'en'
                            ? 'Immune to sea water, chlorine, hand sanitizers, and body oils.'
                            : lang === 'ar'
                            ? 'مقاوم لمياه البحر والكلور ومعقمات اليدين والعطور.'
                            : "Résistant à l'eau salée, au chlore, aux gels hydroalcooliques et parfums."}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#d4af37]">✓</span>
                        <span>
                          {lang === 'en'
                            ? 'Authentic 18-karat warm yellow or rose gold luster preserved over years.'
                            : lang === 'ar'
                            ? 'يحافظ على البريق الدافئ للذهب عيار 18 لسنوات طويلة.'
                            : "Éclat d'or 18 carats authentique et chaleureux préservé sur le long terme."}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-[#141414] border border-[#262626] space-y-3 opacity-80">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#888]">
                        {lang === 'en' ? 'Conventional Gold Bath' : lang === 'ar' ? 'الطلاء المائي التقليدي' : 'Galvanoplastie Traditionnelle'}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400">
                        {lang === 'en' ? 'Fragile' : lang === 'ar' ? 'سريع الزوال' : 'Fragile'}
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#888]">
                      <li className="flex items-start gap-2">
                        <span>✗</span>
                        <span>
                          {lang === 'en'
                            ? 'Ultra-thin superficial flash coat (0.1 micron) on cheap base metal.'
                            : lang === 'ar'
                            ? 'طبقة سطحية مجهرية رقيقة جداً (0.1 ميكرون) تتلاشى سريعاً.'
                            : 'Simple dorure « flash » (0,1 micron) déposée à froid sans fusion.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>✗</span>
                        <span>
                          {lang === 'en'
                            ? 'Wears away within weeks upon friction with clothing and skin.'
                            : lang === 'ar'
                            ? 'تتلاشى خلال أسابيع قليلة بسبب احتكاك الملابس والجلد.'
                            : "Disparaît en quelques semaines avec les frottements et la transpiration."}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>✗</span>
                        <span>
                          {lang === 'en'
                            ? 'Exposes underlying brass, quickly causing allergic rashes.'
                            : lang === 'ar'
                            ? 'تكشف النحاس الداخلي وتسبب تهيج البشرة وظهور البقع الخضراء.'
                            : "Met à nu le laiton sous-jacent, provoquant noircissement et allergies."}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: 5A ZIRCONIA & NATURAL MOTHER-OF-PEARL */}
            {(materialFilter === 'all' || materialFilter === 'gems') && (
              <div className="space-y-6 border border-[#2a2a2a] bg-[#121212] p-6 sm:p-8 rounded-2xl">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block mb-1">
                    {lang === 'en' ? 'Stones & Organic Materials' : lang === 'ar' ? 'الأحجار الكريمة والمواد العضوية' : 'Gemmes & Matières Organiques'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold flex items-center gap-2.5">
                    <span className="text-[#d4af37]">✦</span>
                    {lang === 'en'
                      ? '5A Grade Zirconia & Natural Mother-of-Pearl'
                      : lang === 'ar'
                      ? 'زركونيوم 5A وعرق اللؤلؤ الطبيعي'
                      : 'Oxydes de Zirconium 5A & Nacre Naturelle'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-xl bg-[#161616] border border-[#2a2a2a] space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Gem className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-white text-base">
                          {lang === 'en' ? '5A Grade Cubic Zirconia' : lang === 'ar' ? 'زركونيوم مكعب درجة 5A' : 'Zirconium Joaillier Grade 5A'}
                        </h3>
                        <span className="text-[11px] text-[#9a958a]">
                          {lang === 'en' ? 'VVS Clarity & 57 Laser Facets' : lang === 'ar' ? 'نقاء VVS و57 وجهاً بالليزر' : 'Clarté VVS & Taille Brillant 57 Facettes'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#cfcbc2] leading-relaxed">
                      {lang === 'en'
                        ? 'Grade 5A (AAAAA) represents the highest achievable standard in synthesized gemology. With a refractive index of 2.15 (approaching natural diamond at 2.42) and a Mohs hardness of 8.5, our stones deliver hypnotic fire and brilliant brilliance.'
                        : lang === 'ar'
                        ? 'تمثل الدرجة 5A (AAAAA) أعلى تصنيف ممكن في أحجار الزركون. مع معامل انكسار ضوئي 2.15 (يقارب الألماس الطبيعي 2.42) وصلابة 8.5 بمقياس موهس، تعكس أحجارنا بريقاً ساحراً.'
                        : "Le grade 5A (AAAAA) est la plus haute distinction en gemmologie de synthèse. Avec un indice de réfraction de 2,15 (proche du diamant à 2,42) et une dureté de 8,5 sur l'échelle de Mohs, nos pierres offrent un feu et une réfraction incomparables."}
                    </p>
                    <div className="p-3 bg-[#1c1c1c] rounded border border-[#2e2e2e] text-[11px] text-[#e8c878]">
                      <strong>{lang === 'en' ? 'Jeweler Prong Setting: ' : lang === 'ar' ? 'ترصيع جوهرجي يدوي: ' : 'Sertissage Traditionnel Joaillier : '}</strong>
                      {lang === 'en'
                        ? 'Hand-set with claws and bezels. Never glued with toxic adhesives that dissolve in water.'
                        : lang === 'ar'
                        ? 'مثبت بمخالب معدنية دقيقة، دون استخدام أي صمغ كيميائي يذوب بالماء.'
                        : 'Pierres serties à la main par griffes ou serti clos, sans aucune colle chimique sensible à l’eau.'}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#161616] border border-[#2a2a2a] space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-white text-base">
                          {lang === 'en' ? 'Natural Mother-of-Pearl & Pearls' : lang === 'ar' ? 'عرق اللؤلؤ واللؤلؤ الطبيعي' : 'Nacre Sauvage & Perles Naturelles'}
                        </h3>
                        <span className="text-[11px] text-[#9a958a]">
                          {lang === 'en' ? 'Ethically Harvested Organic Shells' : lang === 'ar' ? 'صدف طبيعي بحري نقي' : 'Coquilles d’Huîtres Perlières d’Eau Profonde'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#cfcbc2] leading-relaxed">
                      {lang === 'en'
                        ? 'Cut from genuine deep-sea oyster shells, our natural mother-of-pearl features organic iridescent reflections ranging from silvery moonbeams to iridescent rose champagne. Each piece is unique by nature.'
                        : lang === 'ar'
                        ? 'يُستخرج عرق اللؤلؤ الطبيعي من أصداف المحار البحري العميق، ويتميز بتموجات ضوئية قمرية ساحرة تتدرج من الفضي إلى الوردي الشامباني. كل قطعة فريدة لا تتكرر.'
                        : "Extraite de coquilles d'huîtres perlières sélectionnées, notre nacre naturelle dévoile des reflets lunaires irisés uniques allant du blanc opalin au rose champagne. Chaque bijou possède un veinage unique au monde."}
                    </p>
                    <div className="p-3 bg-[#1c1c1c] rounded border border-[#2e2e2e] text-[11px] text-[#e8c878]">
                      <strong>{lang === 'en' ? 'Organic Beauty: ' : lang === 'ar' ? 'طبيعة أصيلة: ' : 'Origine Organique : '}</strong>
                      {lang === 'en'
                        ? '100% genuine marine material, precision calibrated and protected from daily elements.'
                        : lang === 'ar'
                        ? 'مادة بحرية طبيعية 100%، مصقولة بدقة ومقاومة لتقلبات الاستخدام.'
                        : 'Matière vivante 100% naturelle, polie à la main et calibrée au dixième de millimètre.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: MASTER COMPARISON TABLE */}
            {(materialFilter === 'all' || materialFilter === 'comparison') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block mb-1">
                      {lang === 'en' ? 'Analytical Benchmarking' : lang === 'ar' ? 'المقارنة العلمية الشاملة' : 'Benchmark Métallurgique'}
                    </span>
                    <h2 className="text-2xl font-serif text-white font-semibold flex items-center gap-2">
                      <span className="text-[#d4af37]">✦</span>
                      {lang === 'en'
                        ? 'Fine Jewelry Metals Comparison'
                        : lang === 'ar'
                        ? 'جدول مقارنة معادن صناعة المجوهرات'
                        : 'Grand Tableau Comparatif des Métaux en Bijouterie'}
                    </h2>
                  </div>
                </div>

                <div className="border border-[#2a2a2a] rounded-xl overflow-x-auto shadow-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#151515] text-[#d4af37] uppercase tracking-wider font-semibold border-b border-[#2a2a2a]">
                      <tr>
                        <th className="p-3.5">{lang === 'en' ? 'Material & Alloy' : lang === 'ar' ? 'المادة والسبائك' : 'Matière & Alliage'}</th>
                        <th className="p-3.5 bg-[#d4af37]/10 text-[#e8c878] font-bold">
                          {lang === 'en' ? '316L + 18K PVD (Ovelzya)' : lang === 'ar' ? 'فولاذ 316L + ذهب PVD (أوفيلزيا)' : 'Acier 316L + PVD 18K (Ovelzya)'}
                        </th>
                        <th className="p-3.5">{lang === 'en' ? '18K Solid Gold' : lang === 'ar' ? 'ذهب خالص 18K' : 'Or Massif 18K (750)'}</th>
                        <th className="p-3.5">{lang === 'en' ? '925 Sterling Silver' : lang === 'ar' ? 'فضة 925 إسترليني' : 'Argent Sterling 925'}</th>
                        <th className="p-3.5">{lang === 'en' ? 'Standard Plated Brass' : lang === 'ar' ? 'نحاس مطلي عادي' : 'Plaqué Or Laiton'}</th>
                        <th className="p-3.5">{lang === 'en' ? 'Cheap Zinc/Zamak' : lang === 'ar' ? 'زنك وخردة رخيصة' : 'Bijou Fantaisie Zinc/Zamak'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222] text-[#cfcbc2]">
                      <tr>
                        <td className="p-3.5 text-[#9a958a] font-medium">
                          {lang === 'en' ? 'Waterproof (Sea, Pool, Shower)' : lang === 'ar' ? 'مقاومة الماء (البحر، الدوش، المسبح)' : 'Étanche Eau, Mer & Chlore'}
                        </td>
                        <td className="p-3.5 bg-[#d4af37]/5 font-semibold text-emerald-400">
                          {lang === 'en' ? '✓ Recommended 100%' : lang === 'ar' ? '✓ موصى به 100%' : '✓ Recommandé 100%'}
                        </td>
                        <td className="p-3.5 text-emerald-400">
                          {lang === 'en' ? '✓ Yes' : lang === 'ar' ? '✓ نعم' : '✓ Oui'}
                        </td>
                        <td className="p-3.5 text-amber-400">
                          {lang === 'en' ? '⚠ Blackens with sulfur/salt' : lang === 'ar' ? '⚠ يسود مع الملح' : '⚠ Noircit avec le sel & soufre'}
                        </td>
                        <td className="p-3.5 text-red-400">
                          {lang === 'en' ? '✗ No (dissolves layer)' : lang === 'ar' ? '✗ لا (تتلاشى الطبقة)' : '✗ Déconseillé (couche s’efface)'}
                        </td>
                        <td className="p-3.5 text-red-500 font-bold">
                          {lang === 'en' ? '✗ Immediate rust' : lang === 'ar' ? '✗ صدأ فوري وتآكل' : '✗ Rouille et pourriture immédiate'}
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3.5 text-[#9a958a] font-medium">
                          {lang === 'en' ? 'Hypoallergenic / Green Skin' : lang === 'ar' ? 'الحساسية والبقع الخضراء' : 'Tolérance Peau & Traces Vertes'}
                        </td>
                        <td className="p-3.5 bg-[#d4af37]/5 font-semibold text-emerald-400">
                          {lang === 'en' ? '✓ 0% Allergy (EN 1811)' : lang === 'ar' ? '✓ لا حساسية (معيار أوروبي)' : '✓ 0% Risque (Norme EN 1811)'}
                        </td>
                        <td className="p-3.5 text-emerald-400">
                          {lang === 'en' ? '✓ Excellent' : lang === 'ar' ? '✓ ممتاز' : '✓ Excellente'}
                        </td>
                        <td className="p-3.5 text-[#cfcbc2]">
                          {lang === 'en' ? 'Variable (copper alloy)' : lang === 'ar' ? 'متوسط (حسب السبيكة)' : 'Moyen (allié à 7.5% de cuivre)'}
                        </td>
                        <td className="p-3.5 text-amber-400">
                          {lang === 'en' ? 'High risk after wear' : lang === 'ar' ? 'خطر حكة وتحسس' : 'Risque élevé après usure'}
                        </td>
                        <td className="p-3.5 text-red-500 font-bold">
                          {lang === 'en' ? 'Severe eczema & green skin' : lang === 'ar' ? 'بقع خضراء وإكزيما مؤكدة' : 'Traces vertes & allergies sévères'}
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3.5 text-[#9a958a] font-medium">
                          {lang === 'en' ? 'Gold Coating Durability' : lang === 'ar' ? 'عمر وثبات الطلاء الذهبي' : 'Tenue de la Dorure dans le Temps'}
                        </td>
                        <td className="p-3.5 bg-[#d4af37]/5 font-semibold text-[#e8c878]">
                          {lang === 'en' ? 'Decades (Vacuum PVD)' : lang === 'ar' ? 'سنوات وعقود (PVD حراري)' : 'Plusieurs Années (PVD sous vide)'}
                        </td>
                        <td className="p-3.5 text-white">
                          {lang === 'en' ? 'Lifetime (Solid Gold)' : lang === 'ar' ? 'مدى الحياة (ذهب خالص)' : 'À vie (Métal massif)'}
                        </td>
                        <td className="p-3.5 text-[#cfcbc2]">
                          {lang === 'en' ? 'Tarnishes / Needs Polish' : lang === 'ar' ? 'يحتاج تنظيفاً دورياً' : 'Nécessite ré-argenture régulière'}
                        </td>
                        <td className="p-3.5 text-red-400">
                          {lang === 'en' ? '3 to 6 months' : lang === 'ar' ? 'من 3 إلى 6 أشهر فقط' : '3 à 6 mois seulement'}
                        </td>
                        <td className="p-3.5 text-red-500">
                          {lang === 'en' ? 'Few weeks' : lang === 'ar' ? 'أسابيع معدودة' : 'Quelques semaines'}
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3.5 text-[#9a958a] font-medium">
                          {lang === 'en' ? 'Mohs Hardness & Scratches' : lang === 'ar' ? 'مقاومة الصدمات والخدش' : 'Dureté Mohs & Résistance aux Chocs'}
                        </td>
                        <td className="p-3.5 bg-[#d4af37]/5 font-semibold text-white">
                          {lang === 'en' ? '6.0 - 6.5 (Ultra Rigid)' : lang === 'ar' ? '6.0 - 6.5 (صلابة عالية)' : '6,0 - 6,5 (Très Robuste)'}
                        </td>
                        <td className="p-3.5 text-amber-400">
                          {lang === 'en' ? '2.5 - 3.0 (Soft metal)' : lang === 'ar' ? '2.5 - 3.0 (معدن طري يخدش)' : '2,5 - 3,0 (Métal tendre, se déforme)'}
                        </td>
                        <td className="p-3.5 text-amber-400">
                          {lang === 'en' ? '2.5 (Soft metal)' : lang === 'ar' ? '2.5 (معدن طري)' : '2,5 (Se raye très facilement)'}
                        </td>
                        <td className="p-3.5 text-[#cfcbc2]">
                          {lang === 'en' ? '3.0 - 3.5' : lang === 'ar' ? '3.0 - 3.5' : '3,0 - 3,5'}
                        </td>
                        <td className="p-3.5 text-red-400">
                          {lang === 'en' ? 'Brittle & easily broken' : lang === 'ar' ? 'هش ويتكسر بسهولة' : 'Cassant & fragile'}
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3.5 text-[#9a958a] font-medium">
                          {lang === 'en' ? 'Price & Accessibility' : lang === 'ar' ? 'السعر والقيمة مقابل المال' : 'Budget & Rapport Qualité/Prix'}
                        </td>
                        <td className="p-3.5 bg-[#d4af37]/5 font-semibold text-emerald-400">
                          {lang === 'en' ? 'Exceptional Value' : lang === 'ar' ? 'قيمة استثنائية ممتازة' : 'Rapport Qualité/Prix Exceptionnel'}
                        </td>
                        <td className="p-3.5 text-[#9a958a]">
                          {lang === 'en' ? 'Extremely High (Thousands)' : lang === 'ar' ? 'باهظ جداً (آلاف الدراهم)' : 'Très Élevé (Milliers de DH)'}
                        </td>
                        <td className="p-3.5 text-[#cfcbc2]">
                          {lang === 'en' ? 'Moderate' : lang === 'ar' ? 'متوسط' : 'Moyen'}
                        </td>
                        <td className="p-3.5 text-[#cfcbc2]">
                          {lang === 'en' ? 'Moderate (Poor Longevity)' : lang === 'ar' ? 'متوسط (عمر قصير)' : 'Moyen pour durée éphémère'}
                        </td>
                        <td className="p-3.5 text-[#cfcbc2]">
                          {lang === 'en' ? 'Very Low' : lang === 'ar' ? 'منخفض' : 'Bas'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 5: EUROPEAN REGULATIONS & MEDICAL STANDARDS */}
            {(materialFilter === 'all' || materialFilter === 'care') && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block mb-1">
                    {lang === 'en' ? 'Health & Compliance' : lang === 'ar' ? 'المعايير الصحية الأوروبية' : 'Certifications & Sécurité Sanitaire'}
                  </span>
                  <h2 className="text-2xl font-serif text-white font-semibold flex items-center gap-2">
                    <span className="text-[#d4af37]">✦</span>
                    {lang === 'en'
                      ? 'European Standards & Dermatological Safety'
                      : lang === 'ar'
                      ? 'المعايير الأوروبية والسلامة الجلدية'
                      : 'Normes Européennes & Innocuité Dermatologique'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 border border-[#2a2a2a] bg-[#141414] rounded-xl hover:border-[#d4af37]/40 transition">
                    <div className="flex items-center justify-between mb-2">
                      <b className="text-[#d4af37] font-serif text-lg">EN 1811 : 2011 + A1</b>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {lang === 'en' ? 'Zero Migration' : lang === 'ar' ? 'انعدام التسرب' : 'Zéro Relargage'}
                      </span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-[#9a958a] block mb-2 font-medium">
                      {lang === 'en' ? 'European Reference Nickel Test' : lang === 'ar' ? 'المرجع الأوروبي لاختبار النيكل' : 'Test de Référence Européen du Nickel'}
                    </span>
                    <p className="text-xs text-[#cfcbc2] leading-relaxed">
                      {lang === 'en'
                        ? 'Measures the rate of nickel release. The EU limit is 0.05 µg/cm²/week. Ovelzya 316L tests at 0.00 µg/cm²/week, ensuring complete dermatological safety.'
                        : lang === 'ar'
                        ? 'يقيس معدل تسرب النيكل للبشرة. الحد الأقصى الأوروبي هو 0.05 ميكروغرام. أثبتت اختبارات فولاذنا 0.00 ميكروغرام لسلامة تامة للبشرة.'
                        : "Mesure officielle du relargage de nickel. Le seuil légal UE est de 0,05 µg/cm²/semaine. L'acier 316L Ovelzya est certifié à 0,00 µg/cm²/semaine."}
                    </p>
                  </div>

                  <div className="p-5 border border-[#2a2a2a] bg-[#141414] rounded-xl hover:border-[#d4af37]/40 transition">
                    <div className="flex items-center justify-between mb-2">
                      <b className="text-[#d4af37] font-serif text-lg">REACH (UE N° 1907/2006)</b>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                        Annex XVII
                      </span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-[#9a958a] block mb-2 font-medium">
                      {lang === 'en' ? 'Toxic Heavy Metals Prohibition' : lang === 'ar' ? 'حظر المعادن الثقيلة السامة' : 'Interdiction des Métaux Lourds Toxiques'}
                    </span>
                    <p className="text-xs text-[#cfcbc2] leading-relaxed">
                      {lang === 'en'
                        ? 'Strict European restriction banning harmful chemicals in fine jewelry: zero lead, zero toxic cadmium, and zero free nickel.'
                        : lang === 'ar'
                        ? 'لائحة أوروبية صارمة تحظر المواد الكيميائية الضارة في المجوهرات: خالٍ تماماً من الرصاص، والكادميوم، والنيكل الحر.'
                        : "Réglementation européenne drastique interdisant les métaux lourds toxiques dans les bijoux : zéro plomb, zéro cadmium et zéro nickel libre."}
                    </p>
                  </div>

                  <div className="p-5 border border-[#2a2a2a] bg-[#141414] rounded-xl hover:border-[#d4af37]/40 transition">
                    <div className="flex items-center justify-between mb-2">
                      <b className="text-[#d4af37] font-serif text-lg">ISO 5832-1 · ASTM F138</b>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                        Medical Grade
                      </span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-[#9a958a] block mb-2 font-medium">
                      {lang === 'en' ? 'Surgical Implant Metallurgy' : lang === 'ar' ? 'معايير الغرسات الجراحية' : 'Nuance d’Acier pour Implants Médicaux'}
                    </span>
                    <p className="text-xs text-[#cfcbc2] leading-relaxed">
                      {lang === 'en'
                        ? 'These strict specifications define surgical implant-grade stainless steel — the exact metallurgy crafted into your Ovelzya jewelry.'
                        : lang === 'ar'
                        ? 'تحدد هذه المعايير الفولاذ المستخدم في المفاصل والغرسات الجراحية البشرية — نفس العائلة النقية لمجوهرات أوفيلزيا.'
                        : "Ces normes internationales définissent l'acier pour implants chirurgicaux stériles — la famille exacte dont sont issues les pièces Ovelzya."}
                    </p>
                  </div>

                  <div className="p-5 border border-[#2a2a2a] bg-[#141414] rounded-xl hover:border-[#d4af37]/40 transition">
                    <div className="flex items-center justify-between mb-2">
                      <b className="text-[#d4af37] font-serif text-lg">ISO 10993</b>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        Biocompatible
                      </span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-[#9a958a] block mb-2 font-medium">
                      {lang === 'en' ? 'Cutaneous Biocompatibility' : lang === 'ar' ? 'التوافق الحيوي الجلدي' : 'Biocompatibilité Dermatologique'}
                    </span>
                    <p className="text-xs text-[#cfcbc2] leading-relaxed">
                      {lang === 'en'
                        ? 'Biological evaluation guaranteeing zero skin irritation or dermal sensitization, even for the most sensitive or atopic skins.'
                        : lang === 'ar'
                        ? 'تقييم بيولوجي يضمن عدم حدوث أي تهيج للبشرة أو حساسية، حتى لأصحاب البشرة الحساسة أو المعرضة للإكزيما.'
                        : "Évaluation biologique certifiant l'absence d'irritation ou de réaction allergique, convenant même aux peaux atopiques et ultra-sensibles."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: JEWELER CARE GUIDE & FAQ */}
            {(materialFilter === 'all' || materialFilter === 'care') && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block mb-1">
                    {lang === 'en' ? 'Jeweler Wisdom' : lang === 'ar' ? 'نصائح الخبراء' : 'Conseils d’Experts Joailliers'}
                  </span>
                  <h2 className="text-2xl font-serif text-white font-semibold flex items-center gap-2">
                    <span className="text-[#d4af37]">✦</span>
                    {lang === 'en'
                      ? 'Jewelry Care Guide & Questions'
                      : lang === 'ar'
                      ? 'دليل العناية والأسئلة الشائعة'
                      : 'Guide d’Entretien & Questions Fréquentes'}
                  </h2>
                </div>

                <div className="space-y-3">
                  <details className="border border-[#2a2a2a] bg-[#141414] p-4 rounded-xl text-xs group" open>
                    <summary className="font-semibold uppercase tracking-wider text-[#d4af37] cursor-pointer flex items-center justify-between">
                      <span>
                        {lang === 'en'
                          ? 'Can I really shower, exercise, and swim with my Ovelzya jewelry?'
                          : lang === 'ar'
                          ? 'هل يمكنني الاستحمام والسباحة وممارسة الرياضة بمجوهراتي؟'
                          : 'Puis-je réellement me doucher, nager et faire du sport avec mes bijoux ?'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#d4af37] transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-[#cfcbc2] leading-relaxed font-light">
                      {lang === 'en'
                        ? 'Yes, absolutely. 316L steel combined with 18K PVD gold bonding is 100% waterproof. You can wear your rings, necklaces, and bracelets under hot showers, in swimming pools, and in ocean water. After salty sea swims, simply rinse with tap water to clear crystallized salt.'
                        : lang === 'ar'
                        ? 'نعم بكل تأكيد. فولاذ 316L مع طلاء الذهب PVD مقاوم للماء بنسبة 100%. يمكنك ارتداء خواتمك وقلاداتك أثناء الاستحمام بالماء الساخن وفي البحر والمسبح. بعد السباحة في البحر، يكفي شطفها بماء الصنبور لإزالة بلورات الملح.'
                        : "Oui, sans aucune hésitation. L'acier 316L et la dorure PVD sont 100% étanches et inoxydables. Vous pouvez porter vos bagues, colliers et bracelets sous la douche chaude, à la piscine chlorée ou dans l'eau de mer. Après une baignade en mer, rincez simplement à l'eau claire pour dissoudre les micro-cristaux de sel."}
                    </p>
                  </details>

                  <details className="border border-[#2a2a2a] bg-[#141414] p-4 rounded-xl text-xs group">
                    <summary className="font-semibold uppercase tracking-wider text-[#d4af37] cursor-pointer flex items-center justify-between">
                      <span>
                        {lang === 'en'
                          ? 'How to clean and restore the mirror shine of your creation?'
                          : lang === 'ar'
                          ? 'كيف أنظف مجوهراتي لأستعيد بريقها المرآوي الأصلي؟'
                          : 'Comment nettoyer et raviver l’éclat miroir de mon bijou ?'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#d4af37] transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-[#cfcbc2] leading-relaxed font-light">
                      {lang === 'en'
                        ? 'Gently wash with warm water and mild liquid soap (such as dish soap), dry with a soft microfiber chamois. For gemstones, a very soft toothbrush effortlessly dislodges cosmetic residue from prongs.'
                        : lang === 'ar'
                        ? 'اغسل القطعة برفق بماء دافئ وصابون خفيف، ثم جففها بقطعة قماش ناعمة (شاموا). وللأحجار الكريمة، فرشاة أسنان ناعمة جداً تزيل أي بقايا مستحضرات تجميل بكل سهولة.'
                        : "Nettoyez votre bijou à l'eau tiède avec une goutte de savon doux, puis séchez-le délicatement avec la chamoisine offerte. Pour faire scintiller les zirconiums, une brosse à poils très souples déloge instantanément les résidus de crème ou maquillage entre les griffes."}
                    </p>
                  </details>

                  <details className="border border-[#2a2a2a] bg-[#141414] p-4 rounded-xl text-xs group">
                    <summary className="font-semibold uppercase tracking-wider text-[#d4af37] cursor-pointer flex items-center justify-between">
                      <span>
                        {lang === 'en'
                          ? 'Why does 316L steel outperform solid silver 925?'
                          : lang === 'ar'
                          ? 'لماذا يتفوق الفولاذ 316L على الفضة 925 الخالصة؟'
                          : 'Pourquoi l’acier 316L est-il supérieur à l’argent 925 au quotidien ?'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#d4af37] transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-[#cfcbc2] leading-relaxed font-light">
                      {lang === 'en'
                        ? 'Sterling silver 925 contains 7.5% copper which naturally oxidizes and turns black when reacting with atmospheric sulfur and humidity. 316L steel never tarnishes, never turns black, and is twice as hard as silver, resisting daily scratches and dents.'
                        : lang === 'ar'
                        ? 'تحتوي الفضة 925 على 7.5% نحاس يتأكسد ويسود تلقائياً عند ملامسة الهواء والملح. أما فولاذ 316L فلا يسود إطلاقاً، كما أنه أصلب بمرتين من الفضة ويقاوم الخدوش والانثناء اليومي.'
                        : "L'argent massif 925 contient 7,5% de cuivre qui réagit naturellement avec les sulfures de l'air et l'humidité, provoquant son noircissement. L'acier 316L ne noircit jamais, ne nécessite aucun produit chimique de polissage, et est deux fois plus dur que l'argent."}
                    </p>
                  </details>
                </div>
              </div>
            )}

            {/* Bottom CTA to Collection */}
            <div className="text-center pt-8 border-t border-[#2a2a2a]/60 space-y-4">
              <p className="text-xs text-[#9a958a] uppercase tracking-wider">
                {lang === 'en'
                  ? 'All Ovelzya pieces are backed by our 24-Month Inalterable Warranty'
                  : lang === 'ar'
                  ? 'كل قطعة من أوفيلزيا مشمولة بضماننا لمدة 24 شهراً ضد التآكل'
                  : 'Toutes les créations Ovelzya sont protégées par notre Garantie Inaltérable 24 Mois'}
              </p>
              <button
                onClick={() => {
                  setActiveView('collection');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.2em] transition rounded cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                {t('mat_cta')}
              </button>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 6. À PROPOS / NOTRE HISTOIRE */}
        {/* ============================================================ */}
        {activeView === 'about' && (
          <section className="wrap py-12 max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-2">
                {t('about_tag')}
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
                {t('about_h1')} <em className="text-[#d4af37] not-italic">{t('about_h1_em')}</em>
              </h1>
              <p className="text-[#9a958a] text-sm sm:text-base mt-4 font-light">{t('about_p')}</p>
            </div>

            <div className="space-y-4 text-sm text-[#cfcbc2] leading-relaxed font-light">
              <p>{t('about_p1')}</p>
              <p>{t('about_p2')}</p>
              <p>{t('about_p3')}</p>
            </div>

            {/* 4 Values */}
            <div className="border-t border-[#2a2a2a] pt-8 space-y-6">
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-1">
                  {t('about_com_t')}
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif text-white font-semibold">
                  {t('about_com_h')}
                </h2>
              </div>

              {[
                { n: '01', h: t('val_1_h'), p: t('val_1_p') },
                { n: '02', h: t('val_2_h'), p: t('val_2_p') },
                { n: '03', h: t('val_3_h'), p: t('val_3_p') },
                { n: '04', h: t('val_4_h'), p: t('val_4_p') },
              ].map((val, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-6 py-4 border-b border-[#222] last:border-0"
                >
                  <span className="font-serif text-3xl font-semibold text-[#d4af37]">{val.n}</span>
                  <div>
                    <h3 className="font-serif text-xl text-white font-semibold mb-1">{val.h}</h3>
                    <p className="text-xs text-[#9a958a] leading-relaxed font-light">{val.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 7. CONTACT & CONCIERGERIE */}
        {/* ============================================================ */}
        {activeView === 'contact' && (
          <section className="wrap py-12 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-2">
                {t('cont_tag')}
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
                {t('cont_h1')} <em className="text-[#d4af37] not-italic">{t('cont_h1_em')}</em>
              </h1>
              <p className="text-[#9a958a] text-sm sm:text-base mt-4 font-light">{t('cont_p')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Left: Contact Info */}
              <div className="border border-[#262626] bg-[#141414] p-8 rounded space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#d4af37] block font-semibold mb-1">
                    {t('cont_sh_t')}
                  </span>
                  <p className="text-sm text-[#cfcbc2]">{content.settings.showroomAddress}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#d4af37] block font-semibold mb-1">
                    {t('cont_co_t')}
                  </span>
                  <p className="text-sm text-[#cfcbc2]">
                    {content.settings.contactEmail} · {content.settings.contactPhone}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#d4af37] block font-semibold mb-1">
                    {t('cont_ho_t')}
                  </span>
                  <p className="text-sm text-[#cfcbc2]">{content.settings.openingHours}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#d4af37] block font-semibold mb-1">
                    {t('cont_ch_t')}
                  </span>
                  <p className="text-sm text-[#cfcbc2]">{t('cont_ch_p')}</p>
                </div>
              </div>

              {/* Right: Contact Form */}
              <form
                onSubmit={handleSendContact}
                className="border border-[#262626] bg-[#141414] p-8 rounded space-y-4"
              >
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    {t('ph_name')} *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={t('ph_name')}
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    {t('ph_email')} *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder={t('ph_email')}
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    {t('cont_sub')}
                  </label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  >
                    <option>{t('cont_sub_1')}</option>
                    <option>{t('cont_sub_2')}</option>
                    <option>{t('cont_sub_3')}</option>
                    <option>{t('cont_sub_4')}</option>
                    <option>{t('cont_sub_5')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                    {t('cont_msg')} *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={t('ph_msg')}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.18em] transition rounded cursor-pointer"
                >
                  {t('cont_send')}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 8. SUIVI DE COMMANDE (ORDER TRACKING) */}
        {/* ============================================================ */}
        {activeView === 'track' && (
          <section className="wrap py-12 max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-2">
                {t('track_tag')}
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
                {t('track_h1')} <em className="text-[#d4af37] not-italic">{t('track_h1_em')}</em>
              </h1>
              <p className="text-[#9a958a] text-sm mt-3 font-light">{t('track_p')}</p>
            </div>

            {/* Tracking Search Input */}
            <form
              onSubmit={handleTrackOrder}
              className="border border-[rgba(212,175,55,0.25)] bg-[#141414] p-6 rounded space-y-4"
            >
              <div>
                <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                  {t('track_num')}
                </label>
                <input
                  required
                  type="text"
                  placeholder={t('ph_order')}
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-[#1c1c1c] border border-[#333] font-mono font-bold tracking-widest text-sm text-[#d4af37] rounded focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.18em] transition rounded cursor-pointer"
              >
                {t('track_btn')}
              </button>
            </form>

            {/* Error state */}
            {trackError && (
              <div className="mt-6 p-4 border border-red-500/50 bg-red-950/20 rounded text-center text-xs text-red-300">
                {t('track_not_found')}
              </div>
            )}

            {/* Tracking Result Timeline */}
            {trackedOrder && (
              <div className="mt-8 border border-[rgba(212,175,55,0.3)] bg-[#141414] p-6 rounded space-y-6">
                <div className="flex items-center justify-between border-b border-[#262626] pb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#9a958a] block">
                      {t('track_num')}
                    </span>
                    <b className="font-mono text-xl font-bold text-[#d4af37]">{trackedOrder.num}</b>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-[#9a958a] block">
                      {t('track_eta')}
                    </span>
                    <b className="text-xs font-semibold text-white">
                      {new Date(
                        new Date(trackedOrder.date).getTime() + 4 * 864e5
                      ).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </b>
                  </div>
                </div>

                {/* Timeline Steps */}
                <div className="space-y-6 pl-4 border-l-2 border-[#2a2a2a] relative ml-2">
                  {[
                    { key: 'reçue', num: 1, title: t('track_step_1'), desc: t('track_step_1_t') },
                    {
                      key: 'preparation',
                      num: 2,
                      title: t('track_step_2'),
                      desc: t('track_step_2_t'),
                    },
                    { key: 'expediee', num: 3, title: t('track_step_3'), desc: t('track_step_3_t') },
                    {
                      key: 'livraison',
                      num: 4,
                      title: t('track_step_4'),
                      desc: t('track_step_4_t'),
                    },
                    { key: 'livree', num: 5, title: t('track_step_5'), desc: t('track_step_5_t') },
                  ].map((step, idx) => {
                    const statusOrder = ['reçue', 'preparation', 'expediee', 'livraison', 'livree'];
                    const currentIdx = statusOrder.indexOf(trackedOrder.status);
                    const isDone = idx <= currentIdx;

                    return (
                      <div key={step.key} className="relative">
                        <span
                          className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full border-2 border-[#0d0d0d] ${
                            isDone ? 'bg-[#d4af37]' : 'bg-[#2a2a2a]'
                          }`}
                        />
                        <h4
                          className={`text-sm font-semibold ${
                            isDone ? 'text-[#d4af37]' : 'text-[#777]'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-[#9a958a] mt-0.5">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ============================================================ */}
        {/* 9. PAIEMENT / CHECKOUT */}
        {/* ============================================================ */}
        {activeView === 'checkout' && (
          <section className="wrap py-8">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-1">
                {t('co_tag')}
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif text-white font-semibold">
                {t('co_h2')}
              </h1>
              <p className="text-xs text-[#9a958a] mt-1">{t('co_p_intro')}</p>
            </div>

            <form
              onSubmit={handlePlaceOrder}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Multi-step checkout fields (8 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Step 1: Coordonnées */}
                <div className="border border-[#262626] bg-[#141414] p-6 rounded space-y-4">
                  <div className="flex items-baseline gap-3 border-b border-[#222] pb-3">
                    <span className="font-serif text-[#d4af37] font-semibold text-lg">01</span>
                    <h3 className="text-base font-semibold text-white uppercase tracking-wider">
                      {t('s_1_h')}
                    </h3>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      {t('ph_email')} *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder={t('ph_email')}
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                        {lang === 'en' ? 'First Name *' : (lang === 'ar' ? 'الاسم الشخصي *' : 'Prénom *')}
                      </label>
                      <input
                        required
                        type="text"
                        value={checkoutData.fname}
                        onChange={(e) => setCheckoutData({ ...checkoutData, fname: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                        {lang === 'en' ? 'Last Name *' : (lang === 'ar' ? 'اللقب *' : 'Nom *')}
                      </label>
                      <input
                        required
                        type="text"
                        value={checkoutData.lname}
                        onChange={(e) => setCheckoutData({ ...checkoutData, lname: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      {t('ph_phone')} *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+212 6 00 00 00 00"
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Step 2: Livraison */}
                <div className="border border-[#262626] bg-[#141414] p-6 rounded space-y-4">
                  <div className="flex items-baseline gap-3 border-b border-[#222] pb-3">
                    <span className="font-serif text-[#d4af37] font-semibold text-lg">02</span>
                    <h3 className="text-base font-semibold text-white uppercase tracking-wider">
                      {t('s_2_h')}
                    </h3>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      {t('ph_street')} *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Numéro, rue, résidence, étage..."
                      value={checkoutData.street}
                      onChange={(e) => setCheckoutData({ ...checkoutData, street: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                        {t('ph_city')} *
                      </label>
                      <input
                        required
                        type="text"
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                        {lang === 'en' ? 'Postal Code' : (lang === 'ar' ? 'الرمز البريدي' : 'Code Postal')}
                      </label>
                      <input
                        type="text"
                        value={checkoutData.cp}
                        onChange={(e) => setCheckoutData({ ...checkoutData, cp: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#333] text-sm text-white rounded focus:border-[#d4af37] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#9a958a] block mb-1">
                      {t('ph_country')}
                    </label>
                    <input
                      disabled
                      value={t('country_ma')}
                      className="w-full px-3.5 py-2.5 bg-[#1e1e1e] border border-[#333] text-sm text-[#9a958a] rounded"
                    />
                    <small className="text-[11px] text-[#777] block mt-1">{t('ship_note')}</small>
                  </div>
                </div>

                {/* Step 3: Payment Method Options */}
                <div className="border border-[#262626] bg-[#141414] p-6 rounded space-y-4">
                  <div className="flex items-baseline gap-3 border-b border-[#222] pb-3">
                    <span className="font-serif text-[#d4af37] font-semibold text-lg">03</span>
                    <h3 className="text-base font-semibold text-white uppercase tracking-wider">
                      {t('s_4_h')}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        key: 'cod',
                        title: t('pay_cod'),
                        desc: t('pay_cod_d'),
                        badge: `+${content.settings.codFee} DH`,
                      },
                      {
                        key: 'bank',
                        title: t('pay_bank'),
                        desc: t('pay_bank_d'),
                        badge: 'RIB Email',
                      },
                      {
                        key: 'applepay',
                        title: t('pay_apple'),
                        desc: t('pay_apple_d'),
                        badge: 'Touch ID',
                      },
                      {
                        key: 'googlepay',
                        title: t('pay_google'),
                        desc: t('pay_google_d'),
                        badge: 'Instant',
                      },
                      {
                        key: 'paypal',
                        title: t('pay_paypal'),
                        desc: t('pay_paypal_d'),
                        badge: 'Sécurisé',
                      },
                      {
                        key: 'wa',
                        title: t('pay_wa'),
                        desc: t('pay_wa_d'),
                        badge: 'Conseiller VIP',
                      },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        className={`p-3.5 rounded border transition cursor-pointer flex items-start gap-3 ${
                          checkoutData.pay === opt.key
                            ? 'border-[#d4af37] bg-[#d4af37]/10'
                            : 'border-[#2a2a2a] bg-[#161616] hover:border-[#444]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pay"
                          value={opt.key}
                          checked={checkoutData.pay === opt.key}
                          onChange={(e) =>
                            setCheckoutData({ ...checkoutData, pay: e.target.value })
                          }
                          className="mt-1 accent-[#d4af37]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">{opt.title}</span>
                            <span className="text-[10px] text-[#d4af37] font-mono">{opt.badge}</span>
                          </div>
                          <p className="text-[11px] text-[#9a958a] mt-0.5 leading-snug">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cross-Sell & Upsell for stage 'checkout_start' */}
                {content.settings.boosters?.promotionRules && (
                  <ProductCrossSellUpsellSection
                    cartProducts={cart.map((it) => products.find((x) => x.id === it.id)).filter(Boolean) as Product[]}
                    products={products}
                    rules={content.settings.boosters.promotionRules}
                    lang={lang}
                    onAddToCart={(id, qty, priceOverride) => {
                      handleAddToCart(id, qty, priceOverride);
                      showToast('✦ Pièce ajoutée à votre commande !');
                    }}
                    onSelectProduct={handleSelectProduct}
                    blurredProductIds={blurredProductIds}
                    enableCrossSell={content.settings.boosters?.enableCrossSell ?? true}
                    enableUpsell={content.settings.boosters?.enableUpsell ?? true}
                    stage="checkout_start"
                    variant="full"
                  />
                )}
              </div>

              {/* Right Column: Order Summary (5 cols) */}
              <div className="lg:col-span-5 border border-[rgba(212,175,55,0.3)] bg-[#141414] p-6 rounded-lg sticky top-28 space-y-4">
                <h3 className="font-serif text-xl font-semibold text-white border-b border-[#262626] pb-3">
                  {t('sum_title')}
                </h3>

                {/* Items preview */}
                <div className="divide-y divide-[#222] max-h-56 overflow-y-auto pr-1">
                  {cart.map((it) => {
                    const p = products.find((x) => x.id === it.id);
                    if (!p) return null;
                    const name = getProductLocalized(p, lang).name;
                    return (
                      <div key={it.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.img || `https://picsum.photos/seed/${p.seed}/100/120`}
                            alt={name}
                            className="w-10 h-12 object-cover rounded border border-[#2a2a2a]"
                          />
                          <div>
                            <span className="text-xs font-medium text-white block truncate max-w-[180px]">
                              {name}
                            </span>
                            <span className="text-[11px] text-[#9a958a]">
                              {lang === 'en' ? `Qty: ${it.qty}` : (lang === 'ar' ? `الكمية: ${it.qty}` : `Qté : ${it.qty}`)}
                            </span>
                          </div>
                        </div>
                        <span className="font-serif font-semibold text-xs text-[#d4af37]">
                          {(it.price * it.qty).toLocaleString('fr-FR')} DH
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Promo code box */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder={t('ph_promo')}
                    value={checkoutData.promo}
                    onChange={(e) =>
                      setCheckoutData({ ...checkoutData, promo: e.target.value.toUpperCase() })
                    }
                    className="flex-1 px-3 py-2 bg-[#1b1b1b] border border-[#333] text-xs font-mono text-[#d4af37] uppercase rounded focus:border-[#d4af37] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo()}
                    className="px-4 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-semibold text-xs uppercase tracking-wider rounded transition"
                  >
                    {t('apply_promo')}
                  </button>
                </div>

                {/* Line calculations */}
                <div className="border-t border-[#262626] pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#cfcbc2]">
                    <span>{t('t_sub')}</span>
                    <span>{subtotal.toLocaleString('fr-FR')} DH</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#d4af37] font-semibold">
                      <span>{t('t_disc')}</span>
                      <span>−{discountAmount.toLocaleString('fr-FR')} DH</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#cfcbc2]">
                    <span>{t('t_ship')}</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-[#d4af37] font-medium">
                          {lang === 'en' ? 'Free ✦' : (lang === 'ar' ? 'مجاني ✦' : 'Offerte ✦')}
                        </span>
                      ) : (
                        `${shippingFee.toLocaleString('fr-FR')} DH`
                      )}
                    </span>
                  </div>

                  {codFee > 0 && (
                    <div className="flex justify-between text-[#cfcbc2]">
                      <span>{t('t_cod')}</span>
                      <span>+{codFee.toLocaleString('fr-FR')} DH</span>
                    </div>
                  )}

                  {giftOptionFee > 0 && (
                    <div className="flex justify-between text-[#cfcbc2]">
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{lang === 'en' ? 'Jewelry Gift Box' : (lang === 'ar' ? 'علبة مجوهرات فاخرة كهدية' : 'Écrin Cadeau Joaillerie')}</span>
                      </span>
                      <span>+{giftOptionFee.toLocaleString('fr-FR')} DH</span>
                    </div>
                  )}

                  <div className="border-t border-[#262626] pt-3 flex justify-between items-center text-sm font-semibold">
                    <span className="text-white font-serif text-base">{t('t_total')}</span>
                    <span className="font-serif text-xl font-bold text-[#d4af37]">
                      {finalTotal.toLocaleString('fr-FR')} DH
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.18em] transition rounded shadow-lg shadow-[#d4af37]/20 cursor-pointer disabled:opacity-50"
                >
                  {t('btn_order')}
                </button>

                <p className="text-[11px] text-[#777] text-center leading-snug">
                  {t('trust_note')}
                </p>
              </div>
            </form>
          </section>
        )}

        {/* ============================================================ */}
        {/* 10. CONFIRMATION COMMANDE */}
        {/* ============================================================ */}
        {activeView === 'confirmation' && lastPlacedOrder && (
          <section className="wrap py-16 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full border border-[#d4af37] text-[#d4af37] flex items-center justify-center text-3xl mx-auto mb-6">
              ✓
            </div>
            <span className="text-xs uppercase tracking-[0.26em] text-[#d4af37] block mb-2">
              {t('conf_tag')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              {t('conf_h1')} {lastPlacedOrder.name.split(' ')[0]}.<br />
              <em className="text-[#d4af37] not-italic">{t('conf_h1_em')}</em>
            </h1>

            <div className="inline-block border border-dashed border-[#d4af37] text-[#d4af37] font-mono text-base font-bold tracking-widest px-6 py-2.5 my-6 rounded">
              {lastPlacedOrder.num}
            </div>

            <p className="text-xs sm:text-sm text-[#9a958a] max-w-md mx-auto leading-relaxed mb-8">
              {t('conf_email_sent')} <b className="text-white">{lastPlacedOrder.email}</b>.
              <br />
              {t('conf_pay')} : <b className="text-[#d4af37]">{lastPlacedOrder.payMethod}</b>.
              <br />
              {t('conf_eta')} :{' '}
              <b className="text-white">
                {new Date(new Date(lastPlacedOrder.date).getTime() + 4 * 864e5).toLocaleDateString(
                  lang === 'en' ? 'en-US' : (lang === 'ar' ? 'ar-MA' : 'fr-FR'),
                  {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  }
                )}
              </b>
              .
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  setInvoiceOrder(lastPlacedOrder);
                  setIsInvoiceOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-3.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#d4af37] text-[#d4af37] hover:text-[#e8c878] font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow-lg shadow-[#d4af37]/10"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'en' ? 'A4 Invoice' : (lang === 'ar' ? 'فاتورة A4' : 'Facture A4')}</span>
              </button>

              <button
                onClick={() => {
                  setReceiptOrder(lastPlacedOrder);
                  setIsReceiptOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-3.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37] font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>{lang === 'en' ? '80mm Receipt' : (lang === 'ar' ? 'تذكرة الصندوق 80mm' : 'Ticket 80mm')}</span>
              </button>

              <button
                onClick={() => {
                  setTrackQuery(lastPlacedOrder.num);
                  setActiveView('track');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer"
              >
                {t('conf_track')}
              </button>
              <button
                onClick={() => {
                  setActiveView('collection');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 border border-[#333] hover:border-[#d4af37] text-white text-xs uppercase tracking-wider rounded transition cursor-pointer"
              >
                {t('conf_cta_1')}
              </button>
            </div>

            {/* Post-Purchase Cross-Sell / Upsell offers for 'purchase_completed' stage */}
            {content.settings.boosters?.promotionRules && lastPlacedOrder && (
              <div className="mt-12 text-left">
                <ProductCrossSellUpsellSection
                  cartProducts={lastPlacedOrder.items.map((it) => products.find((p) => p.id === it.id)).filter(Boolean) as Product[]}
                  products={products}
                  rules={content.settings.boosters.promotionRules}
                  lang={lang}
                  onAddToCart={(id, qty, priceOverride) => {
                    handleAddToCart(id, qty, priceOverride);
                    setIsCartOpen(true);
                    showToast('✦ Offre exclusive ajoutée à votre nouveau panier !');
                  }}
                  onSelectProduct={handleSelectProduct}
                  blurredProductIds={blurredProductIds}
                  enableCrossSell={content.settings.boosters?.enableCrossSell ?? true}
                  enableUpsell={content.settings.boosters?.enableUpsell ?? true}
                  stage="purchase_completed"
                  variant="full"
                />
              </div>
            )}
          </section>
        )}

        {/* ============================================================ */}
        {/* 11. WISHLIST / LISTE DE SOUHAITS VIEW */}
        {/* ============================================================ */}
        {activeView === 'wishlist' && (
          <WishlistView
            wishlist={wishlist}
            products={products}
            onAddToCart={(productId, qty) => {
              handleAddToCart(productId, qty);
              showToast(lang === 'ar' ? 'تمت إضافة القطعة إلى سلة المشتريات ✦' : 'Pièce ajoutée au panier avec succès ✦');
            }}
            onRemoveFromWishlist={(productId) => {
              handleToggleWishlist(productId);
              showToast(lang === 'ar' ? 'تمت إزالة القطعة من قائمة الرغبات' : 'Pièce retirée de vos souhaits');
            }}
            onClearWishlist={() => {
              setWishlist([]);
              try {
                localStorage.removeItem('md_wish_store');
              } catch (e) {}
              showToast(lang === 'ar' ? 'تم تفريغ قائمة الرغبات' : 'Liste de souhaits vidée');
            }}
            onViewProduct={(productId) => {
              handleSelectProduct(productId);
            }}
            onExploreCollection={() => {
              setActiveView('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        products={products}
        lang={lang}
        freeShippingThreshold={content.settings.freeShippingThreshold}
        boosters={content.settings.boosters}
        isGiftPackaging={isGiftPackaging}
        onToggleGift={setIsGiftPackaging}
        giftNote={giftNote}
        onUpdateGiftNote={setGiftNote}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
        blurredProductIds={blurredProductIds}
        promotionRules={content.settings.boosters?.promotionRules || []}
        onCheckout={() => {
          setActiveView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Concierge Chat & WhatsApp Widgets */}
      <ChatWidget
        lang={lang}
        waNumber={content.settings.waNumber}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        lang={lang}
      />

      {/* Sales Booster: Social Proof Toast Notification */}
      {content.settings.boosters?.enableSocialProof !== false && (
        <SocialProofNotification
          products={products}
          lang={lang}
          intervalSec={content.settings.boosters?.socialProofIntervalSec || 15}
          onSelectProduct={(id) => {
            handleSelectProduct(id);
          }}
        />
      )}

      {/* Sales Booster: Exit Intent Promo Modal */}
      {content.settings.boosters?.enableExitIntentPopup !== false && (
        <ExitIntentModal
          promoCode={content.settings.boosters?.exitIntentPromoCode || 'BIENVENUE10'}
          discountPct={content.settings.boosters?.exitIntentDiscountPct || 10}
          lang={lang}
          onApplyCode={(code) => {
            handleApplyPromo(code);
            setActiveView('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Newsletter Section: Le Cercle Privé */}
      <NewsletterSection
        lang={lang}
        onSubscribed={(u) => {
          fetchUsers();
          showToast('Bienvenue au Cercle Privé Ovelzya ✦');
        }}
        showToast={showToast}
        promoCode={content.settings?.promoCode || 'BIENVENUE10'}
        onApplyCode={(code) => {
          handleApplyPromo(code);
          setActiveView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        socialLinks={content.settings?.socialLinks}
      />

      {/* Footer */}
      <Footer
        lang={lang}
        setActiveView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openAuth={() => setIsAuthOpen(true)}
        showToast={showToast}
        customLogoUrl={content.settings?.customLogoUrl}
        socialIcons={content.settings?.socialIcons}
        socialLinks={content.settings?.socialLinks}
        onUserSubscribed={() => fetchUsers()}
      />

      {/* Authentication & User Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          try {
            localStorage.setItem('md_user_store', JSON.stringify(user));
          } catch (e) {}
        }}
        onLogout={handleLogout}
        orders={orders}
        openAdmin={() => {
          setIsAdminOpen(true);
        }}
        lang={lang}
        showToast={showToast}
        products={products}
        onAddToCart={handleAddToCart}
        onViewProduct={(id) => {
          setSelectedProductId(id);
          setActiveView('product');
          setIsAuthOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPrintInvoice={handlePrintInvoice}
        onPrintWarranty={handlePrintWarranty}
        onUpdateUser={handleUpdateUser}
        warrantySettings={content.settings?.warranty}
        onSelectOrderForTracking={(num) => {
          setTrackQuery(num);
          setActiveView('track');
          setIsAuthOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        reviews={reviews}
        onAddReview={handleAddReview}
        onUpdateOrderStatus={handleAdminUpdateOrderStatus}
        onMessageSent={(newMsg) => setContacts((prev) => [newMsg, ...prev.filter((c) => c.id !== newMsg.id)])}
      />

      {/* FULL ADMIN DASHBOARD OVERLAY */}
      {isAdminOpen && (
        <AdminDashboard
          products={products}
          content={content}
          orders={orders}
          contacts={contacts}
          flash={flash}
          clients={clients}
          currentUser={currentUser}
          lang={lang}
          onUpdateProduct={handleAdminUpdateProduct}
          onCreateProduct={handleAdminCreateProduct}
          onDeleteProduct={handleAdminDeleteProduct}
          onDeleteOrder={handleAdminDeleteOrder}
          onDeleteContact={handleAdminDeleteContact}
          onReorderProducts={handleAdminReorderProducts}
          onUpdateContent={handleAdminUpdateContent}
          onUpdateFlash={handleAdminUpdateFlash}
          onUpdateOrderStatus={handleAdminUpdateOrderStatus}
          onMarkContactRead={handleAdminMarkContactRead}
          onUpdateClientStatus={handleUpdateClientStatus}
          onDeleteClient={handleDeleteClient}
          onCreateClient={handleCreateClient}
          onPrintInvoice={handlePrintInvoice}
          onPrintReceipt={handlePrintReceipt}
          onPrintWarranty={handlePrintWarranty}
          onUpdateUser={handleUpdateUser}
          onRefreshUsers={fetchUsers}
          theme={theme}
          toggleTheme={toggleTheme}
          onResetData={handleAdminResetData}
          onCloseAdmin={() => setIsAdminOpen(false)}
          showToast={showToast}
        />
      )}

      {/* Printable Invoice Modal */}
      {isInvoiceOpen && invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          lang={lang}
          qrVerificationUrl={content.settings.qrVerificationUrl}
          onOpenTicket={() => {
            setReceiptOrder(invoiceOrder);
            setIsReceiptOpen(true);
          }}
        />
      )}

      {/* Printable Receipt Modal (80mm Thermal Printer) */}
      {isReceiptOpen && receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          lang={lang}
          qrVerificationUrl={content.settings.qrVerificationUrl}
          onOpenInvoice={() => {
            setInvoiceOrder(receiptOrder);
            setIsInvoiceOpen(true);
          }}
        />
      )}

      {/* Printable Warranty Certificate Modal */}
      {isWarrantyOpen && warrantyOrder && (
        <WarrantyModal
          order={warrantyOrder}
          isOpen={isWarrantyOpen}
          onClose={() => setIsWarrantyOpen(false)}
          lang={lang}
          qrVerificationUrl={content.settings.qrVerificationUrl}
          warrantySettings={content.settings?.warranty}
          onSaveWarrantySettings={async (w) => {
            const newContent = {
              ...content,
              settings: { ...content.settings, warranty: w },
            };
            await handleAdminUpdateContent(newContent);
            showToast('✦ Textes officiels du certificat enregistrés avec succès');
          }}
          canEdit={currentUser?.role === 'admin'}
        />
      )}

      {/* Visitor Social Media Sharing Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          product={shareProduct}
          lang={lang}
        />
      )}

      {/* Sleek Mobile Bottom Navigation */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cart.reduce((s, it) => s + it.qty, 0)}
        wishlistCount={wishlist.length}
        openCart={() => setIsCartOpen(true)}
        waNumber={content.settings.waNumber}
        lang={lang}
      />
    </div>
  );
}
