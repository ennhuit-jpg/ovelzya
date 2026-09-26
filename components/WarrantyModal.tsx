'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Printer, Download, X, Award, CheckCircle2, QrCode, Sparkles, Globe, Edit3, Save, RotateCcw } from 'lucide-react';
import { Order, Language, WarrantySettings } from '@/lib/types';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import OvelzyaLogo from '@/components/OvelzyaLogo';
import jsPDF from 'jspdf';

export const DEFAULT_WARRANTY_SETTINGS: WarrantySettings = {
  certificateTitle: "Certificat d'Authenticité & Garantie",
  certificateSubtitle: "Attestation officielle de conformité métallurgique, d’étanchéité absolue et de tenue dans le temps",
  validityDuration: "Garantie Anti-Ternissement 10 Ans",
  goldPurityText: "Or 18K PVD (0.8–1.5 µm)",
  clauseWaterproofTitle: "1. Garantie Waterproof 100% (Immersion Totale)",
  clauseWaterproofText: "Résistance garantie à l'eau de mer salée, chlore de piscine, douches chaudes, cosmétiques, parfums et transpiration. Aucun risque d'oxydation.",
  clauseTarnishTitle: "2. Garantie Anti-Ternissement 10 Ans",
  clauseTarnishText: "Le plaquage Or 18K déposé sous vide par ionisation PVD ne s'écaille pas, ne noircit pas et ne laisse aucune trace verte ou sombre sur la peau.",
  clauseHypoTitle: "3. Innocuité Cutanée & Hypoallergénique",
  clauseHypoText: "Teneur en nickel libre 0.00 % conforme à la norme européenne REACH & EN 1811. Certifié haute tolérance pour peaux sensibles et réactives.",
  clausePolishTitle: "4. Service Entretien & Polissage en Atelier",
  clausePolishText: "Nettoyage haute fréquence aux ultrasons, contrôle du sertissage et ré-avivage d'éclat offerts gratuitement en atelier Maison Ovelzya.",
  signatoryName: "M. Ovelzya",
  signatoryTitle: "Le Maître Joaillier • Contrôle Qualité & Métallurgie",
  customLegalNotice: "© 2026 MAISON OVELZYA Joaillerie • Casablanca • Document officiel infalsifiable valant titre de propriété et certificat de garantie internationale.",
};

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  lang?: Language;
  qrVerificationUrl?: string;
  warrantySettings?: WarrantySettings;
  onSaveWarrantySettings?: (w: WarrantySettings) => void;
  canEdit?: boolean;
}

export default function WarrantyModal({
  isOpen,
  onClose,
  order,
  lang = 'fr',
  qrVerificationUrl,
  warrantySettings,
  onSaveWarrantySettings,
  canEdit = true,
}: WarrantyModalProps) {
  const [certLang, setCertLang] = useState<Language>(lang);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Warranty text customization state
  const [activeWarranty, setActiveWarranty] = useState<WarrantySettings>(warrantySettings || DEFAULT_WARRANTY_SETTINGS);
  const [isEditingTexts, setIsEditingTexts] = useState(false);
  const [editForm, setEditForm] = useState<WarrantySettings>(warrantySettings || DEFAULT_WARRANTY_SETTINGS);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  useEffect(() => {
    if (warrantySettings) {
      const timer = setTimeout(() => {
        setActiveWarranty(warrantySettings);
        setEditForm(warrantySettings);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [warrantySettings]);

  useEffect(() => {
    if (lang) {
      const timer = setTimeout(() => {
        setCertLang(lang);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [lang, isOpen]);

  // Isolation when printing
  useEffect(() => {
    if (!isOpen) return;

    const handleBeforePrint = () => {
      if (typeof document !== 'undefined') {
        document.body.classList.add('printing-ovelzya-warranty');
      }
    };

    const handleAfterPrint = () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('printing-ovelzya-warranty');
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      if (typeof document !== 'undefined') {
        document.body.classList.remove('printing-ovelzya-warranty');
      }
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const certNumber = `CERT-2026-${order.num ? order.num.replace(/\D/g, '').slice(-6) || '782491' : '782491'}`;
  const orderDateFormatted = order.date
    ? new Date(order.date).toLocaleDateString(
        certLang === 'en' ? 'en-US' : certLang === 'ar' ? 'ar-MA' : 'fr-FR',
        { day: '2-digit', month: 'long', year: 'numeric' }
      )
    : '2026';

  const qrTarget = qrVerificationUrl || 'https://certificat.maison-ovelzya.ma/verify';
  const qrValue = `${qrTarget}?cert=${encodeURIComponent(certNumber)}&order=${encodeURIComponent(
    order.num
  )}&client=${encodeURIComponent(order.name || '')}`;

  const handleSaveCustomTexts = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveWarranty(editForm);
    if (onSaveWarrantySettings) {
      onSaveWarrantySettings(editForm);
    }
    setSavedSuccessMsg(true);
    setTimeout(() => {
      setSavedSuccessMsg(false);
      setIsEditingTexts(false);
    }, 900);
  };

  const handleResetToDefault = () => {
    setEditForm(DEFAULT_WARRANTY_SETTINGS);
    setActiveWarranty(DEFAULT_WARRANTY_SETTINGS);
    if (onSaveWarrantySettings) {
      onSaveWarrantySettings(DEFAULT_WARRANTY_SETTINGS);
    }
  };

  // Direct Vector PDF Generation via jsPDF
  const handleDownloadDirectPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Background Luxury Soft Cream
      doc.setFillColor(253, 252, 249);
      doc.rect(0, 0, 210, 297, 'F');

      // Double Gold Filigree Border
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1.0);
      doc.rect(10, 10, 190, 277);

      doc.setLineWidth(0.3);
      doc.rect(13, 13, 184, 271);

      // Rosette corners
      doc.setFontSize(10);
      doc.setTextColor(212, 175, 55);
      doc.text('+', 14, 17);
      doc.text('+', 194, 17);
      doc.text('+', 14, 281);
      doc.text('+', 194, 281);

      // Header Brand
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(20, 20, 20);
      doc.text('MAISON OVELZYA', 105, 26, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(160, 125, 35);
      doc.text('PARIS  -  CASABLANCA  -  HAUTE JOAILLERIE D’ART', 105, 31, { align: 'center' });

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(18, 18, 18);
      const titleToPrint = activeWarranty.certificateTitle || "CERTIFICAT D'AUTHENTICITÉ & GARANTIE";
      doc.text(titleToPrint.toUpperCase(), 105, 41, { align: 'center' });

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      const subToPrint = activeWarranty.certificateSubtitle || 'Attestation officielle de conformité métallurgique, d’étanchéité absolue et de tenue dans le temps';
      doc.text(subToPrint.substring(0, 95), 105, 46, { align: 'center' });

      // Identification Box
      doc.setFillColor(246, 243, 235);
      doc.rect(16, 52, 178, 38, 'F');
      doc.setDrawColor(226, 220, 206);
      doc.setLineWidth(0.4);
      doc.rect(16, 52, 178, 38);

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(certLang === 'en' ? 'Certificate No:' : 'N° Unique Certificat :', 22, 60);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(160, 115, 20);
      doc.text(certNumber, 62, 60);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(certLang === 'en' ? 'Date of Issue:' : 'Date d\'émission :', 120, 60);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text(orderDateFormatted, 155, 60);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(certLang === 'en' ? 'Beneficiary Owner:' : 'Titulaire certifié :', 22, 68);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text(order.name || 'Client Privilégié', 62, 68);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(certLang === 'en' ? 'Order Reference:' : 'Commande N° :', 120, 68);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text(order.num, 155, 68);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(certLang === 'en' ? 'Destination:' : 'Destination :', 22, 76);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 20, 20);
      doc.text(`${order.city || 'Casablanca'}, ${order.country || 'International'}`, 62, 76);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Durée & Validité :', 120, 76);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 130, 60);
      doc.text(activeWarranty.validityDuration || 'Garantie 10 Ans', 155, 76);

      // Section: Certified Items
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(18, 18, 18);
      doc.text(
        certLang === 'en'
          ? 'CERTIFIED JEWELRY CREATIONS'
          : 'PIÈCES DE JOAILLERIE CERTIFIÉES CONFORMES',
        16,
        100
      );

      // Table Header
      doc.setFillColor(235, 230, 218);
      doc.rect(16, 104, 178, 7, 'F');
      doc.setFontSize(8);
      doc.setTextColor(70, 70, 70);
      doc.text('DESIGNATION', 20, 108.5);
      doc.text('SKU / REF', 95, 108.5);
      doc.text('METALLURGIE & OR', 125, 108.5);
      doc.text('QTÉ', 182, 108.5);

      // Table rows
      let y = 117;
      order.items.slice(0, 5).forEach((item) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(20, 20, 20);
        const itemName = item.name || `Création Maison Ovelzya #${item.id}`;
        doc.text(itemName.substring(0, 42), 20, y);
        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.text(item.sku || `OV-COL-${String(item.id).padStart(3, '0')}`, 95, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(activeWarranty.goldPurityText || 'Acier 316L / Or 18K PVD', 125, y);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(String(item.qty), 184, y);

        doc.setDrawColor(240, 238, 230);
        doc.setLineWidth(0.2);
        doc.line(16, y + 2.5, 194, y + 2.5);
        y += 7.5;
      });

      // Section: Technical Guarantees
      const guarY = Math.max(y + 6, 150);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(18, 18, 18);
      doc.text(
        certLang === 'en'
          ? 'OFFICIAL LEGAL & QUALITY COMMITMENTS'
          : 'ENGAGEMENTS & GARANTIES OFFICIELLES MAISON OVELZYA',
        16,
        guarY
      );

      // 4 Guarantee points from customizable settings
      const guarantees = [
        {
          title: activeWarranty.clauseWaterproofTitle || '1. ÉTANCHÉITÉ TOTALE 100% WATERPROOF',
          desc: activeWarranty.clauseWaterproofText || 'Résiste sans altération à l\'eau claire, l\'eau de mer salée, chlore de piscine, cosmétiques et parfums.',
        },
        {
          title: activeWarranty.clauseTarnishTitle || '2. GARANTIE ANTI-TERNISSEMENT & INOXYDABILITÉ 10 ANS',
          desc: activeWarranty.clauseTarnishText || 'Le placage sous vide PVD or 18 carats ne s\'écaille pas, ne noircit pas et ne déteint pas sur la peau.',
        },
        {
          title: activeWarranty.clauseHypoTitle || '3. ALLIAGE HYPOALLERGÉNIQUE CERTIFIÉ ISO 5832-1 & EN 1811',
          desc: activeWarranty.clauseHypoText || 'Teneur en nickel libre 0.00%, sans plomb ni cadmium. Recommandé pour peaux ultra-sensibles.',
        },
        {
          title: activeWarranty.clausePolishTitle || '4. SERVICE ENTRETIEN & POLISSAGE MAISON OVELZYA',
          desc: activeWarranty.clausePolishText || 'Nettoyage professionnel aux ultrasons et remise en éclat offerts en atelier officiel.',
        },
      ];

      let gy = guarY + 7;
      guarantees.forEach((g) => {
        doc.setFillColor(250, 249, 245);
        doc.rect(16, gy, 178, 14, 'F');
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.3);
        doc.rect(16, gy, 178, 14);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(160, 115, 20);
        doc.text(g.title.substring(0, 55), 20, gy + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(70, 70, 70);
        doc.text(g.desc.substring(0, 95), 20, gy + 10.5);

        gy += 16;
      });

      // Bottom Security, Seal & Signatures
      const bottomY = 236;

      // Official Stamp / Seal
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.8);
      doc.circle(50, bottomY + 16, 14);
      doc.circle(50, bottomY + 16, 12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(160, 115, 20);
      doc.text('MAISON OVELZYA', 50, bottomY + 13, { align: 'center' });
      doc.text('SCEAU OFFICIEL', 50, bottomY + 16.5, { align: 'center' });
      doc.text('✦ GARANTIE ✦', 50, bottomY + 20, { align: 'center' });

      // Signatures
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text('POUR LA MAISON OVELZYA', 150, bottomY + 4, { align: 'center' });

      doc.setFont('times', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(18, 18, 18);
      doc.text(activeWarranty.signatoryName || 'M. Ovelzya', 150, bottomY + 16, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(activeWarranty.signatoryTitle || 'Direction des Ateliers d\'Orfèvrerie', 150, bottomY + 21, { align: 'center' });

      // Bottom Legal notice
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      const legalToPrint = activeWarranty.customLegalNotice || 'Document officiel infalsifiable valant titre de propriété et certificat de garantie internationale.';
      doc.text(
        legalToPrint.substring(0, 110),
        105,
        280,
        { align: 'center' }
      );

      // Trigger download
      doc.save(`Certificat_Garantie_OVELZYA_${order.num}.pdf`);
    } catch (err) {
      console.error('Erreur génération direct jsPDF:', err);
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('printing-ovelzya-warranty');
      const oldTitle = document.title;
      document.title = `Certificat_Garantie_${certNumber}_OVELZYA`;

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.title = oldTitle;
          document.body.classList.remove('printing-ovelzya-warranty');
        }, 1500);
      }, 120);
    }
  };

  return (
    <div
      id="ovelzya-warranty-modal"
      className="fixed inset-0 z-[65] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto no-print-backdrop"
    >
      <div
        id="ovelzya-warranty-sheet"
        className="relative w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-auto bg-white text-neutral-900 border border-[#d4af37]/50 transition-colors"
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#0e0e0e] text-white border-b border-[#262626] no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <div>
              <span className="font-serif text-sm font-semibold tracking-wide text-white">
                Certificat Officiel d&apos;Authenticité & Garantie
              </span>
              <span className="text-[10px] text-[#999] block font-mono">
                {certNumber} &bull; Commande {order.num}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditingTexts(!isEditingTexts)}
                title="Modifier le texte du certificat"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                  isEditingTexts
                    ? 'bg-[#d4af37] text-black shadow'
                    : 'bg-[#1c1c1c] hover:bg-[#282828] text-[#d4af37] border border-[#d4af37]/50'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingTexts ? 'Fermer Éditeur' : 'Modifier le texte'}</span>
              </button>
            )}

            {/* Certificate Language Switcher */}
            <div className="flex items-center bg-[#1c1c1c] border border-[#333] rounded p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setCertLang('fr')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  certLang === 'fr' ? 'bg-[#d4af37] text-black' : 'text-[#888] hover:text-white'
                }`}
              >
                FR 🇫🇷
              </button>
              <button
                type="button"
                onClick={() => setCertLang('en')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  certLang === 'en' ? 'bg-[#d4af37] text-black' : 'text-[#888] hover:text-white'
                }`}
              >
                EN 🇬🇧
              </button>
              <button
                type="button"
                onClick={() => setCertLang('ar')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  certLang === 'ar' ? 'bg-[#d4af37] text-black' : 'text-[#888] hover:text-white'
                }`}
              >
                AR 🇸🇦
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DRAWER: EDIT CERTIFICATE TEXT FORM */}
        {isEditingTexts && (
          <div className="bg-[#141414] text-white p-5 border-b border-[#d4af37]/40 no-print space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#d4af37]" />
                <h2 className="text-sm font-serif font-bold text-[#d4af37] uppercase tracking-wider">
                  Personnaliser les Textes & Clauses du Certificat de Garantie
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-2.5 py-1 text-[11px] text-[#999] hover:text-white border border-[#333] hover:border-[#555] rounded flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rétablir par défaut</span>
                </button>
              </div>
            </div>

            {savedSuccessMsg && (
              <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Textes du certificat enregistrés et appliqués en direct ✦</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomTexts} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block mb-1">
                    Titre Principal du Certificat
                  </label>
                  <input
                    type="text"
                    value={editForm.certificateTitle || ''}
                    onChange={(e) => setEditForm({ ...editForm, certificateTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block mb-1">
                    Sous-titre / Attestation Officielle
                  </label>
                  <input
                    type="text"
                    value={editForm.certificateSubtitle || ''}
                    onChange={(e) => setEditForm({ ...editForm, certificateSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block mb-1">
                    Durée de la Garantie (ex: 10 Ans, À vie)
                  </label>
                  <input
                    type="text"
                    value={editForm.validityDuration || ''}
                    onChange={(e) => setEditForm({ ...editForm, validityDuration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-[#d4af37] font-semibold rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block mb-1">
                    Spécification Or & Alliage
                  </label>
                  <input
                    type="text"
                    value={editForm.goldPurityText || ''}
                    onChange={(e) => setEditForm({ ...editForm, goldPurityText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-[#d4af37] font-semibold rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Clause 1 */}
              <div className="p-3 rounded bg-[#181818] border border-[#292929] space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-[#d4af37] block font-semibold">
                  Clause 1 : Étanchéité & Immersion
                </label>
                <input
                  type="text"
                  placeholder="Titre de la clause 1"
                  value={editForm.clauseWaterproofTitle || ''}
                  onChange={(e) => setEditForm({ ...editForm, clauseWaterproofTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-white rounded text-xs focus:border-[#d4af37] focus:outline-none font-semibold"
                />
                <textarea
                  rows={2}
                  placeholder="Description de la clause 1"
                  value={editForm.clauseWaterproofText || ''}
                  onChange={(e) => setEditForm({ ...editForm, clauseWaterproofText: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-[#ccc] rounded text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              {/* Clause 2 */}
              <div className="p-3 rounded bg-[#181818] border border-[#292929] space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-[#d4af37] block font-semibold">
                  Clause 2 : Anti-Ternissement & Inoxydabilité
                </label>
                <input
                  type="text"
                  placeholder="Titre de la clause 2"
                  value={editForm.clauseTarnishTitle || ''}
                  onChange={(e) => setEditForm({ ...editForm, clauseTarnishTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-white rounded text-xs focus:border-[#d4af37] focus:outline-none font-semibold"
                />
                <textarea
                  rows={2}
                  placeholder="Description de la clause 2"
                  value={editForm.clauseTarnishText || ''}
                  onChange={(e) => setEditForm({ ...editForm, clauseTarnishText: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-[#ccc] rounded text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              {/* Clause 3 */}
              <div className="p-3 rounded bg-[#181818] border border-[#292929] space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-[#d4af37] block font-semibold">
                  Clause 3 : Innocuité Cutanée & Hypoallergénique
                </label>
                <input
                  type="text"
                  placeholder="Titre de la clause 3"
                  value={editForm.clauseHypoTitle || ''}
                  onChange={(e) => setEditForm({ ...editForm, clauseHypoTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-white rounded text-xs focus:border-[#d4af37] focus:outline-none font-semibold"
                />
                <textarea
                  rows={2}
                  placeholder="Description de la clause 3"
                  value={editForm.clauseHypoText || ''}
                  onChange={(e) => setEditForm({ ...editForm, clauseHypoText: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-[#ccc] rounded text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              {/* Clause 4 */}
              <div className="p-3 rounded bg-[#181818] border border-[#292929] space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-[#d4af37] block font-semibold">
                  Clause 4 : Service Entretien & Polissage en Atelier
                </label>
                <input
                  type="text"
                  placeholder="Titre de la clause 4"
                  value={editForm.clausePolishTitle || ''}
                  onChange={(e) => setEditForm({ ...editForm, clausePolishTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-white rounded text-xs focus:border-[#d4af37] focus:outline-none font-semibold"
                />
                <textarea
                  rows={2}
                  placeholder="Description de la clause 4"
                  value={editForm.clausePolishText || ''}
                  onChange={(e) => setEditForm({ ...editForm, clausePolishText: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#121212] border border-[#333] text-[#ccc] rounded text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block mb-1">
                    Nom du Signataire
                  </label>
                  <input
                    type="text"
                    value={editForm.signatoryName || ''}
                    onChange={(e) => setEditForm({ ...editForm, signatoryName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block mb-1">
                    Titre & Fonction du Signataire
                  </label>
                  <input
                    type="text"
                    value={editForm.signatoryTitle || ''}
                    onChange={(e) => setEditForm({ ...editForm, signatoryTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#9a958a] block mb-1">
                  Mention Légale de Bas de Page
                </label>
                <input
                  type="text"
                  value={editForm.customLegalNotice || ''}
                  onChange={(e) => setEditForm({ ...editForm, customLegalNotice: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1b1b1b] border border-[#333] text-white rounded focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsEditingTexts(false)}
                  className="px-4 py-2 border border-[#333] hover:border-[#555] text-xs uppercase tracking-wider text-[#aaa] hover:text-white rounded cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer le texte du certificat</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= CERTIFICATE SHEET CONTENT (A4 LUXURY DESIGN) ================= */}
        <div
          dir={certLang === 'ar' ? 'rtl' : 'ltr'}
          className="p-6 sm:p-8 md:p-10 bg-[#fdfcf9] text-neutral-900 font-sans relative overflow-hidden"
          style={{ minHeight: '800px' }}
        >
          {/* Ornate Gold Filigree Border */}
          <div className="absolute inset-3 sm:inset-4 border-2 border-[#d4af37] pointer-events-none rounded-sm"></div>
          <div className="absolute inset-4 sm:inset-5 border border-[#d4af37]/40 pointer-events-none rounded-sm"></div>

          {/* Corner Rosettes */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 text-[#d4af37] text-xs select-none">✦</div>
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#d4af37] text-xs select-none">✦</div>
          <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 text-[#d4af37] text-xs select-none">✦</div>
          <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 text-[#d4af37] text-xs select-none">✦</div>

          {/* Certificate Header */}
          <div className="text-center relative z-10 pt-2 pb-5 border-b border-[#e5dfce]">
            <div className="flex justify-center mb-2">
              <OvelzyaLogo variant="invoice" lightMode={true} size="md" />
            </div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#9f7d23] font-serif font-medium mt-1">
              PARIS &bull; CASABLANCA &bull; HAUTE JOAILLERIE &bull; ORFÈVRERIE D&apos;ART
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-neutral-900 tracking-wider font-bold uppercase">
                {certLang === 'en'
                  ? (activeWarranty.certificateTitle || 'Certificate of Authenticity & Warranty')
                  : certLang === 'ar'
                  ? 'شهادة الأصالة والضمان الرسمي للدار'
                  : (activeWarranty.certificateTitle || 'Certificat d’Authenticité & Garantie')}
              </h1>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>

            <p className="text-xs text-neutral-600 font-serif italic mt-1">
              {certLang === 'en'
                ? 'Official guarantee of pure metallurgy, waterproof resilience & lifetime craftsmanship'
                : certLang === 'ar'
                ? 'ضمان رسمي لجودة السبائك ومقاومة الماء والصدأ مدى الحياة'
                : (activeWarranty.certificateSubtitle || 'Attestation officielle de conformité métallurgique, d’étanchéité absolue et de tenue dans le temps')}
            </p>
          </div>

          {/* Identification Box */}
          <div className="mt-5 p-4 rounded bg-[#f6f3eb] border border-[#e2dcce] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs relative z-10">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-medium">
                {certLang === 'en' ? 'Certificate No.' : certLang === 'ar' ? 'رقم الشهادة الفريد' : 'N° de Certificat'}
              </span>
              <span className="font-mono font-bold text-[#8f6503] text-sm block mt-0.5">{certNumber}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-medium">
                {certLang === 'en' ? 'Date of Issue' : certLang === 'ar' ? 'تاريخ الإصدار' : 'Date d’Émission'}
              </span>
              <span className="font-medium text-neutral-800 text-xs block mt-0.5">{orderDateFormatted}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-medium">
                {certLang === 'en' ? 'Beneficiary Owner' : certLang === 'ar' ? 'صاحب الشهادة' : 'Titulaire Certifié'}
              </span>
              <span className="font-serif font-bold text-neutral-900 text-sm block mt-0.5 truncate">
                {order.name || 'Client Privilégié'}
              </span>
              <span className="text-[10px] text-neutral-500 block">
                {order.city || 'Casablanca'}, {order.country || 'International'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-medium">
                Garantie & Validité
              </span>
              <span className="font-serif font-bold text-emerald-800 text-xs block mt-0.5">
                {activeWarranty.validityDuration || 'Garantie Anti-Ternissement 10 Ans'}
              </span>
              <span className="text-[10px] text-neutral-500 block">Commande {order.num}</span>
            </div>
          </div>

          {/* Table of Certified Jewelry Items */}
          <div className="mt-5 relative z-10">
            <h3 className="text-xs uppercase tracking-wider font-serif font-bold text-neutral-800 mb-2 flex items-center justify-between">
              <span>
                {certLang === 'en'
                  ? 'Certified Creations Included in this Guarantee'
                  : certLang === 'ar'
                  ? 'القطع المشمولة رسمياً في هذه الشهادة'
                  : 'Créations de Joaillerie Certifiées Conformes'}
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                {order.items.length} {order.items.length > 1 ? 'pièces' : 'pièce'}
              </span>
            </h3>

            <div className="border border-[#e5dfce] rounded overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f0ece1] border-b border-[#e5dfce] text-[10px] uppercase tracking-wider text-[#7a5e18] font-serif">
                    <th className="p-2.5">Désignation</th>
                    <th className="p-2.5">Référence</th>
                    <th className="p-2.5">Alliage & Pureté</th>
                    <th className="p-2.5">Traitement & Or</th>
                    <th className="p-2.5 text-right">Qté</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2eee3]">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fcfbf7]">
                      <td className="p-2.5 font-medium text-neutral-900 font-serif">
                        {item.name || `Bijou Maison Ovelzya #${item.id}`}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-neutral-600">
                        {item.sku || `OV-COL-${String(item.id).padStart(3, '0')}`}
                      </td>
                      <td className="p-2.5 text-neutral-700">
                        <span className="font-semibold text-neutral-900">Acier chirurgical 316L</span>
                        <span className="text-[10px] text-neutral-500 block">Norme ISO 5832-1 Médical</span>
                      </td>
                      <td className="p-2.5 text-neutral-700">
                        <span className="font-semibold text-[#8f6503]">{activeWarranty.goldPurityText || 'Or 18K PVD (0.8–1.5 µm)'}</span>
                        <span className="text-[10px] text-neutral-500 block">Zirconium 5A & Nacre naturelle</span>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-neutral-900">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 Official Commitments Grid */}
          <div className="mt-5 relative z-10">
            <h3 className="text-xs uppercase tracking-wider font-serif font-bold text-neutral-800 mb-2">
              {certLang === 'en'
                ? 'Contractual Warranty Coverage & Standards'
                : certLang === 'ar'
                ? 'التغطية والشروط القانونية للضمان'
                : 'Engagements Contractuels & Périmètre de Garantie'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-white rounded border border-[#e5dfce] shadow-xs">
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold font-serif">
                  <span className="text-base text-[#d4af37]">💧</span>
                  <span>{activeWarranty.clauseWaterproofTitle || '1. Garantie Waterproof 100% (Immersion Totale)'}</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  {activeWarranty.clauseWaterproofText || "Résistance garantie à l'eau de mer salée, chlore de piscine, douches chaudes, cosmétiques, parfums et transpiration. Aucun risque d'oxydation."}
                </p>
              </div>

              <div className="p-3 bg-white rounded border border-[#e5dfce] shadow-xs">
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold font-serif">
                  <span className="text-base text-[#d4af37]">🛡️</span>
                  <span>{activeWarranty.clauseTarnishTitle || '2. Garantie Anti-Ternissement 10 Ans'}</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  {activeWarranty.clauseTarnishText || "Le plaquage Or 18K déposé sous vide par ionisation PVD ne s'écaille pas, ne noircit pas et ne laisse aucune trace verte ou sombre sur la peau."}
                </p>
              </div>

              <div className="p-3 bg-white rounded border border-[#e5dfce] shadow-xs">
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold font-serif">
                  <span className="text-base text-[#d4af37]">🌿</span>
                  <span>{activeWarranty.clauseHypoTitle || '3. Innocuité Cutanée & Hypoallergénique'}</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  {activeWarranty.clauseHypoText || "Teneur en nickel libre 0.00 % conforme à la norme européenne REACH & EN 1811. Certifié haute tolérance pour peaux sensibles et réactives."}
                </p>
              </div>

              <div className="p-3 bg-white rounded border border-[#e5dfce] shadow-xs">
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold font-serif">
                  <span className="text-base text-[#d4af37]">✨</span>
                  <span>{activeWarranty.clausePolishTitle || '4. Service Entretien & Polissage en Atelier'}</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  {activeWarranty.clausePolishText || "Nettoyage haute fréquence aux ultrasons, contrôle du sertissage et ré-avivage d'éclat offerts gratuitement en atelier Maison Ovelzya."}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Security Seals & Signatures */}
          <div className="mt-6 pt-4 border-t border-[#e5dfce] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs relative z-10">
            {/* QR Code Verification */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white border border-[#d4af37] rounded shadow-xs">
                <QRCodeDisplay
                  value={qrValue}
                  size={64}
                  lightColor="#ffffff"
                  darkColor="#111111"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9f7d23] block flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" />
                  Sceau d&apos;Authenticité Numérique
                </span>
                <p className="text-[10px] text-neutral-500 mt-0.5 leading-snug">
                  Scannez pour vérifier la validité officielle dans les registres de la Maison Ovelzya.
                </p>
                <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">{certNumber}</span>
              </div>
            </div>

            {/* Official Maison Stamp & Signature */}
            <div className="flex items-center gap-4">
              {/* Embossed Luxury Stamp */}
              <div className="w-16 h-16 rounded-full border-2 border-[#d4af37] flex flex-col items-center justify-center text-center p-1 text-[#8f6503] select-none bg-[#fdfaf3] shadow-xs">
                <span className="text-[7px] font-bold tracking-widest uppercase">Maison</span>
                <span className="text-[8px] font-serif font-black tracking-widest uppercase text-[#5a4204]">Ovelzya</span>
                <span className="text-[6px] tracking-wider uppercase text-[#a3791a] mt-0.5">✦ Sceau ✦</span>
              </div>

              {/* Artisan Signature */}
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-medium">
                  Pour la Maison Ovelzya
                </span>
                <div className="font-serif italic font-bold text-base text-neutral-900 my-0.5 text-right font-signature">
                  {activeWarranty.signatoryName || 'M. Ovelzya'}
                </div>
                <span className="text-[9px] text-neutral-500 block">{activeWarranty.signatoryTitle || "Direction des Ateliers d'Orfèvrerie"}</span>
              </div>
            </div>
          </div>

          {/* Legal Footer Note */}
          <div className="mt-4 pt-2 border-t border-[#f0ece1] text-center text-[8.5px] text-neutral-500">
            {activeWarranty.customLegalNotice || "© 2026 MAISON OVELZYA Joaillerie • Casablanca • Document officiel infalsifiable valant titre de propriété et certificat de garantie internationale."}
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0e0e0e] text-white border-t border-[#262626] no-print">
          <div className="text-xs text-[#999] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#d4af37]" />
            <span>{activeWarranty.validityDuration || 'Garantie internationale de 10 ans'} &amp; service d&apos;atelier à vie</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#333] hover:border-[#555] text-[#bbb] hover:text-white text-xs uppercase tracking-wider rounded transition cursor-pointer"
            >
              Fermer
            </button>

            <button
              onClick={handleDownloadDirectPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1c1c] hover:bg-[#252525] border border-[#d4af37]/60 text-[#d4af37] text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger PDF (Direct)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Exporter A4</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
