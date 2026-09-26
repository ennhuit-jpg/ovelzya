'use client';

import React, { useEffect } from 'react';
import { Order, Language } from '@/lib/types';
import { Printer, X, Receipt, Clock, MapPin, Phone, User, CheckCircle2, QrCode } from 'lucide-react';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import OvelzyaLogo from '@/components/OvelzyaLogo';

interface ReceiptModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onOpenInvoice?: () => void;
  qrVerificationUrl?: string;
}

export default function ReceiptModal({
  order,
  isOpen,
  onClose,
  lang = 'fr',
  onOpenInvoice,
  qrVerificationUrl,
}: ReceiptModalProps) {
  const ticketNum = order ? order.num.replace('MD-', 'TK-') : 'TK-0001';

  // Manage print isolation for thermal ticket / PDF
  useEffect(() => {
    if (!isOpen) return;

    const handleBeforePrint = () => {
      if (typeof document !== 'undefined') {
        document.body.classList.add('printing-ovelzya-receipt');
      }
    };

    const handleAfterPrint = () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('printing-ovelzya-receipt');
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      if (typeof document !== 'undefined') {
        document.body.classList.remove('printing-ovelzya-receipt');
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('printing-ovelzya-receipt');
      const oldTitle = document.title;
      document.title = `Ticket_${ticketNum}_OVELZYA`;
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.title = oldTitle;
          document.body.classList.remove('printing-ovelzya-receipt');
        }, 1500);
      }, 120);
    }
  };

  const qrTarget = qrVerificationUrl || 'https://certificat.maison-ovelzya.ma/verify';
  const qrValue = `${qrTarget}?order=${encodeURIComponent(order.num)}&sku=${encodeURIComponent(
    order.items.map((i) => i.sku || `OV-${i.id}`).join(',')
  )}`;

  const formattedDate = order.date
    ? new Date(order.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) +
      ' ' +
      new Date(order.date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('fr-FR');

  return (
    <div
      id="ovelzya-receipt-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto no-print-backdrop"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#111111] border border-[#d4af37]/50 rounded-lg shadow-2xl overflow-hidden my-auto text-[#f4f1ea] thermal-ticket-container">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0a0a] border-b border-[#262626] no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#d4af37]">
              Ticket de Caisse (Imprimante 80 mm)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenInvoice && (
              <button
                onClick={() => {
                  onClose();
                  onOpenInvoice();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c1c1c] hover:bg-[#282828] text-xs text-[#ccc] border border-[#333] transition cursor-pointer"
                title="Basculer vers la facture officielle A4"
              >
                <span>Facture A4</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#e8c878] hover:from-[#e8c878] hover:to-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow"
              title="Imprimer ou enregistrer le ticket 80mm en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer Ticket / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1e1e1e] hover:bg-[#2e2e2e] text-[#aaa] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informational banner about second printer */}
        <div className="bg-[#181818] border-b border-[#262626] px-5 py-2 text-[11px] text-[#9a958a] flex items-center justify-between no-print">
          <span>Format optimisé rouleau thermique <b>80 mm</b></span>
          <span className="text-[#d4af37] font-mono">Imprimante 2</span>
        </div>

        {/* 80mm Thermal Receipt Body */}
        <div
          id="ovelzya-receipt-sheet"
          className="p-6 bg-white text-black font-mono text-[12px] leading-tight printable-receipt-slip max-w-[340px] mx-auto my-4 shadow-md rounded-sm border border-neutral-300"
        >
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-neutral-400">
            <div className="flex justify-center mb-1.5">
              <OvelzyaLogo variant="crest" size="sm" lightMode={true} />
            </div>
            <h1 className="font-serif font-bold text-xl tracking-[0.2em] text-neutral-900">
              OVELZYA
            </h1>
            <p className="text-[10px] tracking-widest text-neutral-600 font-sans uppercase">
              Maison de Haute Joaillerie & Maroquinerie
            </p>
            <p className="text-[9px] text-neutral-500 mt-1 font-sans">
              24 Bd d&apos;Anfa, Casablanca
            </p>
            <p className="text-[9px] text-neutral-500 font-sans">
              Tél: +212 6 20 00 00 00 · contact@ovelzya.com
            </p>
            <p className="text-[8px] text-neutral-400 font-sans mt-0.5">
              ICE: 002984920000034 · RC: 519280
            </p>
          </div>

          {/* Ticket Meta */}
          <div className="py-2.5 border-b border-dashed border-neutral-400 text-[11px] space-y-0.5">
            <div className="flex justify-between font-bold">
              <span>TICKET :</span>
              <span>{ticketNum}</span>
            </div>
            <div className="flex justify-between">
              <span>DATE :</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>COMMANDE :</span>
              <span>{order.num}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUT :</span>
              <span className="uppercase font-bold">{order.status}</span>
            </div>
          </div>

          {/* Client Details */}
          <div className="py-2 border-b border-dashed border-neutral-400 text-[11px] space-y-0.5">
            <div className="font-bold flex items-center gap-1">
              <span>CLIENT :</span>
              <span>{order.name}</span>
            </div>
            {order.phone && (
              <div className="flex justify-between">
                <span>TÉL :</span>
                <span>{order.phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>VILLE :</span>
              <span>{order.city || 'Casablanca'}</span>
            </div>
            {order.street && (
              <div className="text-[10px] text-neutral-600 truncate">
                ADR: {order.street}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="py-2.5 border-b border-dashed border-neutral-400">
            <div className="flex justify-between text-[10px] font-bold pb-1 text-neutral-600 border-b border-neutral-200">
              <span className="w-1/2">ARTICLE & SKU</span>
              <span className="w-1/4 text-center">QTÉ</span>
              <span className="w-1/4 text-right">TOTAL</span>
            </div>
            <div className="divide-y divide-neutral-100 pt-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between text-[11px]">
                  <div className="w-1/2 pr-1">
                    <div className="truncate font-sans text-[10px] font-medium text-neutral-900">
                      {item.name || `Bijou #${item.id}`}
                    </div>
                    <div className="text-[9px] text-neutral-500 font-mono">
                      SKU : {item.sku || `MD-${item.id}`}
                    </div>
                  </div>
                  <div className="w-1/4 text-center text-[10px]">
                    {item.qty} × {item.price}
                  </div>
                  <div className="w-1/4 text-right font-bold text-[11px]">
                    {(item.price * item.qty).toLocaleString('fr-FR')} DH
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Calculation */}
          <div className="py-2 border-b border-dashed border-neutral-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>SOUS-TOTAL :</span>
              <span>{order.sub.toLocaleString('fr-FR')} DH</span>
            </div>
            {order.disc > 0 && (
              <div className="flex justify-between text-neutral-700">
                <span>REMISE :</span>
                <span>−{order.disc.toLocaleString('fr-FR')} DH</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>LIVRAISON :</span>
              <span>{order.ship === 0 ? 'OFFERTE (0 DH)' : `${order.ship} DH`}</span>
            </div>
            {order.cod > 0 && (
              <div className="flex justify-between">
                <span>FRAIS PAIEMENT :</span>
                <span>+{order.cod} DH</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-1 border-t border-neutral-400 text-neutral-900">
              <span>TOTAL NET :</span>
              <span>{order.total.toLocaleString('fr-FR')} DH</span>
            </div>
          </div>

          {/* Payment & Dispatch Notice */}
          <div className="py-2 border-b border-dashed border-neutral-400 text-[10px] space-y-0.5">
            <div className="flex justify-between font-bold">
              <span>RÈGLEMENT :</span>
              <span>{order.payMethod}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>DATE EXPÉDITION :</span>
              <span>IMMÉDIATE</span>
            </div>
          </div>

          {/* Barcode Mockup & QR Code Verification */}
          <div className="pt-3 pb-2 text-center space-y-2">
            <div className="font-mono tracking-[0.3em] text-[16px] font-bold text-neutral-800 scale-y-125 select-none">
              ||| | |||| | || ||| || ||| |
            </div>
            <p className="text-[9px] text-neutral-600 font-mono tracking-widest">
              *{order.num}*
            </p>

            {/* QR Code */}
            <div className="pt-1 flex flex-col items-center justify-center">
              <div className="bg-white p-1 rounded border border-neutral-300 inline-block shadow-sm">
                <QRCodeDisplay value={qrValue} size={76} />
              </div>
              <p className="text-[8px] text-neutral-600 font-sans uppercase tracking-wider mt-1 font-semibold">
                ✦ Scan Authenticité Maison Ovelzya ✦
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[8px] text-neutral-500 font-sans pt-1 border-t border-dotted border-neutral-300">
            <p className="font-semibold text-neutral-700">✦ MERCI DE VOTRE CONFIANCE ✦</p>
            <p>Bijoux étanches garantis 10 ans sans oxydation.</p>
            <p>Conservez ce ticket pour tout échange ou réclamation.</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-[#0a0a0a] border-t border-[#262626] flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#333] hover:border-[#555] text-[#aaa] hover:text-white text-xs uppercase tracking-wider rounded cursor-pointer"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Ticket (80 mm)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
