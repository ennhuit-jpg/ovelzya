'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS } from '@/lib/translations';
import { MessageSquare, X, Send } from 'lucide-react';
import OvelzyaLogo from './OvelzyaLogo';
import { Language } from '@/lib/types';

interface ChatWidgetProps {
  lang: Language;
  waNumber: string;
  onNavigate: (view: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export default function ChatWidget({ lang, waNumber, onNavigate: _onNavigate }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text:
        lang === 'fr'
          ? 'Bonjour ✦ Bienvenue à la conciergerie OVELZYA. Comment puis-je vous guider aujourd’hui ?'
          : 'مرحباً بكم ✦ في خدمة عملاء دار أوفيلزيا. كيف يمكنني مساعدتك اليوم؟',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(1);

  const t = (k: string) => TRANSLATIONS[lang]?.[k] || k;

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const quickQuestions = [
    t('chat_q1'),
    t('chat_q2'),
    t('chat_q3'),
    t('chat_q4'),
    t('chat_q5'),
    t('chat_q6'),
  ];

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('livraison') || q.includes('délai') || q.includes('توصيل') || q.includes('شحن')) {
      return lang === 'fr'
        ? '📦 Expédition sous 24 h ouvrées depuis Casablanca.\n• Livraison sous 2 à 5 jours partout au Maroc\n• Offerte dès 1500 DH\n• Paiement à la livraison disponible.'
        : '📦 الشحن خلال 24 ساعة عمل من الدار البيضاء.\n• التوصيل خلال 2 إلى 5 أيام إلى كل مدن المغرب\n• مجاني ابتداءً من 1500 درهم\n• الدفع عند الاستلام متاح.';
    }
    if (q.includes('paiement') || q.includes('payer') || q.includes('cod') || q.includes('دفع')) {
      return lang === 'fr'
        ? '💳 Moyens acceptés :\n• Paiement à la livraison (espèces ou carte à réception)\n• Virement bancaire\n• Apple Pay & Google Pay\n• PayPal\n• Commande directe via WhatsApp.'
        : '💳 وسائل الدفع المعتمدة :\n• الدفع عند الاستلام نقداً أو بالبطاقة\n• تحويل بنكي\n• Apple Pay و Google Pay\n• PayPal\n• إتمام الطلب مباشرة على واتساب.';
    }
    if (q.includes('matière') || q.includes('316') || q.includes('pvd') || q.includes('مادة') || q.includes('ذهب')) {
      return lang === 'fr'
        ? '✦ Toutes nos pièces sont conçues en acier chirurgical 316L et plaquées or 18 carats par procédé PVD sous vide. Elles résistent à l’eau, aux douches et ne noircissent jamais.'
        : '✦ جميع قطعنا مصممة من الفولاذ الجراحي 316L ومطلية بذهب 18 قيراطاً بتقنية PVD المفرغة. مقاومة للماء والاستحمام ولا تسود أبداً.';
    }
    if (q.includes('taille') || q.includes('guide') || q.includes('مقاس')) {
      return lang === 'fr'
        ? '📏 Consultez le Guide des Tailles complet présent sur chaque fiche produit ou dans le menu Matériaux pour choisir votre bague (tailles 48 à 66) ou bracelet.'
        : '📏 راجع دليل المقاسات الكامل المتوفر في كل صفحة منتج لاختيار مقاس خاتمك (من 48 إلى 66) أو سوارك بدقة.';
    }
    if (q.includes('suiv') || q.includes('commande') || q.includes('track') || q.includes('تتبع')) {
      return lang === 'fr'
        ? '🔍 Rendez-vous sur la page « Suivi » de notre menu avec votre numéro MD-XXXXXX pour voir l’état en temps réel de votre colis.'
        : '🔍 تفضل بزيارة صفحة « المتابعة » في القائمة برقم طلبك MD-XXXXXX لمشاهدة حالة شحنتك مباشرة.';
    }
    if (q.includes('conseiller') || q.includes('whatsapp') || q.includes('مستشار') || q.includes('واتساب')) {
      return lang === 'fr'
        ? `💬 Vous pouvez échanger directement avec notre conciergerie sur WhatsApp en cliquant sur la bulle verte en bas à gauche de votre écran.`
        : `💬 يمكنك التحدث مباشرة مع خدمة العملاء على واتساب بالنقر على الفقاعة الخضراء أسفل الشاشة.`;
    }
    return lang === 'fr'
      ? 'Je suis à votre service pour toute question sur nos bijoux, la livraison ou le paiement. Cliquez sur les questions rapides ou écrivez votre demande.'
      : 'أنا في خدمتك لأي استفسار حول مجوهراتنا أو التوصيل أو الدفع. اختر من الأسئلة السريعة أو اكتب طلبك.';
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    counterRef.current += 1;
    const userMsg: ChatMessage = {
      id: `usr_${counterRef.current}`,
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setIsTyping(true);
    setTimeout(() => {
      counterRef.current += 1;
      const response = getBotResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${counterRef.current}`,
          sender: 'bot',
          text: response,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const waText = encodeURIComponent(
    lang === 'fr'
      ? 'Bonjour ✦ Je souhaite commander chez OVELZYA.'
      : 'مرحباً ✦ أريد الطلب من أوفيلزيا.'
  );

  return (
    <>
      {/* WhatsApp Green FAB on the bottom-left */}
      <a
        href={`https://wa.me/${waNumber}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp"
        className="fixed bottom-20 lg:bottom-6 left-4 sm:left-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25d366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition cursor-pointer"
        style={{
          boxShadow: '0 10px 30px rgba(37,211,102,0.4)',
        }}
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 448 512">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      </a>

      {/* Gold Concierge Chat FAB on the bottom-right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Conciergerie Chat"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#d4af37] hover:bg-[#e8c878] text-black flex items-center justify-center shadow-2xl hover:scale-105 transition cursor-pointer"
        style={{
          boxShadow: '0 10px 30px rgba(212,175,55,0.35)',
        }}
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Concierge Chat Popup Box */}
      {isOpen && (
        <div className="fixed bottom-36 lg:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-96 h-[500px] max-h-[75vh] bg-[#0f0f0f] border border-[rgba(212,175,55,0.3)] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-toast">
          {/* Header */}
          <div className="p-4 bg-[#151515] border-b border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <OvelzyaLogo variant="crest" size="sm" />
              <div>
                <h4 className="font-serif font-semibold text-white text-sm">
                  {t('chat_title')}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#9a958a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('chat_online')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#9a958a] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${
                  m.sender === 'bot'
                    ? 'bg-[#1b1b1b] border border-[#2a2a2a] border-l-2 border-l-[#d4af37] text-[#f4f1ea]'
                    : 'bg-[#d4af37] text-black font-medium ml-auto'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="bg-[#1b1b1b] border border-[#2a2a2a] text-[#d4af37] p-3 rounded-lg text-xs w-max flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] typing-dot" />
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="p-2 border-t border-[#222] bg-[#121212] flex gap-1.5 overflow-x-auto">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-full border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#262626] bg-[#101010] flex gap-2"
          >
            <input
              type="text"
              placeholder={t('chat_ph')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#181818] border border-[#2c2c2c] text-xs text-white px-3 py-2 rounded focus:border-[#d4af37] focus:outline-none"
            />
            <button
              type="submit"
              className="w-9 h-9 bg-[#d4af37] hover:bg-[#e8c878] text-black rounded flex items-center justify-center transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
