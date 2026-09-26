'use client';

import React, { useState, useEffect } from 'react';
import { Printer, X, ShieldCheck, Receipt, Sun, Moon, CheckCircle2, QrCode, FileDown, Info } from 'lucide-react';
import { Order, Language } from '@/lib/types';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import OvelzyaLogo from '@/components/OvelzyaLogo';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  lang?: Language;
  onOpenTicket?: () => void;
  qrVerificationUrl?: string;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  order,
  lang = 'fr',
  onOpenTicket,
  qrVerificationUrl,
}: InvoiceModalProps) {
  const [paperTheme, setPaperTheme] = useState<'paper' | 'dark'>('paper');

  // Print isolation lifecycle: clean body classes on print and restore afterwards
  useEffect(() => {
    if (!isOpen) return;

    const handleBeforePrint = () => {
      setPaperTheme('paper');
      if (typeof document !== 'undefined') {
        document.body.classList.add('printing-ovelzya-invoice');
      }
    };

    const handleAfterPrint = () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('printing-ovelzya-invoice');
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      if (typeof document !== 'undefined') {
        document.body.classList.remove('printing-ovelzya-invoice');
      }
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const invoiceNumber = `FAC-2026-${order.num ? order.num.replace(/\D/g, '').slice(-4) : '0001'}`;

  const handlePrintPdf = () => {
    setPaperTheme('paper');
    if (typeof document !== 'undefined') {
      document.body.classList.add('printing-ovelzya-invoice');
      const oldTitle = document.title;
      document.title = `Facture_${invoiceNumber}_OVELZYA`;

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.title = oldTitle;
          document.body.classList.remove('printing-ovelzya-invoice');
        }, 1500);
      }, 120);
    }
  };

  const invoiceDate = new Date(order.date || '2026-03-01T10:00:00.000Z').toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const isPaper = paperTheme === 'paper';
  const qrTarget = qrVerificationUrl || 'https://certificat.maison-ovelzya.ma/verify';
  const qrValue = `${qrTarget}?order=${encodeURIComponent(order.num)}&sku=${encodeURIComponent(
    order.items.map((i) => i.sku || `OV-${i.id}`).join(',')
  )}`;

  return (
    <div
      id="ovelzya-invoice-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto no-print-backdrop"
    >
      {/* Container that stays centered on screen, and takes full page on print */}
      <div
        id="ovelzya-invoice-sheet"
        className={`relative w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden my-auto printable-invoice-wrapper transition-colors ${
          isPaper
            ? 'bg-white text-neutral-900 border border-neutral-300'
            : 'bg-[#111111] text-[#f4f1ea] border border-[#d4af37]/40'
        }`}
      >
        {/* Top Control Bar (Strictly hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#0a0a0a] text-white border-b border-[#262626] no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
              Facture Officielle A4 · Export PDF
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400 font-mono">
              1 Page A4
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Style Toggle */}
            <button
              onClick={() => setPaperTheme(isPaper ? 'dark' : 'paper')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c1c1c] hover:bg-[#282828] text-xs text-[#ccc] border border-[#333] transition cursor-pointer"
              title="Basculer entre l'aperçu papier blanc et le thème sombre"
            >
              {isPaper ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Vue Sombre</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Vue Papier A4</span>
                </>
              )}
            </button>

            {onOpenTicket && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTicket();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-xs text-emerald-300 border border-emerald-700/60 transition cursor-pointer"
                title="Basculer vers le format Ticket de caisse 80 mm"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ticket 80 mm</span>
              </button>
            )}

            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#e8c878] hover:from-[#e8c878] hover:to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow-md shadow-amber-900/20"
              title="Imprimer ou enregistrer au format PDF officiel A4 (1 page)"
            >
              <FileDown className="w-4 h-4" />
              <span>Imprimer en PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1e1e1e] hover:bg-[#2e2e2e] text-[#aaa] hover:text-white transition cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div
          className={`p-5 sm:p-8 print:p-0 printable-document font-sans text-xs ${
            isPaper ? 'bg-white text-neutral-900' : 'bg-[#0e0e0e] text-[#e8e4dc]'
          }`}
        >
          {/* Header Row: Ovelzya Brand & Invoice Reference */}
          <div
            className={`flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4 mb-4 ${
              isPaper ? 'border-neutral-200' : 'border-[#d4af37]/30'
            }`}
          >
            <div>
              <div className="mb-1.5">
                <OvelzyaLogo variant="invoice" />
              </div>
              <p
                className={`text-[10px] uppercase tracking-[0.2em] mb-1.5 font-medium ${
                  isPaper ? 'text-neutral-700' : 'text-[#aaa]'
                }`}
              >
                Haute Joaillerie Acier 316L &bull; Or 18K PVD &bull; Casablanca &bull; Paris
              </p>
              <div
                className={`text-[10.5px] leading-relaxed space-y-0.5 ${
                  isPaper ? 'text-neutral-600' : 'text-[#888]'
                }`}
              >
                <p>24 Boulevard d&apos;Anfa, Triangle d&apos;Or, Casablanca, Maroc</p>
                <p>Tél & WhatsApp Conciergerie : +212 6 20 00 00 00 &bull; contact@ovelzya.com</p>
                <p className="font-mono text-[9.5px]">
                  RC : 519280 &bull; ICE : 002984920000034 &bull; Patente : 35891024
                </p>
              </div>
            </div>

            <div
              className={`text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto shrink-0 ${
                isPaper ? 'border-neutral-200' : 'border-[#262626]'
              }`}
            >
              <div className="inline-block bg-[#8f6503]/10 border border-[#8f6503]/30 px-3 py-0.5 rounded mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8f6503]">
                  FACTURE OFFICIELLE
                </span>
              </div>
              <div className="font-mono font-bold text-base text-neutral-900 tracking-wider">
                {invoiceNumber}
              </div>
              <div className="text-[10.5px] text-neutral-500 mt-0.5">Date : {invoiceDate}</div>
              <div className="text-[10.5px] text-neutral-500 font-mono">Commande : {order.num}</div>
              <div className="text-[10.5px] font-semibold text-emerald-700 uppercase mt-0.5">
                Statut : {order.status}
              </div>
            </div>
          </div>

          {/* Client & Delivery Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 print-avoid-break">
            <div
              className={`p-3 rounded border ${
                isPaper ? 'bg-neutral-50 border-neutral-200' : 'bg-[#141414] border-[#262626]'
              }`}
            >
              <span className="text-[9.5px] uppercase tracking-wider font-semibold text-[#8f6503] block mb-1">
                Destinataire (Client)
              </span>
              <div className="font-bold text-sm text-neutral-900">{order.name}</div>
              {order.email && <div className="text-[10.5px] text-neutral-600">{order.email}</div>}
              {order.phone && <div className="text-[10.5px] text-neutral-600 font-mono">Tél : {order.phone}</div>}
              <div className="text-[10.5px] text-neutral-600 mt-0.5">
                {order.street ? `${order.street}, ` : ''}{order.city || 'Maroc'}
              </div>
            </div>

            <div
              className={`p-3 rounded border ${
                isPaper ? 'bg-neutral-50 border-neutral-200' : 'bg-[#141414] border-[#262626]'
              }`}
            >
              <span className="text-[9.5px] uppercase tracking-wider font-semibold text-[#8f6503] block mb-1">
                Expédition & Règlement
              </span>
              <div className="text-[10.5px] space-y-0.5 text-neutral-700">
                <div className="flex justify-between">
                  <span>Transporteur :</span>
                  <span className="font-medium text-neutral-900">Amana Express / Livraison Sécurisée</span>
                </div>
                <div className="flex justify-between">
                  <span>Paiement :</span>
                  <span className="font-medium text-neutral-900">{order.payMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Délai d&apos;acheminement :</span>
                  <span className="font-medium text-neutral-900">24h à 48h ouvrables</span>
                </div>
                <div className="flex justify-between">
                  <span>Garantie Maison :</span>
                  <span className="font-medium text-emerald-700">24 mois &bull; Étanche 100% Inoxydable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-4 print-avoid-break">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className={`border-b-2 ${
                    isPaper
                      ? 'bg-neutral-100 border-neutral-300 text-neutral-700'
                      : 'bg-[#181818] border-[#333] text-[#999]'
                  }`}
                >
                  <th className="p-2 uppercase tracking-wider font-bold">Désignation de la Pièce</th>
                  <th className="p-2 uppercase tracking-wider font-bold text-center">Spécification</th>
                  <th className="p-2 uppercase tracking-wider font-bold text-center">Qté</th>
                  <th className="p-2 uppercase tracking-wider font-bold text-right">Prix Unit.</th>
                  <th className="p-2 uppercase tracking-wider font-bold text-right">Total DH</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isPaper ? 'divide-neutral-200' : 'divide-[#222]'}`}>
                {order.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? (isPaper ? 'bg-white' : 'bg-transparent') : (isPaper ? 'bg-neutral-50/60' : 'bg-[#121212]')}
                  >
                    <td className="p-2 font-medium text-neutral-900">
                      <div className="font-semibold text-[11.5px]">{item.name || `Bijou #${item.id}`}</div>
                      <div className="text-[9.5px] text-neutral-500 font-mono">
                        SKU : <span className="font-bold text-neutral-800">{item.sku || `OV-${item.id}`}</span>
                        {item.barcode && <span className="ml-2 text-neutral-400">&bull; EAN: {item.barcode}</span>}
                      </div>
                    </td>
                    <td className="p-2 text-center text-[10.5px] text-neutral-600">
                      Acier 316L &bull; Or 18K PVD
                    </td>
                    <td className="p-2 text-center font-mono font-semibold text-neutral-900">
                      {item.qty}
                    </td>
                    <td className="p-2 text-right font-mono text-neutral-700">
                      {item.price.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-neutral-900">
                      {(item.price * item.qty).toLocaleString('fr-FR')} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes Section with QR Code */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-1 print-avoid-break">
            <div className="w-full sm:w-7/12 space-y-2.5">
              <div className="p-2.5 rounded border border-neutral-200 bg-neutral-50 flex items-start gap-3">
                <div className="shrink-0 bg-white p-1 rounded border border-neutral-300 shadow-sm">
                  <QRCodeDisplay value={qrValue} size={74} />
                </div>
                <div className="text-[10px] text-neutral-600 space-y-0.5">
                  <span className="font-bold text-neutral-900 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-[#8f6503]" />
                    <span>Certificat & Authenticité Ovelzya</span>
                  </span>
                  <p className="leading-tight">
                    Scannez pour vérifier l&apos;authenticité de cette facture et accéder aux spécifications joaillères garanties 2 ans.
                  </p>
                  <p className="text-[8.5px] font-mono text-neutral-400 truncate max-w-[240px]">
                    URL : {qrTarget}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded border border-neutral-200 bg-neutral-50 flex items-start gap-2 text-[9.5px] text-neutral-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="text-neutral-900">Garantie 2 ans :</strong> Pièces inaltérables, résistantes à l&apos;eau, aux parfums et hypoallergéniques.
                </p>
              </div>

              <p className="italic text-[9.5px] text-neutral-500">
                Arrêté la présente facture à : <strong className="text-neutral-800">{order.total.toLocaleString('fr-FR')} DH TTC</strong>.
              </p>
            </div>

            <div
              className={`w-full sm:w-5/12 p-3 rounded border space-y-1.5 text-xs ${
                isPaper ? 'bg-neutral-50 border-neutral-300' : 'bg-[#141414] border-[#262626]'
              }`}
            >
              <div className="flex justify-between text-neutral-600 text-[11px]">
                <span>Sous-total HT :</span>
                <span className="font-mono text-neutral-900 font-medium">
                  {order.sub.toLocaleString('fr-FR')} DH
                </span>
              </div>

              {order.disc > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium text-[11px]">
                  <span>Remise accordée :</span>
                  <span className="font-mono">−{order.disc.toLocaleString('fr-FR')} DH</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600 text-[11px]">
                <span>Livraison :</span>
                <span className="font-mono text-neutral-900 font-medium">
                  {order.ship === 0 ? 'Offerte (0 DH)' : `${order.ship} DH`}
                </span>
              </div>

              {order.cod > 0 && (
                <div className="flex justify-between text-neutral-600 text-[11px]">
                  <span>Frais Contre-remboursement :</span>
                  <span className="font-mono text-neutral-900">{order.cod} DH</span>
                </div>
              )}

              <div className="border-t-2 border-neutral-300 pt-1.5 flex justify-between items-center text-sm font-bold">
                <span className="text-[#8f6503] font-serif uppercase tracking-wider">Total Net TTC :</span>
                <span className="font-serif text-base sm:text-lg text-[#8f6503] font-mono">
                  {order.total.toLocaleString('fr-FR')} DH
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Seal Footer */}
          <div className="mt-5 pt-3 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-[9.5px] text-neutral-500 print-avoid-break">
            <p>&copy; 2026 MAISON OVELZYA Casablanca &bull; Document officiel émis pour valoir ce que de droit.</p>
            <div className="flex items-center gap-2">
              <span className="border border-[#8f6503]/40 text-[#8f6503] px-2 py-0.5 rounded text-[9px] font-mono font-semibold">
                ✦ SCEAU D&apos;AUTHENTICITÉ OVELZYA 316L
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Print Action (Hidden on Print) */}
        <div className="flex flex-wrap justify-between items-center gap-3 px-4 sm:px-6 py-3 bg-[#0a0a0a] text-white border-t border-[#262626] no-print">
          <div className="flex items-center gap-1.5 text-[11px] text-[#999]">
            <Info className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Sélectionnez <b>&quot;Enregistrer au format PDF&quot;</b> dans la fenêtre d&apos;impression</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#333] hover:border-[#555] text-[#bbb] hover:text-white text-xs uppercase tracking-wider rounded transition cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-2 px-5 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Télécharger en PDF (A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
