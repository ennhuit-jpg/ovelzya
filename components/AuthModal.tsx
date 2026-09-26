'use client';

import React, { useState, useMemo } from 'react';
import { RegisteredUser, Order, Language, Product, OrderStatus, ContactMessage, CustomerReview } from '@/lib/types';
import OvelzyaLogo from './OvelzyaLogo';
import WarrantyModal from './WarrantyModal';
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  Clock,
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Briefcase,
  KeyRound,
  Key,
  FileText,
  Heart,
  Globe,
  Package,
  Truck,
  RotateCcw,
  Check,
  ExternalLink,
  Edit3,
  Save,
  Download,
  MessageSquare,
  Send,
  MessageCircle,
  Star,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  PackageCheck,
} from 'lucide-react';
import EmailAccuracyField from './EmailAccuracyField';

export const INTERNATIONAL_COUNTRIES = [
  { code: 'MA', name: 'Maroc', name_ar: 'المغرب', name_en: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { code: 'FR', name: 'France', name_ar: 'فرنسا', name_en: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', name_ar: 'بلجيكا', name_en: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', name_ar: 'سويسرا', name_en: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', name_ar: 'كندا', name_en: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', name_ar: 'الولايات المتحدة', name_en: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'AE', name: 'Émirats Arabes Unis', name_ar: 'الإمارات العربية المتحدة', name_en: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Arabie Saoudite', name_ar: 'المملكة العربية السعودية', name_en: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', name_ar: 'قطر', name_en: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'KW', name: 'Koweït', name_ar: 'الكويت', name_en: 'Kuwait', dial: '+965', flag: '🇰🇼' },
  { code: 'GB', name: 'Royaume-Uni', name_ar: 'المملكة المتحدة', name_en: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'ES', name: 'Espagne', name_ar: 'إسبانيا', name_en: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', name_ar: 'إيطاليا', name_en: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'DE', name: 'Allemagne', name_ar: 'ألمانيا', name_en: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'NL', name: 'Pays-Bas', name_ar: 'هولندا', name_en: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'DZ', name: 'Algérie', name_ar: 'الجزائر', name_en: 'Algeria', dial: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie', name_ar: 'تونس', name_en: 'Tunisia', dial: '+216', flag: '🇹🇳' },
  { code: 'SN', name: 'Sénégal', name_ar: 'السنغال', name_en: 'Senegal', dial: '+221', flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire", name_ar: 'ساحل العاج', name_en: 'Ivory Coast', dial: '+225', flag: '🇨🇮' },
  { code: 'OTHER', name: 'Autre pays', name_ar: 'دولة أخرى', name_en: 'Other Country', dial: '+', flag: '🌐' },
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: RegisteredUser | null;
  onLoginSuccess: (user: RegisteredUser) => void;
  onLogout: () => void;
  orders: Order[];
  openAdmin: () => void;
  lang?: Language;
  showToast: (m: string) => void;
  onSelectOrderForTracking?: (num: string) => void;
  products?: Product[];
  onAddToCart?: (productId: number, qty: number) => void;
  onViewProduct?: (productId: number) => void;
  onToggleFavorite?: (productId: number) => void;
  onPrintInvoice?: (order: Order) => void;
  onPrintWarranty?: (order: Order) => void;
  onUpdateUser?: (userData: Partial<RegisteredUser> & { id: string }) => Promise<void>;
  warrantySettings?: any;
  reviews?: CustomerReview[];
  onAddReview?: (review: CustomerReview) => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => Promise<void> | void;
  onMessageSent?: (msg: ContactMessage) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  orders,
  openAdmin,
  lang = 'fr',
  showToast,
  onSelectOrderForTracking,
  products = [],
  onAddToCart,
  onViewProduct,
  onToggleFavorite,
  onPrintInvoice,
  onPrintWarranty,
  onUpdateUser,
  warrantySettings,
  reviews = [],
  onAddReview,
  onUpdateOrderStatus,
  onMessageSent,
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  // Client Portal Active Sub-Tab (when logged in)
  const [clientSubTab, setClientSubTab] = useState<'orders' | 'favorites' | 'invoices' | 'messages' | 'reviews' | 'profile'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus | string>('all');

  // Client-to-Maison Messaging state
  const [clientMessages, setClientMessages] = useState<ContactMessage[]>([]);
  const [newMsgSubject, setNewMsgSubject] = useState('Question sur ma commande');
  const [newMsgOrderNum, setNewMsgOrderNum] = useState('');
  const [newMsgText, setNewMsgText] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Reviews and Real Photos state (for authenticated clients with orders)
  const [reviewProductId, setReviewProductId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewHoverRating, setReviewHoverRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Warranty Certificate Modal internal state
  const [warrantyOrder, setWarrantyOrder] = useState<Order | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Auto-fill saved credentials on mount
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        try {
          const saved = localStorage.getItem('ovelzya_saved_credentials');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.email) setLoginEmail(parsed.email);
            if (parsed.password) setLoginPassword(parsed.password);
            setRememberMe(true);
          }
        } catch {
          // ignore
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // International Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNewsletter, setRegNewsletter] = useState(true);
  const [regCountry, setRegCountry] = useState('Maroc');
  const [regCountryCode, setRegCountryCode] = useState('MA');
  const [regDialCode, setRegDialCode] = useState('+212');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPostalCode, setRegPostalCode] = useState('');
  const [regCity, setRegCity] = useState('Casablanca');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    countryCode: '',
    dialCode: '',
    address: '',
    postalCode: '',
    city: '',
    isNewsletterSubscriber: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch client messages from Maison
  const fetchClientMessages = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(
        `/api/contact?userId=${encodeURIComponent(currentUser.id)}&email=${encodeURIComponent(
          currentUser.email
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.contacts || []);
        setClientMessages(list);
      }
    } catch {
      // silent fallback
    }
  }, [currentUser]);

  // Initialize edit form and fetch messages when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => {
        setEditForm({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          country: currentUser.country || 'Maroc',
          countryCode: currentUser.countryCode || 'MA',
          dialCode: currentUser.dialCode || '+212',
          address: currentUser.address || '',
          postalCode: currentUser.postalCode || '',
          city: currentUser.city || 'Casablanca',
          isNewsletterSubscriber: !!currentUser.isNewsletterSubscriber,
        });
        fetchClientMessages();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentUser, fetchClientMessages]);

  const handleSendMessageToMaison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || !currentUser) return;
    setIsSendingMsg(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name || 'Client Ovelzya',
          email: currentUser.email,
          subject: newMsgSubject || 'Demande client privilégiée',
          message: newMsgText.trim(),
          userId: currentUser.id,
          orderNumber: newMsgOrderNum.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.id)) {
        const newMsgObj: ContactMessage = data.id && data.date ? data : {
          id: data.id || `msg_${Date.now()}`,
          date: new Date().toISOString(),
          name: currentUser.name || 'Client Ovelzya',
          email: currentUser.email,
          subject: newMsgSubject || 'Demande client privilégiée',
          message: newMsgText.trim(),
          read: false,
          userId: currentUser.id,
          orderNumber: newMsgOrderNum.trim() || undefined,
        };

        setNewMsgText('');
        setNewMsgSubject('Question sur ma commande');
        setNewMsgOrderNum('');
        setClientMessages((prev) => [newMsgObj, ...prev.filter((m) => m.id !== newMsgObj.id)]);

        if (onMessageSent) {
          onMessageSent(newMsgObj);
        }

        showToast(
          lang === 'ar'
            ? '✦ تم إرسال رسالتك إلى دار أوفيلزيا بنجاح'
            : '✦ Votre message a été transmis à la Conciergerie Ovelzya avec succès'
        );
        fetchClientMessages();
      } else {
        showToast(data.error || 'Erreur lors de l’envoi de votre message');
      }
    } catch {
      showToast('Erreur de connexion');
    } finally {
      setIsSendingMsg(false);
    }
  };

  // State & Handler for Customer Order Confirmation ("Reçu")
  const [isConfirmingOrderId, setIsConfirmingOrderId] = useState<string | null>(null);

  const handleConfirmOrderReceived = async (order: Order) => {
    setIsConfirmingOrderId(order.id);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: 'livree' as OrderStatus }),
      });

      if (res.ok) {
        if (onUpdateOrderStatus) {
          await onUpdateOrderStatus(order.id, 'livree');
        }
        showToast(
          lang === 'ar'
            ? '✦ تم تأكيد استلام طلبيتك بنجاح ! نتمنى لك دوام التألق مع ميزون أوفيلزيا'
            : '✦ Réception de votre commande confirmée avec succès ! Merci de votre confiance auprès de la Maison Ovelzya.'
        );
      } else {
        // Fallback update on error
        if (onUpdateOrderStatus) {
          await onUpdateOrderStatus(order.id, 'livree');
        }
        showToast(
          lang === 'ar'
            ? '✦ تم تأكيد الاستلام بنجاح'
            : '✦ Réception confirmée avec succès'
        );
      }
    } catch {
      if (onUpdateOrderStatus) {
        onUpdateOrderStatus(order.id, 'livree');
      }
      showToast('✦ Réception confirmée avec succès');
    } finally {
      setIsConfirmingOrderId(null);
    }
  };

  const handleCountryChange = (cCode: string) => {
    const found = INTERNATIONAL_COUNTRIES.find((c) => c.code === cCode);
    if (found) {
      setRegCountryCode(found.code);
      setRegCountry(found.name);
      setRegDialCode(found.dial);
      if (found.code === 'MA' && !regCity) setRegCity('Casablanca');
      else if (found.code === 'FR' && !regCity) setRegCity('Paris');
      else if (found.code === 'AE' && !regCity) setRegCity('Dubaï');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (lang === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Échec de la connexion.'));
      }

      if (rememberMe) {
        try {
          localStorage.setItem(
            'ovelzya_saved_credentials',
            JSON.stringify({ email: loginEmail, password: loginPassword })
          );
        } catch {}
      } else {
        try {
          localStorage.removeItem('ovelzya_saved_credentials');
        } catch {}
      }

      onLoginSuccess(data.user);
      showToast(
        data.user.role === 'admin'
          ? (lang === 'ar' ? '✦ تم فتح لوحة تحكم المدير العام' : '✦ Accès Administrateur déverrouillé')
          : data.user.role === 'commercial'
          ? (lang === 'ar' ? `✦ تم فتح الفضاء التجاري · ${data.user.name}` : `✦ Espace Commercial déverrouillé · ${data.user.name}`)
          : (lang === 'ar' ? `أهلاً بك، ${data.user.name} ✦` : `Bienvenue, ${data.user.name} ✦`)
      );

      if (data.user.role === 'admin' || data.user.role === 'commercial') {
        openAdmin();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ar' ? 'بيانات الاعتماد غير صالحة' : 'Identifiants invalides'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPassword && regPassword.length < 6) {
      setErrorMsg(lang === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(lang === 'ar' ? 'كلمات المرور غير متطابقة.' : 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const fullPhone = regPhone ? `${regDialCode} ${regPhone.trim().replace(/^0+/, '')}` : '';

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: regName,
          email: regEmail,
          phone: fullPhone,
          country: regCountry,
          countryCode: regCountryCode,
          dialCode: regDialCode,
          address: regAddress,
          postalCode: regPostalCode,
          city: regCity,
          password: regPassword,
          isNewsletterSubscriber: regNewsletter,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (lang === 'ar' ? 'تعذر إنشاء الحساب.' : "Impossible d'enregistrer le compte."));
      }

      if (rememberMe) {
        try {
          localStorage.setItem(
            'ovelzya_saved_credentials',
            JSON.stringify({ email: regEmail, password: regPassword })
          );
        } catch {}
      }

      onLoginSuccess(data.user);
      showToast(lang === 'ar' ? 'تم إنشاء حسابك الدولي بنجاح ✦ أهلاً بك في ميزون أوفيلزيا' : 'Votre compte international a été créé avec succès ✦ Bienvenue chez Maison Ovelzya');
      setTab('login');
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ar' ? 'خطأ أثناء التسجيل' : "Erreur lors de l'inscription"));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setForgotSuccessMsg(null);

    if (!forgotEmail) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال بريدك الإلكتروني.' : 'Veuillez saisir votre adresse email.');
      return;
    }
    if (forgotPassword.length < 6) {
      setErrorMsg(lang === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (forgotPassword !== forgotConfirmPassword) {
      setErrorMsg(lang === 'ar' ? 'كلمات المرور غير متطابقة.' : 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forgot_password',
          email: forgotEmail,
          newPassword: forgotPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (lang === 'ar' ? 'تعذر تعيين كلمة المرور.' : 'Impossible de réinitialiser le mot de passe.'));
      }

      setLoginEmail(forgotEmail);
      setLoginPassword(forgotPassword);
      if (rememberMe) {
        try {
          localStorage.setItem(
            'ovelzya_saved_credentials',
            JSON.stringify({ email: forgotEmail, password: forgotPassword })
          );
        } catch {}
      }
      setForgotSuccessMsg(
        lang === 'ar'
          ? 'تم حفظ كلمة المرور الجديدة ومزامنتها بنجاح ✦ يمكنك الآن تسجيل الدخول.'
          : '✦ Votre nouveau mot de passe a été enregistré et mémorisé avec succès.'
      );
      showToast(lang === 'ar' ? 'تم تحديث كلمة المرور ✦' : 'Mot de passe mis à jour et mémorisé ✦');
      setTimeout(() => {
        setTab('login');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ar' ? 'خطأ أثناء استعادة الحساب' : 'Erreur lors de la réinitialisation'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
      const payload = {
        id: currentUser.id,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        country: editForm.country,
        countryCode: editForm.countryCode,
        dialCode: editForm.dialCode,
        address: editForm.address,
        postalCode: editForm.postalCode,
        city: editForm.city,
        isNewsletterSubscriber: editForm.isNewsletterSubscriber,
      };

      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      if (onUpdateUser) {
        await onUpdateUser(data.user);
      }
      onLoginSuccess(data.user);
      setIsEditingProfile(false);
      showToast(
        lang === 'ar'
          ? '✦ تم تحديث ملفك الشخصي ومزامنة بيانات طلباتك'
          : '✦ Coordonnées et historique de vos commandes synchronisés avec succès'
      );
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders related to current logged-in user (match by email or user ID or phone)
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter((o) => {
      const emailMatch = o.email && currentUser.email && o.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim();
      const nameMatch = currentUser.name && o.name && o.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
      const phoneMatch = currentUser.phone && o.phone && o.phone.replace(/\D/g, '').includes(currentUser.phone.replace(/\D/g, '').slice(-8));
      return emailMatch || nameMatch || phoneMatch;
    });
  }, [currentUser, orders]);

  const filteredOrders = userOrders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // User Favorites Pieces
  const favoriteIds = currentUser?.favorites || [];
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  // Unique ordered products by this user across their verified orders
  const userOrderedProducts = useMemo(() => {
    const map = new Map<number, { productId: number; name: string; sku?: string; orderNum: string; orderDate: string; image?: string }>();
    userOrders.forEach((ord) => {
      ord.items?.forEach((it) => {
        if (!map.has(it.id)) {
          const prod = products.find((p) => p.id === it.id);
          map.set(it.id, {
            productId: it.id,
            name: prod
              ? lang === 'ar'
                ? prod.name_ar || prod.name_fr
                : lang === 'en'
                ? prod.name_en || prod.name_fr
                : prod.name_fr
              : it.name || `Bijou #${it.id}`,
            sku: prod?.sku || it.sku,
            orderNum: ord.num,
            orderDate: ord.date,
            image: prod?.images?.[0] || prod?.image,
          });
        }
      });
    });
    return Array.from(map.values());
  }, [userOrders, products, lang]);

  // Reviews authored by current user
  const userReviews = useMemo(() => {
    if (!reviews || !currentUser) return [];
    return reviews.filter((r) => {
      const authorMatch =
        (r.author && currentUser.name && r.author.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) ||
        (r.author && currentUser.email && r.author.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
      return authorMatch;
    });
  }, [reviews, currentUser]);

  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReviewPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    setTimeout(() => setIsUploadingPhoto(false), 300);
  };

  const handleRemoveReviewPhoto = (index: number) => {
    setReviewPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmitUserReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (userOrders.length === 0) {
      showToast(
        lang === 'ar'
          ? 'عذراً، التقييم متاح فقط للزبونات اللواتي قمن بالطلب عبر الحساب.'
          : 'Accès strictement réservé aux clientes ayant finalisé au moins une commande avec leur compte.'
      );
      return;
    }
    if (!reviewProductId) {
      showToast(
        lang === 'ar'
          ? 'يرجى اختيار القطعة التي تودين تقييمها'
          : 'Veuillez sélectionner le bijou commandé à évaluer.'
      );
      return;
    }
    if (!reviewComment.trim()) {
      showToast(
        lang === 'ar'
          ? 'يرجى كتابة نص التقييم'
          : 'Veuillez rédiger votre avis.'
      );
      return;
    }

    const prod = products.find((p) => p.id === reviewProductId);
    const orderedInfo = userOrderedProducts.find((p) => p.productId === reviewProductId);

    const newRev: CustomerReview = {
      id: `rev-${currentUser.id || 'client'}-${Date.now()}`,
      productId: reviewProductId,
      productName: prod
        ? lang === 'ar'
          ? prod.name_ar || prod.name_fr
          : prod.name_fr
        : orderedInfo?.name || 'Bijou Maison Ovelzya',
      productSku: prod?.sku || orderedInfo?.sku || 'OVZ-EXCLUSIVE',
      author: currentUser.name || currentUser.email.split('@')[0],
      city: currentUser.city || 'Casablanca',
      country: currentUser.country || 'Maroc',
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      title: reviewTitle.trim() || (reviewRating === 5 ? 'Création d’exception, éclat parfait' : 'Très satisfaite'),
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      photos: reviewPhotos,
      likes: 0,
    };

    if (onAddReview) {
      onAddReview(newRev);
    }
    showToast(
      lang === 'ar'
        ? '✦ تم تسجيل ونشر تقييمك وصورك الموثقة بنجاح في حسابك !'
        : '✦ Votre avis vérifié et vos photos ont été enregistrés avec succès !'
    );
    setReviewTitle('');
    setReviewComment('');
    setReviewPhotos([]);
    setReviewProductId(null);
  };

  // Helper for Order Status labels and colors
  const getStatusBadge = (status: OrderStatus | string) => {
    switch (status) {
      case 'reçue':
      case 'en_attente':
        return {
          label: lang === 'ar' ? 'تم الاستلام' : (lang === 'en' ? 'Received' : 'Commande Reçue'),
          cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        };
      case 'preparation':
      case 'en_preparation':
        return {
          label: lang === 'ar' ? 'قيد التحضير' : (lang === 'en' ? 'Preparing' : 'En préparation'),
          cls: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
        };
      case 'expediee':
        return {
          label: lang === 'ar' ? 'تم الشحن' : (lang === 'en' ? 'Shipped' : 'Expédiée'),
          cls: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
        };
      case 'livraison':
        return {
          label: lang === 'ar' ? 'قيد التوصيل' : (lang === 'en' ? 'In Delivery' : 'En livraison'),
          cls: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
        };
      case 'livree':
        return {
          label: lang === 'ar' ? 'تم التسليم' : (lang === 'en' ? 'Delivered' : 'Livrée'),
          cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        };
      case 'annulee':
        return {
          label: lang === 'ar' ? 'ملغاة' : (lang === 'en' ? 'Cancelled' : 'Annulée'),
          cls: 'bg-red-500/15 text-red-400 border border-red-500/30',
        };
      default:
        return { label: status, cls: 'bg-zinc-800 text-zinc-300' };
    }
  };

  const handleOpenWarranty = (order: Order) => {
    if (onPrintWarranty) {
      onPrintWarranty(order);
    } else {
      setWarrantyOrder(order);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div className={`relative w-full ${currentUser ? 'max-w-5xl xl:max-w-6xl' : 'max-w-xl'} bg-[#111111] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden text-[#f4f1ea] my-auto transition-all duration-300`}>
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 border-b border-[#262626] bg-[#0c0c0c]">
            <div className="flex items-center gap-3">
              <OvelzyaLogo variant="header" size="sm" />
              <span className="text-[10px] uppercase tracking-widest text-[#9a958a] border-l border-[#333] pl-2 hidden sm:inline">
                {currentUser
                  ? (lang === 'ar' ? 'الفضاء الشخصي الدولي' : (lang === 'en' ? 'Client Portal' : 'Espace Client International'))
                  : (lang === 'ar' ? 'انضمام للدائرة الخاصة' : (lang === 'en' ? 'Membership & Login' : 'Espace Membre International'))}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1c1c1c] hover:bg-[#2c2c2c] text-[#999] hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ============================================================ */}
          {/* LOGGED IN USER CLIENT PORTAL */}
          {/* ============================================================ */}
          {currentUser ? (
            <div className="p-4 sm:p-6 space-y-5">
              
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] p-4 sm:p-5 rounded-lg border border-[#2a2a2a]">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-full bg-[#d4af37]/15 border border-[#d4af37] text-[#d4af37] flex items-center justify-center font-serif text-xl font-bold shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white">{currentUser.name}</h3>
                      {currentUser.role === 'admin' && (
                        <span className="px-2 py-0.5 rounded bg-[#d4af37] text-black font-bold text-[10px] uppercase tracking-wider">
                          Directeur / Admin
                        </span>
                      )}
                      {currentUser.role === 'commercial' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-emerald-400" />
                          Commercial
                        </span>
                      )}
                      {currentUser.country && (
                        <span className="px-2 py-0.5 rounded bg-[#222] text-[#cfcbc2] border border-[#333] text-[10px] flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5 text-[#d4af37]" />
                          {currentUser.country}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#999] mt-0.5">{currentUser.email}</p>
                    <p className="text-[11px] text-[#777] mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{currentUser.phone || 'Tél. non renseigné'}</span>
                      {currentUser.city && (
                        <>
                          <span>·</span>
                          <span>{currentUser.city}</span>
                        </>
                      )}
                      {currentUser.address && (
                        <>
                          <span>·</span>
                          <span className="truncate max-w-[180px]">{currentUser.address}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-xs text-[#d4af37] hover:text-[#e8c878] border border-[#d4af37]/30 hover:border-[#d4af37] px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingProfile ? 'Fermer' : 'Modifier profil'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      showToast('Déconnexion réussie');
                    }}
                    title="Se déconnecter"
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-2 rounded hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editing Profile Drawer / Form */}
              {isEditingProfile && (
                <form onSubmit={handleSaveProfile} className="p-4 bg-[#141414] border border-[#d4af37]/40 rounded-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                    <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Coordonnées & Adresse Internationale
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="text-xs text-[#888] hover:text-white"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">Nom complet</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                        className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <EmailAccuracyField
                        value={editForm.email}
                        onChange={(val) => setEditForm({ ...editForm, email: val })}
                        label="Adresse Email"
                        placeholder="votre.email@exemple.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">Pays de résidence</label>
                      <select
                        value={editForm.countryCode}
                        onChange={(e) => {
                          const found = INTERNATIONAL_COUNTRIES.find((c) => c.code === e.target.value);
                          if (found) {
                            setEditForm({
                              ...editForm,
                              countryCode: found.code,
                              country: found.name,
                              dialCode: found.dial,
                            });
                          }
                        }}
                        className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-[#d4af37] font-semibold rounded focus:border-[#d4af37] focus:outline-none"
                      >
                        {INTERNATIONAL_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} ({c.dial})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">Téléphone mobile (avec indicatif)</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+212 6..."
                        className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">Ville</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        placeholder="Casablanca / Paris / Genève..."
                        className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">Adresse de livraison (Rue, Résidence, Appartement)</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="14 Rue des Almohades, Apt 4"
                        className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">Code Postal / ZIP</label>
                      <input
                        type="text"
                        value={editForm.postalCode}
                        onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                        placeholder="20000 / 75001"
                        className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-[#262626]">
                      <label className="flex items-center gap-2 text-xs text-[#d4af37] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editForm.isNewsletterSubscriber}
                          onChange={(e) =>
                            setEditForm({ ...editForm, isNewsletterSubscriber: e.target.checked })
                          }
                          className="accent-[#d4af37] w-4 h-4 rounded cursor-pointer"
                        />
                        <span>Recevoir en avant-première les nouveautés, invitations privées et parures de la Maison</span>
                      </label>
                      <p className="text-[11px] text-emerald-400/90 flex items-center gap-1.5 mt-2 bg-emerald-950/20 border border-emerald-800/30 p-2 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>La mise à jour de vos coordonnées synchronise automatiquement l&apos;adresse et le contact de toutes vos commandes.</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{loading ? 'Enregistrement…' : 'Enregistrer mon profil'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Portal Button for Admin and Commercial */}
              {(currentUser.role === 'admin' || currentUser.role === 'commercial') && (
                <div className="p-3.5 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span className="text-white font-medium">
                      {currentUser.role === 'admin' ? 'Super Administrateur Ovelzya' : 'Agent Commercial Ovelzya'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      openAdmin();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-[11px] uppercase tracking-wider rounded transition cursor-pointer"
                  >
                    Ouvrir Panneau Admin →
                  </button>
                </div>
              )}

              {/* Navigation Tabs Inside User Account */}
              <div className="flex items-center gap-1 border-b border-[#262626] pb-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setClientSubTab('orders')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                    clientSubTab === 'orders'
                      ? 'bg-[#d4af37] text-black'
                      : 'text-[#9a958a] hover:text-white bg-[#181818]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Mes Commandes ({userOrders.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClientSubTab('invoices')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                    clientSubTab === 'invoices'
                      ? 'bg-[#d4af37] text-black'
                      : 'text-[#9a958a] hover:text-white bg-[#181818]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Mes Factures & Garanties ({userOrders.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClientSubTab('favorites')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                    clientSubTab === 'favorites'
                      ? 'bg-[#d4af37] text-black'
                      : 'text-[#9a958a] hover:text-white bg-[#181818]'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Mes Favoris ({favoriteProducts.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setClientSubTab('messages');
                    fetchClientMessages();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                    clientSubTab === 'messages'
                      ? 'bg-[#d4af37] text-black'
                      : 'text-[#9a958a] hover:text-white bg-[#181818]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Messages Maison {clientMessages.length > 0 && `(${clientMessages.length})`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClientSubTab('reviews')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer shrink-0 ${
                    clientSubTab === 'reviews'
                      ? 'bg-[#d4af37] text-black'
                      : 'text-[#9a958a] hover:text-white bg-[#181818]'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                  <span>Mes Avis & Photos ({userReviews.length})</span>
                </button>
              </div>

              {/* ============================================================ */}
              {/* SUBTAB 1: ORDERS WITH FILTERS (en attente, en préparation, livrée...) */}
              {/* ============================================================ */}
              {clientSubTab === 'orders' && (
                <div className="space-y-3">
                  {/* Status Pills Filter */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px]">
                    <span className="text-[#777] text-[10px] uppercase tracking-wider mr-1 hidden sm:inline">Filtrer :</span>
                    {[
                      { key: 'all', label: 'Toutes' },
                      { key: 'reçue', label: 'Reçues' },
                      { key: 'preparation', label: 'En préparation' },
                      { key: 'expediee', label: 'Expédiées' },
                      { key: 'livraison', label: 'En livraison' },
                      { key: 'livree', label: 'Livrées' },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setOrderStatusFilter(f.key as any)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer shrink-0 ${
                          orderStatusFilter === f.key
                            ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/60'
                            : 'bg-[#181818] text-[#888] hover:text-[#ccc] border border-[#282828]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Active Orders Quick Alert Banner */}
                  {userOrders.some((o) => ['preparation', 'en_preparation', 'expediee', 'livraison'].includes(o.status)) && (
                    <div className="p-3.5 bg-gradient-to-r from-sky-950/40 via-[#181818] to-purple-950/30 rounded-xl border border-sky-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 shrink-0">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {lang === 'ar'
                              ? 'لديك طلبية قيد التحضير أو الشحن ✦'
                              : 'Vous avez une commande en cours de préparation ou expédiée ✦'}
                          </p>
                          <p className="text-[11px] text-[#aaa]">
                            {lang === 'ar'
                              ? 'بمجرد استلامك للطرد، يرجى الضغط على زر "تأكيد الاستلام (تم الاستلام)" أدناه'
                              : 'Dès que vous avez reçu votre parure, confirmez la bonne réception en cliquant sur « Confirmer la réception (Reçu) »'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Orders List */}
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 rounded-lg border border-[#262626] bg-[#141414] text-center space-y-2">
                      <Package className="w-8 h-8 text-[#555] mx-auto" />
                      <p className="text-xs text-[#888]">
                        {userOrders.length === 0
                          ? "Aucune commande n'a encore été passée avec votre compte."
                          : "Aucune commande ne correspond au filtre sélectionné."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                      {filteredOrders.map((o) => {
                        const badge = getStatusBadge(o.status);
                        const isInPrep = o.status === 'preparation' || o.status === 'en_preparation';
                        const isShipped = o.status === 'expediee' || o.status === 'livraison';
                        const isDelivered = o.status === 'livree';

                        return (
                          <div
                            key={o.id}
                            className="p-4 sm:p-5 bg-[#161616] rounded-xl border border-[#2a2a2a] hover:border-[#d4af37]/50 transition space-y-4 shadow-lg"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222] pb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-sm text-white">{o.num}</span>
                                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${badge.cls}`}>
                                    {badge.label}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#777] mt-0.5">
                                  Passée le {new Date(o.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  {o.city && ` · Livraison à ${o.city}`}
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <span className="font-serif font-bold text-[#d4af37] text-base sm:text-lg">
                                  {o.total.toLocaleString('fr-FR')} DH
                                </span>
                                <span className="text-[10px] text-[#777] block">{o.payMethod}</span>
                              </div>
                            </div>

                            {/* Tracking & Customer Confirmation Bar (Reçu) */}
                            <div className="p-3 sm:p-3.5 rounded-lg bg-gradient-to-r from-[#1c1c1c] via-[#141414] to-[#121212] border border-[#2e2e2e] space-y-2.5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                                    {isInPrep && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />}
                                    {isShipped && <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />}
                                    {isDelivered && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                                    {isInPrep
                                      ? (lang === 'ar' ? '🛠️ قيد التحضير في ورشاتنا للذهب' : '🛠️ En cours de préparation dans nos ateliers')
                                      : isShipped
                                      ? (lang === 'ar' ? '📦 تم الشحن وفي الطريق إليكم' : '📦 Commande expédiée · En cours d’acheminement')
                                      : isDelivered
                                      ? (lang === 'ar' ? '✅ تم استلام الطلبية وتأكيدها (تم الاستلام)' : '✅ Colis réceptionné · Commande reçue')
                                      : (lang === 'ar' ? '📋 تم تسجيل وتأكيد الطلبية' : '📋 Commande confirmée et enregistrée')}
                                  </span>
                                </div>

                                {!isDelivered ? (
                                  <button
                                    type="button"
                                    disabled={isConfirmingOrderId === o.id}
                                    onClick={() => handleConfirmOrderReceived(o)}
                                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-emerald-900/40 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>
                                      {isConfirmingOrderId === o.id
                                        ? (lang === 'ar' ? 'جاري التأكيد...' : 'Confirmation...')
                                        : (lang === 'ar' ? 'تأكيد الاستلام (تم الاستلام)' : 'Confirmer la réception (Reçu)')}
                                    </span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1 shrink-0">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>{lang === 'ar' ? 'تم الاستلام بنجاح ✓' : 'Réception confirmée par vous (Reçu) ✓'}</span>
                                  </span>
                                )}
                              </div>

                              {/* Visual 4-Step Stepper */}
                              <div className="pt-1">
                                <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center font-mono">
                                  <div className={`py-1 px-1.5 rounded ${o.status ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 font-bold' : 'bg-[#181818] text-[#666]'}`}>
                                    1. Enregistrée
                                  </div>
                                  <div className={`py-1 px-1.5 rounded ${['preparation', 'en_preparation', 'expediee', 'livraison', 'livree'].includes(o.status) ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold' : 'bg-[#181818] text-[#666]'}`}>
                                    2. Préparation
                                  </div>
                                  <div className={`py-1 px-1.5 rounded ${['expediee', 'livraison', 'livree'].includes(o.status) ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold' : 'bg-[#181818] text-[#666]'}`}>
                                    3. Expédiée
                                  </div>
                                  <div className={`py-1 px-1.5 rounded ${isDelivered ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-[#181818] text-[#666]'}`}>
                                    4. Reçue
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="space-y-1.5 text-xs">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[#ccc] py-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                                    <span>{it.name || `Bijou #${it.id}`}</span>
                                    <span className="text-[#777]">× {it.qty}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReviewProductId(it.id);
                                        setClientSubTab('reviews');
                                      }}
                                      className="text-[10px] text-[#d4af37] hover:text-[#f3d994] hover:underline flex items-center gap-0.5 ml-1.5 cursor-pointer"
                                    >
                                      <Star className="w-2.5 h-2.5 fill-[#d4af37]" />
                                      <span>Évaluer</span>
                                    </button>
                                  </div>
                                  <span className="text-[#999] font-mono">{(it.price * it.qty).toLocaleString('fr-FR')} DH</span>
                                </div>
                              ))}
                            </div>

                            {/* Action Buttons: Facture, Garantie, Suivi, Avis */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222] flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  if (o.items && o.items[0]) {
                                    setReviewProductId(o.items[0].id);
                                  }
                                  setClientSubTab('reviews');
                                }}
                                className="px-2.5 py-1 text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 flex items-center gap-1 font-medium transition cursor-pointer"
                              >
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span>Donner mon avis & photos</span>
                              </button>
                              {onSelectOrderForTracking && (
                                <button
                                  onClick={() => {
                                    onSelectOrderForTracking(o.num);
                                    onClose();
                                  }}
                                  className="px-2.5 py-1 text-[11px] text-[#cfcbc2] hover:text-white bg-[#222] hover:bg-[#2c2c2c] rounded border border-[#333] flex items-center gap-1 transition cursor-pointer"
                                >
                                  <Truck className="w-3 h-3 text-amber-400" />
                                  <span>Suivre le colis</span>
                                </button>
                              )}

                              {onPrintInvoice && (
                                <button
                                  onClick={() => onPrintInvoice(o)}
                                  className="px-2.5 py-1 text-[11px] text-[#d4af37] hover:text-[#e8c878] bg-[#1a1a1a] hover:bg-[#252525] rounded border border-[#d4af37]/40 flex items-center gap-1 transition cursor-pointer"
                                >
                                  <FileText className="w-3 h-3 text-[#d4af37]" />
                                  <span>Facture PDF</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenWarranty(o)}
                                className="px-2.5 py-1 text-[11px] text-[#d4af37] hover:text-[#e8c878] bg-[#1c1c1c] hover:bg-[#282828] rounded border border-[#d4af37] flex items-center gap-1 font-semibold transition cursor-pointer"
                              >
                                <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                                <span>Garantie PDF</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* SUBTAB 2: INVOICES & GUARANTEES */}
              {/* ============================================================ */}
              {clientSubTab === 'invoices' && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#181818] rounded border border-[#2a2a2a] text-xs text-[#9a958a] flex items-center justify-between">
                    <span>Téléchargez vos factures d&apos;achat officielles et certificats de garantie Maison Ovelzya.</span>
                    <span className="text-[#d4af37] font-semibold text-xs font-mono">{userOrders.length} document(s)</span>
                  </div>

                  {userOrders.length === 0 ? (
                    <div className="p-8 rounded-lg border border-[#262626] bg-[#141414] text-center text-xs text-[#777]">
                      Aucune facture enregistrée pour le moment.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {userOrders.map((o) => (
                        <div
                          key={o.id}
                          className="p-3.5 bg-[#161616] rounded-lg border border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#d4af37]" />
                              <span className="font-mono font-bold text-sm text-white">Facture {o.num}</span>
                              <span className="text-[10px] text-[#888]">
                                · {new Date(o.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-xs text-[#888] mt-1">
                              Montant total : <strong className="text-white">{o.total.toLocaleString('fr-FR')} DH</strong> ({o.items.length} pièce(s))
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {onPrintInvoice && (
                              <button
                                onClick={() => onPrintInvoice(o)}
                                className="px-3 py-1.5 bg-[#202020] hover:bg-[#2a2a2a] text-white border border-[#333] hover:border-[#d4af37] rounded text-xs flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                                <span>Facture A4</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenWarranty(o)}
                              className="px-3 py-1.5 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/50 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>Certificat Garantie</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* SUBTAB 3: FAVORITES */}
              {/* ============================================================ */}
              {clientSubTab === 'favorites' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#9a958a] px-1">
                    <span>Vos bijoux coup de cœur sauvegardés dans votre espace privé.</span>
                    <span className="text-[#d4af37] font-semibold">{favoriteProducts.length} bijou(x)</span>
                  </div>

                  {favoriteProducts.length === 0 ? (
                    <div className="p-8 rounded-lg border border-[#262626] bg-[#141414] text-center space-y-2">
                      <Heart className="w-8 h-8 text-[#555] mx-auto" />
                      <p className="text-xs text-[#888]">
                        Vous n&apos;avez pas encore ajouté de bijoux à vos favoris.
                      </p>
                      <p className="text-[11px] text-[#666]">
                        Cliquez sur le cœur d&apos;un bijou dans le catalogue pour le retrouver ici à tout moment.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                      {favoriteProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 bg-[#161616] rounded-lg border border-[#2a2a2a] flex items-center justify-between gap-3 hover:border-[#d4af37]/40 transition"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.img || (p.images && p.images[0]) || '/placeholder.jpg'}
                              alt={p.name}
                              className="w-14 h-14 object-cover rounded border border-[#333] shrink-0"
                            />
                            <div>
                              <h4 className="text-xs font-serif font-bold text-white line-clamp-1">{p.name}</h4>
                              <p className="text-[11px] text-[#d4af37] font-semibold mt-0.5">
                                {p.price.toLocaleString('fr-FR')} DH
                              </p>
                              <span className="text-[10px] text-[#777]">{p.cat}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 shrink-0">
                            {onAddToCart && (
                              <button
                                onClick={() => {
                                  onAddToCart(p.id, 1);
                                  showToast('Ajouté au panier ✦');
                                }}
                                className="px-2.5 py-1 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-[10px] uppercase rounded transition cursor-pointer"
                              >
                                Panier
                              </button>
                            )}
                            {onViewProduct && (
                              <button
                                onClick={() => {
                                  onViewProduct(p.id);
                                  onClose();
                                }}
                                className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-[#ccc] hover:text-white text-[10px] uppercase rounded transition cursor-pointer"
                              >
                                Voir
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* SUBTAB 4: MESSAGES & DIRECT CONTACT WITH MAISON */}
              {/* ============================================================ */}
              {clientSubTab === 'messages' && (
                <div className="space-y-4">
                  {/* Concierge Intro Card */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#171717] to-[#121212] border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#d4af37]" />
                        <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                          Conciergerie Privée & Échanges Maison
                        </h4>
                      </div>
                      <p className="text-xs text-[#9a958a] mt-1 max-w-xl">
                        Un canal direct et confidentiel avec nos conseillers joailliers. Posez vos questions sur vos commandes, garanties ou demandes sur-mesure.
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/212660000000?text=${encodeURIComponent(
                        `Bonjour Maison Ovelzya, je suis ${currentUser.name} (${currentUser.email}). J'ai une demande concernant mon compte client.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#25d366]/15 hover:bg-[#25d366] text-[#25d366] hover:text-black border border-[#25d366]/40 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 self-start sm:self-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Concierge Direct</span>
                    </a>
                  </div>

                  {/* Form to send new message to Maison */}
                  <form
                    onSubmit={handleSendMessageToMaison}
                    className="p-4 bg-[#141414] border border-[#262626] rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#222] pb-2">
                      <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" />
                        Envoyer un message à la Maison
                      </span>
                      <span className="text-[10px] text-[#777]">
                        Réponse sous 24h ouvrées
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">
                          Sujet de votre demande *
                        </label>
                        <select
                          value={newMsgSubject}
                          onChange={(e) => setNewMsgSubject(e.target.value)}
                          className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none"
                        >
                          <option value="Question sur ma commande">Question sur ma commande</option>
                          <option value="Suivi de livraison & expédition">Suivi de livraison & expédition</option>
                          <option value="Certificat d'authenticité & Garantie">Certificat d&apos;authenticité & Garantie</option>
                          <option value="Demande de création sur-mesure ou gravure">Demande de création sur-mesure ou gravure</option>
                          <option value="Service après-vente & entretien bijoux">Service après-vente & entretien bijoux</option>
                          <option value="Autre demande privilégiée">Autre demande privilégiée</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">
                          Commande concernée (optionnel)
                        </label>
                        <select
                          value={newMsgOrderNum}
                          onChange={(e) => setNewMsgOrderNum(e.target.value)}
                          className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-[#d4af37] rounded focus:border-[#d4af37] focus:outline-none font-mono"
                        >
                          <option value="">-- Aucune commande spécifique --</option>
                          {userOrders.map((o) => (
                            <option key={o.id} value={o.num}>
                              Commande {o.num} ({new Date(o.date).toLocaleDateString('fr-FR')} - {o.total.toLocaleString('fr-FR')} DH)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">
                        Votre message *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newMsgText}
                        onChange={(e) => setNewMsgText(e.target.value)}
                        placeholder="Détaillez votre demande ou toute précision utile pour notre équipe..."
                        className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white placeholder-[#666] rounded focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#666]">
                        Transmis sous le compte client : <b className="text-[#aaa]">{currentUser.email}</b>
                      </span>
                      <button
                        type="submit"
                        disabled={isSendingMsg || !newMsgText.trim()}
                        className="px-4 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSendingMsg ? 'Transmission…' : 'Envoyer à la Maison'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Thread History */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#d4af37]">
                        Historique de vos échanges ({clientMessages.length})
                      </span>
                      <button
                        type="button"
                        onClick={fetchClientMessages}
                        className="text-[11px] text-[#888] hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Actualiser</span>
                      </button>
                    </div>

                    {clientMessages.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-[#262626] rounded-lg bg-[#121212]">
                        <MessageSquare className="w-8 h-8 text-[#555] mx-auto mb-2" />
                        <p className="text-xs text-[#aaa]">Vous n&apos;avez encore aucun message échangé avec la Maison.</p>
                        <p className="text-[11px] text-[#666] mt-1">
                          Utilisez le formulaire ci-dessus pour nous poser vos questions ou nous faire part de vos demandes.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {clientMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className="p-4 bg-[#141414] rounded-lg border border-[#262626] space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#222] pb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-white">{msg.subject}</span>
                                {msg.orderNumber && (
                                  <span className="px-2 py-0.5 rounded bg-[#202020] text-[#d4af37] border border-[#d4af37]/30 font-mono text-[10px]">
                                    Commande #{msg.orderNumber}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#777] font-mono">
                                {new Date(msg.date).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            {/* Client Message */}
                            <div className="bg-[#1a1a1a] p-3 rounded border border-[#2d2d2d] text-xs text-[#ddd] whitespace-pre-wrap">
                              {msg.message}
                            </div>

                            {/* Maison Response if any */}
                            {msg.reply ? (
                              <div className="p-3.5 bg-[#17140b] rounded-lg border border-[#d4af37]/40 space-y-1.5 ml-3 sm:ml-6">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                                    Réponse officielle de la Maison Ovelzya
                                  </span>
                                  {msg.repliedAt && (
                                    <span className="text-[10px] text-[#999] font-mono">
                                      {new Date(msg.repliedAt).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#eee] leading-relaxed whitespace-pre-wrap">
                                  {msg.reply}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-[11px] text-[#888] bg-[#161616] p-2 rounded border border-[#222]">
                                <Clock className="w-3 h-3 text-[#d4af37] animate-pulse" />
                                <span>Demande reçue · En cours de prise en charge par notre Conciergerie</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SUBTAB 5: REVIEWS & REAL PHOTOS (STRICTLY RESERVED TO CLIENTS WITH ORDERS) */}
              {/* ============================================================ */}
              {clientSubTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-3.5 bg-[#171717] rounded-xl border border-[#2a2a2a] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                        <Star className="w-4 h-4 fill-[#d4af37]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-serif font-bold text-white">
                          {lang === 'ar' ? 'تقييمات وصور الزبونات الموثقة' : 'Avis Certifiés & Photos Réelles'}
                        </h4>
                        <p className="text-[11px] text-[#888]">
                          {lang === 'ar'
                            ? 'مخصصة حصرياً للزبونات اللواتي قمن بالطلب عبر حسابهن'
                            : 'Accès strictement réservé aux commandes vérifiées'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {userOrders.length > 0 ? `✦ ${userOrders.length} Commande(s) Vérifiée(s)` : '✦ Compte Client'}
                    </span>
                  </div>

                  {/* RESTRICTION NOTICE IF NO ORDERS */}
                  {userOrders.length === 0 ? (
                    <div className="p-8 rounded-xl border border-amber-500/30 bg-[#16140f] text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#d4af37] mx-auto">
                        <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <h3 className="text-sm font-serif font-bold text-white">
                        {lang === 'ar'
                          ? 'التقييمات مقتصرة على الطلبات المؤكدة'
                          : 'Accès strictement réservé aux clientes ayant commandé'}
                      </h3>
                      <p className="text-xs text-[#9a958a] max-w-md mx-auto leading-relaxed">
                        {lang === 'ar'
                          ? 'لكتابة تقييم ومشاركة صور حقيقية لقطعك، يجب أن تكوني قد قمت بطلب مؤكد عبر حسابك. هذا الإجراء يضمن الشفافية والأصالة التامة لشهادات زبونات الدار.'
                          : 'Pour déposer un avis et partager des photos réelles de vos bijoux, vous devez avoir passé au moins une commande avec votre compte. Cette exigence garantit l’authenticité absolue et la sincérité de chaque retour client.'}
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setClientSubTab('orders');
                          }}
                          className="px-4 py-2 bg-[#222] hover:bg-[#2c2c2c] text-[#cfcbc2] hover:text-white rounded text-xs border border-[#333] transition cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Voir mes commandes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* REVIEW COMPOSER */}
                      <form
                        onSubmit={handleSubmitUserReview}
                        className="p-4 sm:p-5 bg-[#151515] rounded-xl border border-[#2a2a2a] space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-[#222] pb-3">
                          <span className="text-xs uppercase tracking-wider font-semibold text-[#d4af37] flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>
                              {lang === 'ar' ? 'كتابة تقييم وإرفاق صور' : 'Rédiger mon avis & photos'}
                            </span>
                          </span>
                          <span className="text-[10px] text-[#888] font-mono">
                            Achat Certifié · {currentUser.name || currentUser.email}
                          </span>
                        </div>

                        {/* Product Selector */}
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">
                            Sélectionnez le bijou commandé *
                          </label>
                          <select
                            required
                            value={reviewProductId ?? ''}
                            onChange={(e) => setReviewProductId(Number(e.target.value))}
                            className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none"
                          >
                            <option value="">-- Choisir un bijou de vos commandes --</option>
                            {userOrderedProducts.map((p) => (
                              <option key={p.productId} value={p.productId}>
                                {p.name} {p.sku ? `(Réf : ${p.sku})` : ''} · Commande {p.orderNum}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Star Rating */}
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">
                            Note globale *
                          </label>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                onMouseEnter={() => setReviewHoverRating(star)}
                                onMouseLeave={() => setReviewHoverRating(0)}
                                className="p-1 hover:scale-110 transition cursor-pointer text-amber-400"
                              >
                                <Star
                                  className={`w-6 h-6 transition ${
                                    (reviewHoverRating || reviewRating) >= star
                                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                      : 'text-zinc-600'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-semibold text-[#d4af37] ml-2">
                              {reviewRating}/5 ·{' '}
                              {reviewRating === 5
                                ? 'Exceptionnel'
                                : reviewRating === 4
                                ? 'Très bien'
                                : reviewRating === 3
                                ? 'Bien'
                                : 'Moyen'}
                            </span>
                          </div>
                        </div>

                        {/* Review Title */}
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">
                            Titre de votre avis
                          </label>
                          <input
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="Ex : Éclat somptueux, finition d'une finesse rare..."
                            className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white placeholder-[#666] rounded focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        {/* Review Comment */}
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-[#888] block mb-1">
                            Votre avis détaillé *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Partagez vos impressions sur la qualité, la brillance, le confort et la tenue au quotidien..."
                            className="w-full bg-[#1b1b1b] border border-[#333] px-3 py-2 text-xs text-white placeholder-[#666] rounded focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        {/* Real Photos Upload */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-[#888]">
                              Photos réelles du bijou porté ({reviewPhotos.length})
                            </label>
                            <span className="text-[10px] text-[#666]">
                              JPG, PNG · Preuve visuelle authentique
                            </span>
                          </div>

                          <label className="border-2 border-dashed border-[#333] hover:border-[#d4af37] rounded-lg p-3 text-center block cursor-pointer bg-[#181818] transition">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleReviewPhotoUpload}
                              className="hidden"
                            />
                            <div className="flex items-center justify-center gap-2 text-xs text-[#aaa]">
                              <Camera className="w-4 h-4 text-[#d4af37]" />
                              <span>
                                {isUploadingPhoto ? 'Chargement des photos…' : 'Ajouter des photos réelles de votre bijou'}
                              </span>
                            </div>
                          </label>

                          {/* Photos previews */}
                          {reviewPhotos.length > 0 && (
                            <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar py-1">
                              {reviewPhotos.map((photo, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#333] group shrink-0"
                                >
                                  <img
                                    src={photo}
                                    alt={`Photo ${pIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveReviewPhoto(pIdx)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end pt-1">
                          <button
                            type="submit"
                            disabled={!reviewProductId || !reviewComment.trim()}
                            className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-lg shadow-[#d4af37]/20"
                          >
                            <Check className="w-4 h-4" />
                            <span>Publier mon avis vérifié</span>
                          </button>
                        </div>
                      </form>

                      {/* CLIENT'S PUBLISHED REVIEWS HISTORY */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs uppercase tracking-wider font-semibold text-[#d4af37]">
                            Mes avis publiés ({userReviews.length})
                          </span>
                        </div>

                        {userReviews.length === 0 ? (
                          <div className="p-6 text-center border border-dashed border-[#262626] rounded-lg bg-[#121212]">
                            <Star className="w-8 h-8 text-[#555] mx-auto mb-2" />
                            <p className="text-xs text-[#aaa]">
                              Vous n&apos;avez pas encore publié d&apos;avis pour vos commandes.
                            </p>
                            <p className="text-[11px] text-[#666] mt-1">
                              Utilisez le formulaire ci-dessus pour évaluer l&apos;un de vos bijoux commandés.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {userReviews.map((rev) => (
                              <div
                                key={rev.id}
                                className="p-4 bg-[#141414] rounded-lg border border-[#262626] space-y-2.5"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#222] pb-2">
                                  <div>
                                    <span className="font-semibold text-xs text-white">
                                      {rev.productName || 'Bijou commandé'}
                                    </span>
                                    {rev.productSku && (
                                      <span className="text-[10px] text-[#777] ml-2 font-mono">
                                        Réf: {rev.productSku}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center text-amber-400">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                          key={s}
                                          className={`w-3 h-3 ${
                                            s <= rev.rating
                                              ? 'fill-amber-400 text-amber-400'
                                              : 'text-zinc-600'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[10px] text-[#777] font-mono">
                                      {new Date(rev.date).toLocaleDateString('fr-FR')}
                                    </span>
                                  </div>
                                </div>

                                {rev.title && (
                                  <h5 className="text-xs font-semibold text-[#e8c878]">
                                    {rev.title}
                                  </h5>
                                )}

                                <p className="text-xs text-[#cfcbc2] leading-relaxed">
                                  {rev.comment}
                                </p>

                                {rev.photos && rev.photos.length > 0 && (
                                  <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                                    {rev.photos.map((pUrl, pIndex) => (
                                      <img
                                        key={pIndex}
                                        src={pUrl}
                                        alt={`Photo ${pIndex + 1}`}
                                        className="w-14 h-14 rounded-md object-cover border border-[#333]"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Logout Footer */}
              <div className="pt-3 border-t border-[#222] flex items-center justify-between text-xs">
                <span className="text-[#666] text-[11px]">
                  Maison Ovelzya · Haute Joaillerie & Service Client International
                </span>
                <button
                  onClick={() => {
                    onLogout();
                    showToast('Déconnexion réussie');
                  }}
                  className="text-xs text-[#888] hover:text-red-400 transition cursor-pointer"
                >
                  Se déconnecter
                </button>
              </div>

            </div>
          ) : (
            /* ============================================================ */
            /* ANONYMOUS USER: LOGIN OR INTERNATIONAL REGISTRATION */
            /* ============================================================ */
            <div>
              {/* Tab selector */}
              <div className="grid grid-cols-2 border-b border-[#262626] bg-[#0f0f0f]">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setErrorMsg(null);
                  }}
                  className={`py-3.5 text-xs font-semibold uppercase tracking-wider transition ${
                    tab === 'login'
                      ? 'text-[#d4af37] border-b-2 border-[#d4af37] bg-[#141414]'
                      : 'text-[#888] hover:text-[#bbb]'
                  }`}
                >
                  {lang === 'ar' ? 'تسجيل الدخول' : (lang === 'en' ? 'Sign In' : 'Se connecter')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMsg(null);
                  }}
                  className={`py-3.5 text-xs font-semibold uppercase tracking-wider transition ${
                    tab === 'register'
                      ? 'text-[#d4af37] border-b-2 border-[#d4af37] bg-[#141414]'
                      : 'text-[#888] hover:text-[#bbb]'
                  }`}
                >
                  {lang === 'ar' ? 'إنشاء حساب دولي' : (lang === 'en' ? 'Create Account' : 'Créer un compte')}
                </button>
              </div>

              <div className="p-5 sm:p-7">
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* 1. LOGIN FORM */}
                {tab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1.5">
                        {lang === 'ar' ? 'البريد الإلكتروني' : (lang === 'en' ? 'Email Address' : 'Adresse Email')}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          name="email"
                          autoComplete="username"
                          required
                          placeholder="nom@exemple.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] pl-10 pr-3 py-2.5 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1.5">
                        {lang === 'ar' ? 'كلمة المرور' : (lang === 'en' ? 'Password' : 'Mot de passe')}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          autoComplete="current-password"
                          required
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] pl-10 pr-10 py-2.5 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#aaa]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me indicator and checkbox */}
                    <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
                      <label className="flex items-center gap-2 cursor-pointer text-[#bbb] hover:text-white">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="accent-[#d4af37] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                        <span className="text-[11px]">
                          {lang === 'ar' ? 'تذكر بياناتي وكلمة المرور' : 'Se souvenir de mes identifiants'}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setTab('forgot');
                          setForgotEmail(loginEmail);
                          setErrorMsg(null);
                          setForgotSuccessMsg(null);
                        }}
                        className="text-[11px] text-[#d4af37] hover:underline"
                      >
                        {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
                      </button>
                    </div>

                    {loginEmail && loginPassword && rememberMe && (
                      <div className="text-[10px] text-[#d4af37]/80 flex items-center gap-1.5 bg-[#d4af37]/10 px-2.5 py-1.5 rounded border border-[#d4af37]/20">
                        <Sparkles className="w-3 h-3 text-[#d4af37]" />
                        <span>{lang === 'ar' ? 'بيانات الاعتماد محفوظة تلقائياً على هذا الجهاز' : '✦ Vos identifiants sont mémorisés pour une connexion instantanée'}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.16em] rounded transition flex items-center justify-center gap-2 shadow mt-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span>{lang === 'ar' ? 'جاري التحقق…' : 'Connexion en cours…'}</span>
                      ) : (
                        <>
                          <span>{lang === 'ar' ? 'دخول إلى حسابي' : 'Connexion'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Admin Test credentials helper */}
                    <div className="pt-3 border-t border-[#222] text-center">
                      <p className="text-[10px] text-[#666]">
                        Accès Administration : utilisez les identifiants officiels Ovelzya.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('admin@ovelzya.com');
                          setLoginPassword('AdminOvelzya2026!');
                        }}
                        className="text-[10px] text-[#d4af37]/70 hover:text-[#d4af37] hover:underline mt-1 inline-block"
                      >
                        (Remplir identifiants Admin de test : admin@ovelzya.com)
                      </button>
                    </div>
                  </form>
                )}

                {/* 3. FORGOT / RESET PASSWORD FORM */}
                {tab === 'forgot' && (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div className="p-3 bg-[#181818] border border-[#d4af37]/40 rounded-lg text-xs space-y-1">
                      <div className="flex items-center gap-2 text-[#d4af37] font-semibold">
                        <Key className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'استعادة وتحديث كلمة المرور' : 'Réinitialisation du mot de passe'}</span>
                      </div>
                      <p className="text-[#9a958a] text-[11px]">
                        {lang === 'ar'
                          ? 'أدخل بريدك الإلكتروني وكلمة المرور الجديدة ليتم حفظها ومزامنتها فوراً في حسابك.'
                          : 'Saisissez votre email et votre nouveau mot de passe pour le mémoriser et l\'enregistrer immédiatement.'}
                      </p>
                    </div>

                    {forgotSuccessMsg && (
                      <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded text-xs text-emerald-300">
                        {forgotSuccessMsg}
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1.5">
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Adresse Email'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="nom@exemple.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] pl-10 pr-3 py-2.5 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1.5">
                        {lang === 'ar' ? 'كلمة المرور الجديدة (6 أحرف على الأقل)' : 'Nouveau mot de passe (min. 6 caractères)'}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={forgotPassword}
                          onChange={(e) => setForgotPassword(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] pl-10 pr-10 py-2.5 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#aaa]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1.5">
                        {lang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirmer le nouveau mot de passe'}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] pl-10 pr-3 py-2.5 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTab('login');
                          setErrorMsg(null);
                        }}
                        className="px-4 py-2.5 border border-[#333] hover:border-[#555] text-xs text-[#ccc] hover:text-white rounded cursor-pointer"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Retour à la connexion'}
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. INTERNATIONAL REGISTER FORM */}
                {tab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="p-2.5 bg-[#161616] rounded border border-[#282828] text-[11px] text-[#9a958a] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>
                        Compte international valable au Maroc, en Europe, dans les pays du Golfe et en Amérique du Nord.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1">
                        Nom et Prénom
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="ex: Sarah Benjelloun"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] pl-10 pr-3 py-2 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <EmailAccuracyField
                        value={regEmail}
                        onChange={setRegEmail}
                        label="Adresse Email *"
                        placeholder="votre.email@exemple.com"
                        required
                      />
                    </div>

                    {/* International Country & Phone Dial */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1">
                          Pays de résidence
                        </label>
                        <select
                          value={regCountryCode}
                          onChange={(e) => handleCountryChange(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] px-3 py-2 rounded text-xs text-[#d4af37] font-semibold focus:border-[#d4af37] focus:outline-none"
                        >
                          {INTERNATIONAL_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.name} ({c.dial})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1">
                          Téléphone mobile
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2.5 bg-[#202020] border border-r-0 border-[#2a2a2a] rounded-l text-xs text-[#d4af37] font-mono font-semibold">
                            {regDialCode}
                          </span>
                          <input
                            type="tel"
                            required
                            placeholder="6 12 34 56 78"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className="w-full bg-[#171717] border border-[#2a2a2a] px-3 py-2 rounded-r text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* International Address & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1">
                          Adresse de livraison (Rue, Quartier)
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Boulevard d'Anfa, Résidence Ovelzya"
                            value={regAddress}
                            onChange={(e) => setRegAddress(e.target.value)}
                            className="w-full bg-[#171717] border border-[#2a2a2a] pl-10 pr-3 py-2 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Casablanca / Paris"
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] px-3 py-2 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1">
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Au moins 6 caractères"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] px-3 py-2 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#999] mb-1">
                          Confirmer mot de passe
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Répétez le mot de passe"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="w-full bg-[#171717] border border-[#2a2a2a] px-3 py-2 rounded text-xs text-[#f4f1ea] focus:border-[#d4af37] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#222] space-y-2">
                      <label className="flex items-center gap-2 text-xs text-[#bbb] hover:text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="accent-[#d4af37] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                        <span className="text-[11px]">
                          {lang === 'ar'
                            ? 'حفظ وتذكر بيانات الدخول وكلمة المرور على هذا الجهاز'
                            : 'Mémoriser automatiquement mes identifiants et mot de passe sur cet appareil'}
                        </span>
                      </label>

                      <label className="flex items-start gap-2 text-xs text-[#d4af37] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regNewsletter}
                          onChange={(e) => setRegNewsletter(e.target.checked)}
                          className="accent-[#d4af37] w-4 h-4 rounded mt-0.5 cursor-pointer"
                        />
                        <span className="text-[11px] text-[#ccc] leading-snug">
                          Je souhaite recevoir les nouveautés, collections exclusives et invitations privées de la Maison Ovelzya.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-[0.16em] rounded transition flex items-center justify-center gap-2 shadow mt-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Création de votre compte…' : 'Créer mon compte client international'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Internal Warranty Certificate Modal if opened directly from inside AuthModal */}
      {warrantyOrder && (
        <WarrantyModal
          isOpen={!!warrantyOrder}
          onClose={() => setWarrantyOrder(null)}
          order={warrantyOrder}
          lang={lang}
          warrantySettings={warrantySettings}
        />
      )}
    </>
  );
}
