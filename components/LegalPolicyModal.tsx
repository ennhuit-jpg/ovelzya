'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Shield,
  RotateCcw,
  FileText,
  Building2,
  Truck,
  Printer,
  Sparkles,
  CheckCircle2,
  Lock,
  Clock,
  MapPin,
  Mail,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { Language } from '@/lib/types';
import OvelzyaLogo from '@/components/OvelzyaLogo';

export type PolicyType = 'privacy' | 'returns' | 'terms' | 'legal' | 'shipping';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicy?: PolicyType;
  lang?: Language;
}

export default function LegalPolicyModal({
  isOpen,
  onClose,
  initialPolicy = 'privacy',
  lang = 'fr',
}: LegalPolicyModalProps) {
  const [activePolicy, setActivePolicy] = useState<PolicyType>(initialPolicy);

  useEffect(() => {
    if (initialPolicy) {
      const timer = setTimeout(() => {
        setActivePolicy(initialPolicy);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialPolicy]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs: { id: PolicyType; title: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'privacy',
      title: 'Politique de confidentialité',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'returns',
      title: 'Politique de retour et de remboursement',
      icon: <RotateCcw className="w-4 h-4" />,
      badge: '14 jours',
    },
    {
      id: 'terms',
      title: 'Conditions de vente',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'legal',
      title: 'Mention légale',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'shipping',
      title: "Politique d'expédition",
      icon: <Truck className="w-4 h-4" />,
      badge: '24-48h',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="legal-policy-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-policy-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0f0f0f] text-[#ece8de] rounded-xl border border-[#2e2a20] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242119] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1f1b13] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#d4af37] font-semibold block">
                Maison Ovelzya · Haute Joaillerie
              </span>
              <h2 id="legal-policy-title" className="text-base sm:text-lg font-serif font-medium text-white">
                Informations Légales & Politiques Officielles
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded bg-[#1b1b1b] hover:bg-[#262626] text-[#b0aba0] hover:text-white border border-[#333] transition cursor-pointer"
              title="Imprimer cette politique"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded bg-[#1b1b1b] hover:bg-[#262626] text-[#b0aba0] hover:text-white border border-[#333] transition cursor-pointer"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Menu for Policies */}
        <nav
          aria-label="Navigation des politiques"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#121212] border-b border-[#222] overflow-x-auto scrollbar-none"
        >
          {tabs.map((tab) => {
            const isActive = activePolicy === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePolicy(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#1f1b13] text-[#d4af37] border border-[#d4af37]/50 shadow-sm'
                    : 'text-[#9c9689] hover:text-white hover:bg-[#1a1a1a] border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.title}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-[#2a2416] text-[#d4af37] border border-[#d4af37]/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Policy Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6 text-sm leading-relaxed text-[#c7c2b5]">
          {/* ============================================================ */}
          {/* 1. POLITIQUE DE CONFIDENTIALITÉ */}
          {/* ============================================================ */}
          {activePolicy === 'privacy' && (
            <article className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#242119] pb-4">
                <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Shield className="w-4 h-4" />
                  Protection des Données & Vie Privée
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
                  Politique de confidentialité
                </h3>
                <p className="text-xs text-[#8a8579] mt-1">
                  Dernière mise à jour : 2026 · Conforme à la loi marocaine n° 09-08 (CNDP) et aux normes internationales de confidentialité (RGPD).
                </p>
              </div>

              <div className="bg-[#141414] p-4 rounded-lg border border-[#242119] text-xs text-[#ded9cd] space-y-2">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                  Engagement d&apos;excellence & de discrétion
                </p>
                <p>
                  La Maison Ovelzya accorde la plus haute importance à la confidentialité de ses clients. Vos informations personnelles ne font l&apos;objet d&apos;aucune revente, location ou cession commerciale à des tiers. Elles sont traitées avec le même niveau d&apos;exigence que nos créations de Haute Joaillerie.
                </p>
              </div>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  1. Données collectées
                </h4>
                <p>
                  Dans le cadre de votre visite et de vos commandes sur notre plateforme, nous pouvons recueillir :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><strong>Identité & contact :</strong> Nom complet, adresse e-mail, numéro de téléphone (WhatsApp), adresse postale de livraison et de facturation.</li>
                  <li><strong>Historique d&apos;achats :</strong> Détails des pièces commandées, dates de commande, numéros de suivi et certificats de garantie associés.</li>
                  <li><strong>Données de navigation & techniques :</strong> Adresse IP, fuseau horaire, cookies strictement fonctionnels nécessaires à la mémorisation de votre panier et de vos préférences linguistiques.</li>
                  <li><strong>Échanges avec la Conciergerie :</strong> Messages transmis via le formulaire client ou WhatsApp pour le suivi personnalisé de vos demandes et gravures.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  2. Finalité des traitements
                </h4>
                <p>Vos données sont exclusivement utilisées pour :</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Le traitement, la fabrication et l&apos;expédition sécurisée de vos commandes.</li>
                  <li>L&apos;établissement de vos certificats d&apos;authenticité et de garantie de 2 ans.</li>
                  <li>La communication en temps réel de votre statut de livraison (SMS, WhatsApp, e-mail).</li>
                  <li>L&apos;accès à votre Espace Membre Privé et le suivi de vos historiques.</li>
                  <li>L&apos;envoi exclusif des invitations et nouveautés de la Maison si vous y avez consenti lors de votre inscription au Cercle Privé.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  3. Sécurité des transactions et du stockage
                </h4>
                <p>
                  Notre plateforme utilise un protocole de chiffrement SSL 256 bits de dernière génération pour garantir l&apos;inviolabilité de vos transmissions. Aucune donnée bancaire sensible n&apos;est stockée sur nos serveurs. Pour les paiements à la livraison (Cash on Delivery), le règlement s&apos;effectue directement auprès du livreur assermenté.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  4. Vos droits (Accès, Rectification, Suppression)
                </h4>
                <p>
                  Conformément à la législation applicable, vous disposez à tout moment d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ces droits directement depuis votre Espace Membre ou en contactant notre Délégué à la Protection des Données à l&apos;adresse : <span className="text-[#d4af37] font-mono">contact@ovelzya.com</span>.
                </p>
              </section>
            </article>
          )}

          {/* ============================================================ */}
          {/* 2. POLITIQUE DE RETOUR ET DE REMBOURSEMENT */}
          {/* ============================================================ */}
          {activePolicy === 'returns' && (
            <article className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#242119] pb-4">
                <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-1">
                  <RotateCcw className="w-4 h-4" />
                  Sérénité & Échanges Privilégiés
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
                  Politique de retour et de remboursement
                </h3>
                <p className="text-xs text-[#8a8579] mt-1">
                  Délai de rétractation de 14 jours · Prise en charge personnalisée par notre Conciergerie.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#242119] space-y-1">
                  <div className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    14 Jours de Réflexion
                  </div>
                  <p className="text-xs text-[#aaa]">
                    Vous disposez de 14 jours calendaires à compter de la réception de votre colis pour demander un échange ou un remboursement.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#242119] space-y-1">
                  <div className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    État & Écrin d&apos;Origine
                  </div>
                  <p className="text-xs text-[#aaa]">
                    Le bijou doit être dans son état neuf, non porté, avec son scellé de sécurité intact et dans son coffret Ovelzya d&apos;origine.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#242119] space-y-1">
                  <div className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Garantie 2 Ans
                  </div>
                  <p className="text-xs text-[#aaa]">
                    Tout défaut de placage PVD ou de fabrication est couvert intégralement par notre garantie contractuelle de 2 ans.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  1. Conditions d&apos;éligibilité au retour
                </h4>
                <p>
                  Pour que le retour soit validé par nos maîtres joailliers, les conditions suivantes doivent être respectées :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>La demande doit être formalisée dans les 14 jours suivant la livraison.</li>
                  <li>La pièce ne doit présenter aucune trace d&apos;usure, choc, rayure ou modification par un tiers.</li>
                  <li>Le bijou doit être retourné complet avec son écrin de velours, son certificat d&apos;authenticité numéroté et ses accessoires de protection.</li>
                  <li><strong>Exceptions :</strong> Les créations personnalisées sur-mesure ou faisant l&apos;objet d&apos;une gravure personnalisée à votre demande ne peuvent faire l&apos;objet d&apos;un droit de rétractation (sauf vice caché ou défaut de conformité avéré).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  2. Procédure étape par étape
                </h4>
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
                  <li>
                    <strong>Notification :</strong> Contactez notre Conciergerie via votre Espace Membre (onglet « Messages Maison ») ou directement sur WhatsApp au <span className="text-[#d4af37] font-mono">+212 6 20 00 00 00</span> en mentionnant votre numéro de commande.
                  </li>
                  <li>
                    <strong>Bon de retour :</strong> Notre équipe vous transmet sous 24h un bordereau de retour sécurisé et les instructions d&apos;emballage.
                  </li>
                  <li>
                    <strong>Prise en charge :</strong> Un transporteur partenaire récupère le colis à votre adresse ou en agence express agréée.
                  </li>
                  <li>
                    <strong>Expertise & Remboursement :</strong> Dès réception dans nos ateliers, la pièce est examinée. Le remboursement ou l&apos;envoi de votre pièce d&apos;échange est déclenché sous 5 à 7 jours ouvrés.
                  </li>
                </ol>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  3. Modalités de remboursement
                </h4>
                <p>
                  Le remboursement s&apos;effectue selon le mode de paiement initial :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Pour les paiements par carte bancaire : recrédit immédiat sur le compte ayant servi à l&apos;achat.</li>
                  <li>Pour les commandes réglées à la livraison (COD) : virement bancaire sécurisé sur le RIB marocain de votre choix, ou émission d&apos;un avoir privilégié Ovelzya selon votre préférence.</li>
                </ul>
              </section>
            </article>
          )}

          {/* ============================================================ */}
          {/* 3. CONDITIONS DE VENTE (CGV) */}
          {/* ============================================================ */}
          {activePolicy === 'terms' && (
            <article className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#242119] pb-4">
                <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4" />
                  Cadre Contractuel & Garanties
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
                  Conditions de vente
                </h3>
                <p className="text-xs text-[#8a8579] mt-1">
                  Conditions Générales de Vente (CGV) applicables à toutes les commandes passées auprès de la Maison Ovelzya.
                </p>
              </div>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  Article 1 — Objet & Champ d&apos;application
                </h4>
                <p>
                  Les présentes Conditions Générales de Vente régissent de manière exclusive les relations contractuelles entre la société Maison OVELZYA et toute personne physique ou morale passant commande sur le site officiel. Toute commande implique l&apos;acceptation pleine et entière des présentes conditions.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  Article 2 — Produits & Caractéristiques
                </h4>
                <p>
                  Les pièces Ovelzya sont façonnées à partir d&apos;acier chirurgical inoxydable de nuance 316L, habillé d&apos;or 18 carats par procédé de dépôt physique en phase vapeur (PVD) sous vide, et complétées par des créations de maroquinerie artisanale. Chaque bijou est livré avec son certificat d&apos;authenticité individuel. Les photographies et descriptifs sont réalisés avec le plus grand soin pour refléter fidèlement la réalité des créations.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  Article 3 — Prix & Modalités de Paiement
                </h4>
                <p>
                  Les prix sont indiqués en Dirhams marocains (DH / MAD) toutes taxes comprises (TTC). La Maison se réserve le droit de modifier ses prix à tout moment, étant entendu que les pièces seront facturées sur la base des tarifs en vigueur au moment de la validation de la commande.
                </p>
                <p>Les modes de paiement acceptés comprennent :</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Le paiement à la livraison (Cash on Delivery / Espèces au livreur).</li>
                  <li>Le virement bancaire instantané ou anticipé.</li>
                  <li>Les moyens de paiement électroniques sécurisés (Apple Pay, Google Pay, Cartes Bancaires agréées).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  Article 4 — Réserve de propriété
                </h4>
                <p>
                  Les bijoux demeurent la propriété exclusive de la Maison Ovelzya jusqu&apos;au complet encaissement du prix convenu par notre service financier ou par le livreur habilité.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  Article 5 — Garantie contractuelle de 2 ans
                </h4>
                <p>
                  Toutes nos créations en acier 316L PVD bénéficient d&apos;une garantie commerciale de deux (2) années à compter de la date d&apos;achat. Cette garantie couvre le ternissement anormal, le décollement de la dorure PVD et tout vice de conception. Elle ne couvre pas la perte, le vol, les dommages résultant d&apos;accidents ou d&apos;un usage non conforme.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  Article 6 — Droit applicable & Litiges
                </h4>
                <p>
                  Les présentes conditions sont soumises au droit marocain. En cas de litige, une solution amiable sera systématiquement recherchée auprès de notre service Conciergerie avant toute action judiciaire devant les tribunaux compétents de Casablanca.
                </p>
              </section>
            </article>
          )}

          {/* ============================================================ */}
          {/* 4. MENTION LÉGALE */}
          {/* ============================================================ */}
          {activePolicy === 'legal' && (
            <article className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#242119] pb-4">
                <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Building2 className="w-4 h-4" />
                  Transparence & Renseignements Officiels
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
                  Mention légale
                </h3>
                <p className="text-xs text-[#8a8579] mt-1">
                  Informations réglementaires concernant l&apos;éditeur et l&apos;hébergement du site Maison Ovelzya.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#141414] border border-[#242119] space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold block">
                    Éditeur de la plateforme
                  </span>
                  <p className="text-sm font-semibold text-white">Maison OVELZYA SARL</p>
                  <p className="text-xs text-[#aaa]">Société à Responsabilité Limitée de Haute Joaillerie & Maroquinerie d&apos;Art.</p>
                  <div className="pt-2 text-xs text-[#bbb] space-y-1">
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> Siège social : Triangle d&apos;Or, Casablanca, Maroc</p>
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#d4af37]" /> Contact : contact@ovelzya.com</p>
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#d4af37]" /> Ligne Concierge : +212 5 22 00 00 00</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#141414] border border-[#242119] space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold block">
                    Immatriculations Officielles
                  </span>
                  <div className="text-xs text-[#bbb] space-y-1.5">
                    <p><strong className="text-white">Registre de Commerce :</strong> RC Casablanca 548920</p>
                    <p><strong className="text-white">Identifiant Fiscal (IF) :</strong> 40291845</p>
                    <p><strong className="text-white">Taxe Professionnelle (TP) :</strong> 37194820</p>
                    <p><strong className="text-white">ICE :</strong> 002984920000041</p>
                    <p><strong className="text-white">Directeur de la publication :</strong> Direction Générale Maison Ovelzya</p>
                  </div>
                </div>
              </div>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  Propriété Intellectuelle & Marques Déposées
                </h4>
                <p>
                  L&apos;ensemble de ce site relève de la législation marocaine et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables, les représentations iconographiques et photographiques ainsi que les marques « OVELZYA » et le monogramme emblématique.
                </p>
                <p>
                  Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce site sur quelque support que ce soit sans l&apos;accord exprès et préalable de la Maison Ovelzya constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  Hébergement Sécurisé
                </h4>
                <p>
                  Le site est hébergé sur une infrastructure cloud haute disponibilité et sécurisée conforme aux standards de sécurité bancaire et de chiffrement SSL 256 bits, garantissant une continuité de service 24h/24 et 7j/7.
                </p>
              </section>
            </article>
          )}

          {/* ============================================================ */}
          {/* 5. POLITIQUE D'EXPÉDITION */}
          {/* ============================================================ */}
          {activePolicy === 'shipping' && (
            <article className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#242119] pb-4">
                <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Truck className="w-4 h-4" />
                  Expédition & Acheminement Sécurisé
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
                  Politique d&apos;expédition
                </h3>
                <p className="text-xs text-[#8a8579] mt-1">
                  Livraison express sous 24h à 48h partout au Maroc · Suivi en temps réel · Écrin luxe scellé.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#242119] space-y-1">
                  <div className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Délais 24h – 48h
                  </div>
                  <p className="text-xs text-[#aaa]">
                    Casablanca & Rabat livrées sous 24h ouvrées. Toutes les autres villes du Royaume livrées sous 24h à 48h.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#242119] space-y-1">
                  <div className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Livraison Offerte dès 1 500 DH
                  </div>
                  <p className="text-xs text-[#aaa]">
                    Les frais de port sont offerts pour toute commande égale ou supérieure à 1 500 DH. Tarif fixe de 50 DH en dessous.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#242119] space-y-1">
                  <div className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Emballage Discret & Scellé
                  </div>
                  <p className="text-xs text-[#aaa]">
                    Emballage extérieur totalement neutre et sécurisé pour protéger la confidentialité et l&apos;intégrité de vos précieux bijoux.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  1. Zones de livraison & Transporteurs partenaires
                </h4>
                <p>
                  La Maison Ovelzya assure la livraison sur l&apos;intégralité du territoire marocain ainsi qu&apos;à l&apos;international :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><strong>Grand Casablanca & Rabat-Salé :</strong> Livraison par coursier privé dédié de la Maison avec prise de rendez-vous téléphonique préalable.</li>
                  <li><strong>Villes du Maroc (Marrakech, Tanger, Fès, Agadir, Oujda, Tétouan, Meknès, Laâyoune, Dakhla...) :</strong> Acheminement express via Amana Express ou CTM Messagerie sécurisée.</li>
                  <li><strong>Commandes Internationales :</strong> Expédition express assurée par DHL Express International avec déclaration douanière et certificat de conformité.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  2. Suivi de votre commande en direct
                </h4>
                <p>
                  Dès la remise de votre commande au transporteur :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Vous recevez un numéro de suivi officiel par e-mail et par notification WhatsApp.</li>
                  <li>Vous pouvez suivre chaque étape de l&apos;acheminement en temps réel depuis l&apos;outil de suivi intégré de notre site web ou depuis votre Espace Membre.</li>
                  <li>Le livreur vous contacte systématiquement par appel téléphonique avant son passage pour convenir du moment propice à la remise en mains propres.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[#d4af37]">
                  3. Contrôle à la livraison (Paiement à la réception)
                </h4>
                <p>
                  Pour nos clients choisissant le paiement à la livraison (COD), vous avez la possibilité de vérifier l&apos;intégrité de l&apos;emballage extérieur scellé en présence du livreur avant de procéder au règlement du montant exact indiqué sur votre bon de commande.
                </p>
              </section>
            </article>
          )}
        </div>

        {/* Modal Footer with Support / Assistance contact */}
        <div className="px-6 py-3.5 border-t border-[#242119] bg-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#8f8a7e]">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Une question particulière ? Notre Conciergerie vous répond sous 24h ouvrées.</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/212620000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] hover:underline font-medium"
            >
              WhatsApp Concierge
            </a>
            <span className="text-[#444]">·</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#d4af37] hover:bg-[#e8c878] text-black font-semibold text-xs rounded transition cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
