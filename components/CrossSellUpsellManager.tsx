'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Percent,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Eye,
  RefreshCw,
  Sliders,
  Layers,
  ShoppingBag,
  TrendingUp,
  Tag,
  Zap,
  Image as ImageIcon,
  Search,
  X,
  Lock,
  Gift,
  ExternalLink,
} from 'lucide-react';
import { Product, PromotionOfferRule, PromotionRuleType, PromotionDisplayStage, Language } from '@/lib/types';
import { getProductSku, findProductBySku, calculateDiscountedPrice } from '@/lib/skuUtils';

interface CrossSellUpsellManagerProps {
  products: Product[];
  rules: PromotionOfferRule[];
  onSaveRules: (newRules: PromotionOfferRule[]) => void;
  enableCrossSell: boolean;
  enableUpsell: boolean;
  onToggleEnableCrossSell: (enabled: boolean) => void;
  onToggleEnableUpsell: (enabled: boolean) => void;
  lang?: Language;
}

export default function CrossSellUpsellManager({
  products,
  rules,
  onSaveRules,
  enableCrossSell,
  enableUpsell,
  onToggleEnableCrossSell,
  onToggleEnableUpsell,
}: CrossSellUpsellManagerProps) {
  // Filter by rule type and display stage in the table
  const [filterType, setFilterType] = useState<'all' | 'cross_sell' | 'upsell'>('all');
  const [filterStage, setFilterStage] = useState<'all' | PromotionDisplayStage>('all');

  // Form State for creating / editing rules
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<PromotionRuleType>('cross_sell');
  const [sourceSkuInput, setSourceSkuInput] = useState<string>('MD-COL-001');
  const [targetSkuInput, setTargetSkuInput] = useState<string>('MD-BRA-002');
  const [discountPct, setDiscountPct] = useState<number>(15);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customBadge, setCustomBadge] = useState<string>('');
  const [displayStage, setDisplayStage] = useState<PromotionDisplayStage>('product_page');
  const [ruleActive, setRuleActive] = useState<boolean>(true);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Live Simulator Stage (lets admin preview all stages dynamically)
  const [simulatorStage, setSimulatorStage] = useState<PromotionDisplayStage>('product_page');
  const [simulatedAdded, setSimulatedAdded] = useState<boolean>(false);

  // Visual Product Catalog Picker Modal
  const [pickerTarget, setPickerTarget] = useState<'source' | 'target' | null>(null);
  const [pickerSearch, setPickerSearch] = useState<string>('');

  // Live recognition of products by SKU
  const recognizedSourceProduct = useMemo(() => {
    return findProductBySku(sourceSkuInput, products);
  }, [sourceSkuInput, products]);

  const recognizedTargetProduct = useMemo(() => {
    return findProductBySku(targetSkuInput, products);
  }, [targetSkuInput, products]);

  // Robust target fallback for preview: never show a broken or empty preview!
  const effectiveTargetProduct = useMemo(() => {
    if (recognizedTargetProduct) return recognizedTargetProduct;
    if (products && products.length > 1) {
      // Pick a jewel different from the recognized source if possible
      const alt = products.find((p) => recognizedSourceProduct && p.id !== recognizedSourceProduct.id);
      return alt || products[1];
    }
    return products && products.length > 0 ? products[0] : null;
  }, [recognizedTargetProduct, recognizedSourceProduct, products]);

  const effectiveSourceProduct = useMemo(() => {
    if (recognizedSourceProduct) return recognizedSourceProduct;
    return products && products.length > 0 ? products[0] : null;
  }, [recognizedSourceProduct, products]);

  // Calculations for target product discount
  const targetOriginalPrice = recognizedTargetProduct?.price || effectiveTargetProduct?.price || 0;
  const targetDiscountedPrice = calculateDiscountedPrice(targetOriginalPrice, discountPct);
  const targetSavings = targetOriginalPrice - targetDiscountedPrice;

  // Sync simulator stage when form display stage changes
  const handleStageChange = (newStage: PromotionDisplayStage) => {
    setDisplayStage(newStage);
    setSimulatorStage(newStage);
  };

  // Preview an existing rule directly from table into simulator
  const handlePreviewRule = (rule: PromotionOfferRule) => {
    setFormType(rule.type);
    setSourceSkuInput(rule.sourceSku);
    setTargetSkuInput(rule.targetSku);
    setDiscountPct(rule.discountPct);
    setCustomTitle(rule.customTitle || '');
    setCustomBadge(rule.customBadge || '');
    const stage = rule.displayStage || 'product_page';
    setDisplayStage(stage);
    setSimulatorStage(stage);
    setRuleActive(rule.active);

    setNotificationMsg(`✦ Règle « ${rule.customTitle || rule.targetSku} » chargée dans l'aperçu en direct`);
    setTimeout(() => setNotificationMsg(null), 3500);

    const simEl = document.getElementById('cross-sell-live-simulator');
    if (simEl) {
      simEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Set default suggested title and badge when type or products change
  const handleTypeChange = (newType: PromotionRuleType) => {
    setFormType(newType);
    if (newType === 'cross_sell') {
      if (!customTitle || customTitle.includes('Surclassement')) {
        setCustomTitle('Complétez votre parure avec le bijou assorti');
      }
      if (!customBadge || customBadge.includes('Surclassement')) {
        setCustomBadge('Offre Parure −' + discountPct + '%');
      }
    } else {
      if (!customTitle || customTitle.includes('parure')) {
        setCustomTitle('Surclassement Joaillerie : Version Haute Brillance');
      }
      if (!customBadge || customBadge.includes('Parure')) {
        setCustomBadge('Version Supérieure −' + discountPct + '%');
      }
    }
  };

  // Quick preset loader
  const handleSelectSourceProduct = (sku: string) => {
    setSourceSkuInput(sku);
  };

  const handleSelectTargetProduct = (sku: string) => {
    setTargetSkuInput(sku);
  };

  // Reset form
  const resetForm = () => {
    setIsEditingId(null);
    setFormType('cross_sell');
    setSourceSkuInput('MD-COL-001');
    setTargetSkuInput('MD-BRA-002');
    setDiscountPct(15);
    setCustomTitle('Complétez votre parure avec le bijou assorti');
    setCustomBadge('Offre Parure −15%');
    setDisplayStage('product_page');
    setRuleActive(true);
  };

  // Edit existing rule
  const handleEditRule = (rule: PromotionOfferRule) => {
    setIsEditingId(rule.id);
    setFormType(rule.type);
    setSourceSkuInput(rule.sourceSku);
    setTargetSkuInput(rule.targetSku);
    setDiscountPct(rule.discountPct);
    setCustomTitle(rule.customTitle || '');
    setCustomBadge(rule.customBadge || '');
    setDisplayStage(rule.displayStage || 'product_page');
    setRuleActive(rule.active);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Save (Create or Update) Rule
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceSkuInput.trim() || !targetSkuInput.trim()) {
      setNotificationMsg('Veuillez renseigner un SKU pour le produit source et le produit proposé.');
      setTimeout(() => setNotificationMsg(null), 3500);
      return;
    }

    let target = recognizedTargetProduct;
    if (!target) {
      target = findProductBySku(targetSkuInput, products);
    }
    if (!target && targetSkuInput.trim()) {
      setNotificationMsg(`Le SKU cible "${targetSkuInput}" n'a pas été reconnu. Veuillez sélectionner un bijou du catalogue.`);
      setTimeout(() => setNotificationMsg(null), 3500);
      return;
    }

    const stageToSave: PromotionDisplayStage = displayStage || 'product_page';

    const newRule: PromotionOfferRule = {
      id: isEditingId || `rule_${formType}_${Date.now()}`,
      type: formType,
      sourceSku: sourceSkuInput.trim().toUpperCase(),
      targetSku: targetSkuInput.trim().toUpperCase(),
      discountPct: Number(discountPct) || 0,
      customTitle: customTitle.trim() || (formType === 'cross_sell' ? 'Complétez votre parure' : 'Version Supérieure'),
      customBadge: customBadge.trim() || (formType === 'cross_sell' ? `Offre Parure −${discountPct}%` : `Surclassement −${discountPct}%`),
      displayStage: stageToSave,
      active: ruleActive,
    };

    let updatedRules: PromotionOfferRule[];
    if (isEditingId) {
      updatedRules = rules.map((r) => (r.id === isEditingId ? newRule : r));
      setNotificationMsg(`Règle mise à jour avec succès (Étape : ${stageToSave}) !`);
    } else {
      updatedRules = [newRule, ...rules];
      setNotificationMsg(`Nouvelle offre enregistrée avec succès (Étape : ${stageToSave}) !`);
    }

    onSaveRules(updatedRules);
    resetForm();
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Quick 1-click stage changer directly from the rules table
  const handleQuickChangeStage = (id: string, newStage: PromotionDisplayStage) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, displayStage: newStage } : r));
    onSaveRules(updated);
    setNotificationMsg(`Étape modifiée avec succès pour l'offre (${newStage}) !`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Toggle single rule active state
  const handleToggleRule = (id: string) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
    onSaveRules(updated);
  };

  // Delete rule
  const handleDeleteRule = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      const updated = rules.filter((r) => r.id !== id);
      onSaveRules(updated);
      if (isEditingId === id) resetForm();
    }
  };

  // Filtered rules for table
  const displayedRules = useMemo(() => {
    return rules.filter((r) => {
      if (filterType === 'cross_sell' && r.type !== 'cross_sell') return false;
      if (filterType === 'upsell' && r.type !== 'upsell') return false;
      if (filterStage !== 'all') {
        const stage = r.displayStage || 'product_page';
        if (stage !== filterStage) return false;
      }
      return true;
    });
  }, [rules, filterType, filterStage]);

  const activeCrossCount = rules.filter((r) => r.type === 'cross_sell' && r.active).length;
  const activeUpsellCount = rules.filter((r) => r.type === 'upsell' && r.active).length;

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* Top Banner: Concept Explanation & Toggles */}
      <div className="bg-[#141414] border border-[#292929] rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 font-bold">
                ✦ Moteur de Vente Additionnelle
              </span>
              <span className="text-xs text-[#9a958a]">
                {rules.length} offre(s) configurée(s)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2 flex items-center gap-2.5">
              <TrendingUp className="w-7 h-7 text-[#d4af37]" />
              <span>Gestion & Personnalisation Cross-Sell & Upsell</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#9a958a] mt-1.5 max-w-3xl leading-relaxed">
              Associez automatiquement vos pièces de joaillerie par leur <strong>référence SKU</strong>.
              Dès la saisie du SKU, la <strong>vignette du bijou est reconnue et affichée instantanément</strong> avec son prix calculé et sa réduction personnalisée.
            </p>
          </div>

          {/* Master Toggles for Cross-sell & Upsell */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Cross-sell Switch */}
            <div className={`p-3.5 rounded-xl border transition ${enableCrossSell ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-[#181818] border-[#333] text-[#888]'}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold block text-white">Cross-Sell (Produit Complémentaire)</span>
                  <span className="text-[10px] text-[#9a958a] block">Ex: Collier ➔ Bracelet ou Boucles assorties</span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleEnableCrossSell(!enableCrossSell)}
                  className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${enableCrossSell ? 'bg-emerald-500' : 'bg-[#333]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${enableCrossSell ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Upsell Switch */}
            <div className={`p-3.5 rounded-xl border transition ${enableUpsell ? 'bg-purple-950/30 border-purple-500/40 text-purple-300' : 'bg-[#181818] border-[#333] text-[#888]'}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold block text-white">Upsell (Version Supérieure)</span>
                  <span className="text-[10px] text-[#9a958a] block">Ex: Solitaire simple ➔ Version pavée</span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleEnableUpsell(!enableUpsell)}
                  className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${enableUpsell ? 'bg-purple-500' : 'bg-[#333]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${enableUpsell ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dual pedagogical cards: Cross-sell vs Upsell */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#242424]">
          {/* Card Cross-sell */}
          <div className="p-4 rounded-xl bg-[#181818] border border-emerald-900/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Principe Cross-Sell (Vente Croisée)
                </h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {activeCrossCount} active(s)
                </span>
              </div>
              <p className="text-xs text-[#cfcbc2] mt-1 leading-relaxed">
                <strong>Proposer un produit complémentaire</strong> : quand la cliente consulte un collier, vous lui proposez le bracelet de la même collection ou les boucles d&apos;oreilles assorties pour former une parure harmonieuse.
              </p>
            </div>
          </div>

          {/* Card Upsell */}
          <div className="p-4 rounded-xl bg-[#181818] border border-purple-900/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Principe Upsell (Montée en Gamme)
                </h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {activeUpsellCount} active(s)
                </span>
              </div>
              <p className="text-xs text-[#cfcbc2] mt-1 leading-relaxed">
                <strong>Proposer une version plus chère / supérieure</strong> : quand la cliente regarde une bague, vous lui suggérez la version haute joaillerie avec pavage diamants ou or 18K enrichi, avec un avantage de réduction personnalisé.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notificationMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 flex items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold">{notificationMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationMsg(null)}
            className="text-emerald-400 hover:text-white text-xs p-1"
          >
            Fermer
          </button>
        </div>
      )}

      {/* CREATION & CUSTOMIZATION FORM */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#242424] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              {isEditingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                {isEditingId ? 'Modifier la Règle Promotionnelle' : 'Ajouter une Offre Cross-Sell ou Upsell'}
              </h3>
              <span className="text-xs text-[#888]">
                Définissez le déclencheur, le SKU proposé, la réduction et l&apos;accroche
              </span>
            </div>
          </div>

          {isEditingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#9a958a] hover:text-white px-3 py-1.5 rounded bg-[#222] transition"
            >
              Annuler la modification
            </button>
          )}
        </div>

        <form onSubmit={handleSaveRule} className="space-y-6">
          {/* 1. Choice of Strategy: Cross-sell vs Upsell */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#cfcbc2] mb-2">
              1. Type de Proposition Commerciale *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('cross_sell')}
                className={`p-4 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  formType === 'cross_sell'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-[#181818] border-[#333] hover:border-[#444]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${formType === 'cross_sell' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#252525] text-emerald-400'}`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Cross-Sell (Produit Complémentaire)
                  </span>
                  <span className="text-[11px] text-[#9a958a] block mt-0.5">
                    Proposer le bijou assorti (bracelet, boucles, etc.) pour composer la parure complète.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('upsell')}
                className={`p-4 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  formType === 'upsell'
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
                    : 'bg-[#181818] border-[#333] hover:border-[#444]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${formType === 'upsell' ? 'bg-purple-500 text-white font-bold' : 'bg-[#252525] text-purple-400'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Upsell (Version Supérieure / Plus Chère)
                  </span>
                  <span className="text-[11px] text-[#9a958a] block mt-0.5">
                    Inciter à choisir la pièce de gamme supérieure avec un avantage tarifaire exclusif.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Source Trigger Product & Target Recommended Product with Auto-Recognition */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SOURCE TRIGGER */}
            <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <span>Produit Déclencheur (Quand le client regarde) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPickerTarget('source');
                    setPickerSearch('');
                  }}
                  className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#303030] text-[#d4af37] text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer border border-[#d4af37]/30"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choisir par photo</span>
                </button>
              </div>

              {/* SKU input + Dropdown */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sourceSkuInput}
                    onChange={(e) => setSourceSkuInput(e.target.value.toUpperCase())}
                    placeholder="Ex: MD-COL-001 ou *"
                    className="flex-1 bg-[#121212] border border-[#383838] focus:border-[#d4af37] rounded-lg px-3 py-2.5 text-xs text-white uppercase font-mono tracking-wider outline-none"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setSourceSkuInput(e.target.value);
                    }}
                    value={recognizedSourceProduct ? getProductSku(recognizedSourceProduct) : (sourceSkuInput === '*' ? '*' : '')}
                    className="w-44 bg-[#121212] border border-[#383838] rounded-lg px-2 text-xs text-[#cfcbc2] outline-none"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="*">✦ Tous les bijoux (*)</option>
                    {products.map((p) => (
                      <option key={p.id} value={getProductSku(p)}>
                        {p.name} ({getProductSku(p)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick 1-click source suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-[#888]">Rapide :</span>
                  <button
                    type="button"
                    onClick={() => setSourceSkuInput('*')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                      sourceSkuInput === '*' ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#222] text-[#aaa] hover:text-white'
                    }`}
                  >
                    Tous (*)
                  </button>
                  {products.slice(0, 3).map((p) => {
                    const sku = getProductSku(p);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSourceSkuInput(sku)}
                        className={`px-2 py-0.5 rounded text-[10px] truncate max-w-[140px] transition cursor-pointer ${
                          sourceSkuInput === sku ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#222] text-[#aaa] hover:text-white'
                        }`}
                        title={p.name}
                      >
                        {p.name.slice(0, 16)}...
                      </button>
                    );
                  })}
                </div>

                {/* Live Recognized Source Vignette */}
                {sourceSkuInput === '*' || sourceSkuInput === 'ALL' ? (
                  <div className="p-3 bg-[#131313] border border-amber-500/40 rounded-lg flex items-center gap-3 animate-fade-in">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white block">Règle Universelle (Tout le catalogue)</span>
                      <span className="text-[11px] text-[#9a958a] block mt-0.5">
                        L&apos;offre s&apos;affichera pour n&apos;importe quel bijou consulté par la cliente.
                      </span>
                    </div>
                  </div>
                ) : recognizedSourceProduct ? (
                  <div className="p-3 bg-[#131313] border border-emerald-900/40 rounded-lg flex items-center gap-3 animate-fade-in">
                    <div className="w-14 h-16 rounded-md overflow-hidden bg-[#222] border border-[#333] shrink-0">
                      <img
                        src={recognizedSourceProduct.img || `https://picsum.photos/seed/${recognizedSourceProduct.seed}/200/250`}
                        alt={recognizedSourceProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-[#d4af37] bg-[#d4af37]/10 px-1.5 py-0.5 rounded border border-[#d4af37]/20">
                          {getProductSku(recognizedSourceProduct)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          ✦ Reconnu
                        </span>
                      </div>
                      <h4 className="text-xs font-serif font-bold text-white truncate mt-1">
                        {recognizedSourceProduct.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#9a958a] mt-0.5">
                        <span>{recognizedSourceProduct.cat}</span>
                        <span>•</span>
                        <span className="text-white font-semibold">{recognizedSourceProduct.price} DH</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-amber-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Sélectionnez un bijou déclencheur ou cliquez sur « Choisir par photo ».</span>
                  </div>
                )}
              </div>
            </div>

            {/* TARGET RECOMMENDED WITH AUTO VIGNETTE */}
            <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span>Produit Proposé (Recommandé avec Vignette Auto) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPickerTarget('target');
                    setPickerSearch('');
                  }}
                  className="px-2.5 py-1 rounded bg-[#242424] hover:bg-[#303030] text-emerald-400 text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer border border-emerald-500/30"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choisir par photo</span>
                </button>
              </div>

              {/* SKU input + Dropdown */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetSkuInput}
                    onChange={(e) => setTargetSkuInput(e.target.value.toUpperCase())}
                    placeholder="Ex: MD-BRA-002"
                    className="flex-1 bg-[#121212] border border-[#383838] focus:border-[#d4af37] rounded-lg px-3 py-2.5 text-xs text-white uppercase font-mono tracking-wider outline-none"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setTargetSkuInput(e.target.value);
                    }}
                    value={recognizedTargetProduct ? getProductSku(recognizedTargetProduct) : ''}
                    className="w-44 bg-[#121212] border border-[#383838] rounded-lg px-2 text-xs text-[#cfcbc2] outline-none"
                  >
                    <option value="">Sélectionner...</option>
                    {products.map((p) => (
                      <option key={p.id} value={getProductSku(p)}>
                        {p.name} ({getProductSku(p)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick 1-click target suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-[#888]">Rapide :</span>
                  {products.slice(1, 4).map((p) => {
                    const sku = getProductSku(p);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTargetSkuInput(sku)}
                        className={`px-2 py-0.5 rounded text-[10px] truncate max-w-[140px] transition cursor-pointer ${
                          targetSkuInput === sku ? 'bg-emerald-500 text-black font-bold' : 'bg-[#222] text-[#aaa] hover:text-white'
                        }`}
                        title={p.name}
                      >
                        {p.name.slice(0, 16)}...
                      </button>
                    );
                  })}
                </div>

                {/* AUTOMATIC VIGNETTE DISPLAYED ON RECOGNITION */}
                {recognizedTargetProduct ? (
                  <div className="p-3 bg-[#131313] border border-[#d4af37]/40 rounded-lg flex items-center gap-3 animate-fade-in shadow-md">
                    <div className="relative w-14 h-16 rounded-md overflow-hidden bg-[#222] border border-[#d4af37]/50 shrink-0">
                      <img
                        src={recognizedTargetProduct.img || `https://picsum.photos/seed/${recognizedTargetProduct.seed}/200/250`}
                        alt={recognizedTargetProduct.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-[#d4af37] font-bold py-0.5">
                        VIGNETTE
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-[#d4af37] bg-[#d4af37]/10 px-1.5 py-0.5 rounded border border-[#d4af37]/20">
                          {getProductSku(recognizedTargetProduct)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Vignette Reconnue</span>
                        </span>
                      </div>
                      <h4 className="text-xs font-serif font-bold text-white truncate mt-1">
                        {recognizedTargetProduct.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="text-[#888] line-through">
                          {targetOriginalPrice} DH
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#9a958a]" />
                        <span className="text-[#d4af37] font-bold">
                          {targetDiscountedPrice} DH
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          −{discountPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gradient-to-r from-emerald-950/20 to-amber-950/20 border border-emerald-800/40 rounded-lg text-emerald-300 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>Cliquez sur « Choisir par photo » ou un bouton rapide pour sélectionner le bijou cible.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Personalized Discount Percentage & Price Calculator */}
          <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#cfcbc2] flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#d4af37]" />
                <span>3. Proposition de Pourcentage de Réduction Personnalisé *</span>
              </label>
              <div className="flex items-center gap-2">
                {[10, 15, 20, 25].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setDiscountPct(preset);
                      if (formType === 'cross_sell') setCustomBadge(`Offre Parure −${preset}%`);
                      else setCustomBadge(`Version Supérieure −${preset}%`);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                      discountPct === preset
                        ? 'bg-[#d4af37] text-black'
                        : 'bg-[#222] hover:bg-[#2e2e2e] text-[#cfcbc2]'
                    }`}
                  >
                    −{preset}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Slider + Number Input */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={discountPct}
                    onChange={(e) => setDiscountPct(Number(e.target.value))}
                    className="flex-1 accent-[#d4af37] cursor-pointer"
                  />
                  <div className="w-20 relative">
                    <input
                      type="number"
                      min="0"
                      max="70"
                      value={discountPct}
                      onChange={(e) => setDiscountPct(Number(e.target.value))}
                      className="w-full bg-[#121212] border border-[#383838] focus:border-[#d4af37] rounded-lg px-2.5 py-1.5 text-sm text-white font-bold text-center outline-none"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-[#888]">%</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#888] block">
                  La réduction s&apos;applique directement au produit proposé lorsqu&apos;il est ajouté depuis la fiche ou le panier.
                </span>
              </div>

              {/* Calculated Economics Box */}
              <div className="p-3 bg-[#111] border border-[#2b2b2b] rounded-lg text-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#888] block">
                  Impact Tarifaire en Direct
                </span>
                <div className="flex justify-between text-[#9a958a]">
                  <span>Tarif normal :</span>
                  <span className="line-through">{targetOriginalPrice} DH</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>Tarif remisé :</span>
                  <span className="text-[#d4af37]">{targetDiscountedPrice} DH</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-[#222]">
                  <span>Économie cliente :</span>
                  <span>−{targetSavings} DH</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Custom Headline & Custom Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#cfcbc2] mb-1.5">
                Accroche Promotionnelle Personnalisée *
              </label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Ex: Complétez votre parure avec le bracelet assorti"
                className="w-full bg-[#181818] border border-[#333] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
              <span className="text-[10px] text-[#888] block mt-1">
                Affiché au-dessus de la vignette du bijou proposé.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cfcbc2] mb-1.5">
                Badge Personnalisé sur la Vignette *
              </label>
              <input
                type="text"
                required
                value={customBadge}
                onChange={(e) => setCustomBadge(e.target.value)}
                placeholder="Ex: Offre Parure −15%"
                className="w-full bg-[#181818] border border-[#333] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
              <span className="text-[10px] text-[#888] block mt-1">
                Badge d&apos;accroche visuel placé sur la vignette.
              </span>
            </div>
          </div>

          {/* 4. Choice of Funnel Stage where Cross-sell / Upsell appears */}
          <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#cfcbc2] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#d4af37]" />
                <span>4. Étape d’apparition de l’offre (Parcours client) *</span>
              </label>
              <span className="text-[11px] text-[#d4af37] font-medium">
                {displayStage === 'product_page' && 'Fiche Produit'}
                {displayStage === 'cart_add' && 'Tiroir Panier'}
                {displayStage === 'checkout_start' && 'Étape Checkout'}
                {displayStage === 'purchase_completed' && 'Page Confirmation Post-Achat'}
              </span>
            </div>

            {/* Direct select dropdown for 100% reliable stage selection */}
            <div className="bg-[#111] p-3 rounded-lg border border-[#2d2d2d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-[#9a958a]">
                Sélection directe de l&apos;étape :
              </span>
              <select
                value={displayStage}
                onChange={(e) => setDisplayStage(e.target.value as PromotionDisplayStage)}
                className="px-3 py-1.5 bg-[#181818] border border-[#d4af37]/60 text-xs text-white rounded focus:border-[#d4af37] focus:outline-none font-medium cursor-pointer"
              >
                <option value="product_page">Étape 1 : Vue de page produit (Fiche bijou)</option>
                <option value="cart_add">Étape 2 : Ajout au panier (Tiroir latéral)</option>
                <option value="checkout_start">Étape 3 : Début de checkout (Commande)</option>
                <option value="purchase_completed">Étape 4 : Achat finalisé (Post-Achat)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* Stage 1: Vue de page produit */}
              <button
                type="button"
                onClick={() => setDisplayStage('product_page')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  displayStage === 'product_page'
                    ? 'bg-[#d4af37]/15 border-[#d4af37] ring-1 ring-[#d4af37]'
                    : 'bg-[#121212] border-[#2e2e2e] hover:border-[#444]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    displayStage === 'product_page' ? 'bg-[#d4af37] text-black' : 'bg-[#222] text-[#aaa]'
                  }`}>
                    Étape 1
                  </span>
                  <Eye className={`w-4 h-4 ${displayStage === 'product_page' ? 'text-[#d4af37]' : 'text-[#666]'}`} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Vue de page produit</h5>
                  <p className="text-[11px] text-[#888] mt-0.5 leading-snug">
                    Fiche détaillée du bijou déclencheur avant tout ajout au panier.
                  </p>
                </div>
              </button>

              {/* Stage 2: Ajout au panier */}
              <button
                type="button"
                onClick={() => setDisplayStage('cart_add')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  displayStage === 'cart_add'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-[#121212] border-[#2e2e2e] hover:border-[#444]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    displayStage === 'cart_add' ? 'bg-emerald-500 text-black' : 'bg-[#222] text-[#aaa]'
                  }`}>
                    Étape 2
                  </span>
                  <ShoppingBag className={`w-4 h-4 ${displayStage === 'cart_add' ? 'text-emerald-400' : 'text-[#666]'}`} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Ajout au panier</h5>
                  <p className="text-[11px] text-[#888] mt-0.5 leading-snug">
                    Tiroir latéral coulissant dès que le produit est mis au panier.
                  </p>
                </div>
              </button>

              {/* Stage 3: Début de checkout */}
              <button
                type="button"
                onClick={() => setDisplayStage('checkout_start')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  displayStage === 'checkout_start'
                    ? 'bg-sky-950/40 border-sky-500 ring-1 ring-sky-500'
                    : 'bg-[#121212] border-[#2e2e2e] hover:border-[#444]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    displayStage === 'checkout_start' ? 'bg-sky-500 text-black' : 'bg-[#222] text-[#aaa]'
                  }`}>
                    Étape 3
                  </span>
                  <Tag className={`w-4 h-4 ${displayStage === 'checkout_start' ? 'text-sky-400' : 'text-[#666]'}`} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Début de checkout</h5>
                  <p className="text-[11px] text-[#888] mt-0.5 leading-snug">
                    Formulaire de commande juste avant la sélection de livraison/paiement.
                  </p>
                </div>
              </button>

              {/* Stage 4: Achat finalisé */}
              <button
                type="button"
                onClick={() => setDisplayStage('purchase_completed')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  displayStage === 'purchase_completed'
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-[#121212] border-[#2e2e2e] hover:border-[#444]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    displayStage === 'purchase_completed' ? 'bg-amber-500 text-black' : 'bg-[#222] text-[#aaa]'
                  }`}>
                    Étape 4
                  </span>
                  <Sparkles className={`w-4 h-4 ${displayStage === 'purchase_completed' ? 'text-amber-400' : 'text-[#666]'}`} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Achat finalisé</h5>
                  <p className="text-[11px] text-[#888] mt-0.5 leading-snug">
                    Page de confirmation avec offre privilège post-achat exclusive.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#242424]">
            <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ruleActive}
                onChange={(e) => setRuleActive(e.target.checked)}
                className="w-4 h-4 accent-[#d4af37] rounded"
              />
              <span>Règle active immédiatement sur la boutique</span>
            </label>

            <div className="flex items-center gap-3">
              {isEditingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded bg-[#222] hover:bg-[#2c2c2c] text-xs text-[#cfcbc2] transition cursor-pointer"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded bg-[#d4af37] hover:bg-[#e8c878] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-[#d4af37]/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isEditingId ? 'Enregistrer les modifications' : 'Créer l’Offre Cross-Sell / Upsell'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* LIVE SIMULATOR: HOW CLIENTS SEE IT ON THE STOREFRONT */}
      <div id="cross-sell-live-simulator" className="bg-[#121212] border border-[#2b2b2b] rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242424] pb-4">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-white flex items-center gap-2">
                <span>Aperçu en Direct Multi-Étapes (Live Storefront Preview)</span>
              </h3>
              <span className="text-[11px] text-[#888]">
                Visualisez fidèlement le rendu client selon l&apos;étape sélectionnée
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {recognizedTargetProduct ? (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Connecté : {getProductSku(recognizedTargetProduct)}</span>
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-700/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>Simulation avec bijou modèle</span>
              </span>
            )}
          </div>
        </div>

        {/* Funnel Stage Switcher Tabs in Live Preview */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSimulatorStage('product_page')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              simulatorStage === 'product_page'
                ? 'bg-[#d4af37] text-black shadow'
                : 'bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>1. Fiche Produit</span>
          </button>
          <button
            type="button"
            onClick={() => setSimulatorStage('cart_add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              simulatorStage === 'cart_add'
                ? 'bg-emerald-500 text-black shadow'
                : 'bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>2. Tiroir Panier</span>
          </button>
          <button
            type="button"
            onClick={() => setSimulatorStage('checkout_start')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              simulatorStage === 'checkout_start'
                ? 'bg-sky-500 text-black shadow'
                : 'bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>3. Étape Checkout</span>
          </button>
          <button
            type="button"
            onClick={() => setSimulatorStage('purchase_completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              simulatorStage === 'purchase_completed'
                ? 'bg-amber-500 text-black shadow'
                : 'bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>4. Post-Achat</span>
          </button>
        </div>

        {/* Live Rendering Stage Container */}
        {effectiveTargetProduct ? (
          <div className="space-y-4">
            {/* STAGE 1: PRODUCT PAGE LUXURY CARD */}
            {simulatorStage === 'product_page' && (
              <div className="max-w-2xl mx-auto p-5 rounded-xl bg-gradient-to-br from-[#181818] via-[#141414] to-[#101010] border border-[#d4af37]/40 shadow-2xl space-y-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#d4af37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{customBadge || (formType === 'cross_sell' ? 'Offre Parure' : 'Surclassement Haute Brillance')}</span>
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    −{discountPct}% Immédiat
                  </span>
                </div>

                <p className="text-sm font-serif font-semibold text-white">
                  {customTitle || (formType === 'cross_sell' ? 'Complétez votre parure avec le bijou assorti' : 'Surclassement Joaillerie : Version Supérieure')}
                </p>

                {/* Card Container */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#141414] border border-[#272727] rounded-lg p-3.5">
                  <div className="relative w-24 h-28 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-black shrink-0 border border-[#d4af37]/40 shadow">
                    <img
                      src={effectiveTargetProduct.img || `https://picsum.photos/seed/${effectiveTargetProduct.seed}/250/300`}
                      alt={effectiveTargetProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                      −{discountPct}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-[#9a958a]">
                      {effectiveTargetProduct.cat} · Réf. {getProductSku(effectiveTargetProduct)}
                    </div>
                    <h5 className="text-sm font-serif font-bold text-white truncate">
                      {effectiveTargetProduct.name}
                    </h5>
                    <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-0.5">
                      <span className="text-base font-bold text-[#d4af37]">
                        {targetDiscountedPrice} DH
                      </span>
                      <span className="text-xs text-[#888] line-through">
                        {targetOriginalPrice} DH
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        (Économisez {targetSavings} DH)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedAdded(true);
                      setTimeout(() => setSimulatedAdded(false), 3000);
                    }}
                    className={`px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition shrink-0 shadow-lg cursor-pointer flex items-center gap-1.5 ${
                      simulatedAdded
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#d4af37] hover:bg-[#e8c878] text-black hover:scale-102'
                    }`}
                  >
                    {simulatedAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Ajouté !</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter à la parure</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: CART DRAWER COMPACT CARD */}
            {simulatorStage === 'cart_add' && (
              <div className="max-w-md mx-auto p-4 rounded-xl bg-[#131313] border border-emerald-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#888] border-b border-[#222] pb-2">
                  <span>Simulation dans le Tiroir Panier</span>
                  <span className="text-emerald-400 font-semibold">Tiroir coulissant</span>
                </div>

                <div className="p-3 bg-[#181818] border border-emerald-600/30 rounded-lg flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded overflow-hidden bg-black shrink-0 border border-[#333]">
                    <img
                      src={effectiveTargetProduct.img || `https://picsum.photos/seed/${effectiveTargetProduct.seed}/150/180`}
                      alt={effectiveTargetProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-0.5 left-0.5 bg-red-600 text-white text-[8px] font-bold px-1 rounded">
                      -{discountPct}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-[#d4af37] truncate block">
                      {customBadge || 'Offre Recommandée'}
                    </span>
                    <h5 className="text-xs font-semibold text-white truncate">
                      {effectiveTargetProduct.name}
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <span className="text-[#d4af37] font-bold">{targetDiscountedPrice} DH</span>
                      <span className="text-[10px] line-through text-[#777]">{targetOriginalPrice} DH</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedAdded(true);
                      setTimeout(() => setSimulatedAdded(false), 3000);
                    }}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase transition shrink-0 cursor-pointer ${
                      simulatedAdded ? 'bg-emerald-500 text-black' : 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                    }`}
                  >
                    {simulatedAdded ? '✓ Ajouté' : `+ Ajouter`}
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: CHECKOUT PRIVILEGE OFFER */}
            {simulatorStage === 'checkout_start' && (
              <div className="max-w-md mx-auto p-4 rounded-xl bg-[#131313] border border-sky-500/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Privilège Réservé au Tunnel de Commande</span>
                </div>

                <div className="p-3 bg-[#181818] border border-sky-600/30 rounded-lg flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded overflow-hidden bg-black shrink-0 border border-[#333]">
                    <img
                      src={effectiveTargetProduct.img || `https://picsum.photos/seed/${effectiveTargetProduct.seed}/150/180`}
                      alt={effectiveTargetProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-sky-400 truncate block">
                      Livraison Unique & Offerte
                    </span>
                    <h5 className="text-xs font-semibold text-white truncate">
                      {effectiveTargetProduct.name}
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <span className="text-[#d4af37] font-bold">{targetDiscountedPrice} DH</span>
                      <span className="text-[10px] line-through text-[#777]">{targetOriginalPrice} DH</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedAdded(true);
                      setTimeout(() => setSimulatedAdded(false), 3000);
                    }}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase transition shrink-0 cursor-pointer ${
                      simulatedAdded ? 'bg-sky-400 text-black' : 'bg-sky-500 hover:bg-sky-400 text-black'
                    }`}
                  >
                    {simulatedAdded ? '✓ Inclus' : `+ Inclure`}
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: POST-PURCHASE CONFIRMATION CARD */}
            {simulatorStage === 'purchase_completed' && (
              <div className="max-w-md mx-auto p-4 rounded-xl bg-[#131313] border border-amber-500/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Gift className="w-4 h-4" />
                  <span>Offre Exclusivité Post-Achat (Remerciement)</span>
                </div>
                <p className="text-[11px] text-[#aaa]">
                  Votre commande est enregistrée ! Profitez de l&apos;expédition de votre colis pour ajouter cette pièce à tarif privilégié :
                </p>

                <div className="p-3 bg-[#181818] border border-amber-500/30 rounded-lg flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded overflow-hidden bg-black shrink-0 border border-[#333]">
                    <img
                      src={effectiveTargetProduct.img || `https://picsum.photos/seed/${effectiveTargetProduct.seed}/150/180`}
                      alt={effectiveTargetProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-amber-400 truncate block">
                      {customBadge || 'Avantage Clientèle'}
                    </span>
                    <h5 className="text-xs font-semibold text-white truncate">
                      {effectiveTargetProduct.name}
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <span className="text-[#d4af37] font-bold">{targetDiscountedPrice} DH</span>
                      <span className="text-[10px] line-through text-[#777]">{targetOriginalPrice} DH</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedAdded(true);
                      setTimeout(() => setSimulatedAdded(false), 3000);
                    }}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase transition shrink-0 cursor-pointer ${
                      simulatedAdded ? 'bg-amber-400 text-black' : 'bg-[#d4af37] text-black hover:bg-[#e8c878]'
                    }`}
                  >
                    {simulatedAdded ? '✓ Ajouté' : `+ Ajouter`}
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Feedback Notification */}
            {simulatedAdded && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>✦ <strong>Test client réussi :</strong> Le bijou remisé a été ajouté au panier avec −{discountPct}% ! (Économie : {targetSavings} DH)</span>
                </div>
                <span className="text-[10px] text-emerald-400/80 font-mono">Simulation validée</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#888]">
            Aucun bijou disponible pour générer l&apos;aperçu.
          </div>
        )}
      </div>

      {/* RULES TABLE & MANAGEMENT LIST */}
      <div className="bg-[#141414] border border-[#282828] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#d4af37]" />
              <span>Règles Actives ({displayedRules.length})</span>
            </h3>
            <span className="text-xs text-[#888]">
              Gérez, suspendez ou modifiez chaque règle configurée
            </span>
          </div>

          {/* Sub-Filter Tabs: Type & Funnel Stage */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#1a1a1a] p-1 rounded-full border border-[#2e2e2e]">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#d4af37] text-black'
                    : 'text-[#cfcbc2] hover:text-white'
                }`}
              >
                Tous Types
              </button>
              <button
                type="button"
                onClick={() => setFilterType('cross_sell')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  filterType === 'cross_sell'
                    ? 'bg-emerald-500 text-black'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Cross-Sell</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('upsell')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  filterType === 'upsell'
                    ? 'bg-purple-500 text-white'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Upsell</span>
              </button>
            </div>

            <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-full border border-[#2e2e2e]">
              <button
                type="button"
                onClick={() => setFilterStage('all')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                  filterStage === 'all' ? 'bg-[#333] text-white' : 'text-[#888] hover:text-white'
                }`}
              >
                Toutes étapes
              </button>
              <button
                type="button"
                onClick={() => setFilterStage('product_page')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                  filterStage === 'product_page' ? 'bg-[#d4af37] text-black' : 'text-[#888] hover:text-white'
                }`}
              >
                Page Produit
              </button>
              <button
                type="button"
                onClick={() => setFilterStage('cart_add')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                  filterStage === 'cart_add' ? 'bg-emerald-500 text-black' : 'text-[#888] hover:text-white'
                }`}
              >
                Panier
              </button>
              <button
                type="button"
                onClick={() => setFilterStage('checkout_start')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                  filterStage === 'checkout_start' ? 'bg-sky-500 text-black' : 'text-[#888] hover:text-white'
                }`}
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={() => setFilterStage('purchase_completed')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                  filterStage === 'purchase_completed' ? 'bg-amber-500 text-black' : 'text-[#888] hover:text-white'
                }`}
              >
                Post-Achat
              </button>
            </div>
          </div>
        </div>

        {displayedRules.length === 0 ? (
          <div className="p-8 text-center bg-[#171717] rounded-xl border border-[#2d2d2d] text-xs text-[#888]">
            Aucune règle trouvée avec ces filtres. Utilisez le formulaire ci-dessus pour ajouter votre offre !
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedRules.map((rule) => {
              const srcP = findProductBySku(rule.sourceSku, products);
              const tgtP = findProductBySku(rule.targetSku, products);
              const origPrice = tgtP?.price || 0;
              const discPrice = calculateDiscountedPrice(origPrice, rule.discountPct);

              return (
                <div
                  key={rule.id}
                  className={`p-4 sm:p-5 rounded-xl border transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    rule.active
                      ? rule.type === 'cross_sell'
                        ? 'bg-[#161616] border-emerald-900/40 hover:border-emerald-700/60'
                        : 'bg-[#161616] border-purple-900/40 hover:border-purple-700/60'
                      : 'bg-[#121212] border-[#252525] opacity-60'
                  }`}
                >
                  {/* Left: Type badge + Stage badge + Source ➔ Target with vignettes */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 flex-1">
                    {/* Badges Column */}
                    <div className="flex flex-col sm:items-start gap-1 shrink-0">
                      {rule.type === 'cross_sell' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <Layers className="w-3 h-3" />
                          <span>Cross-Sell</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          <Zap className="w-3 h-3" />
                          <span>Upsell</span>
                        </span>
                      )}

                      {/* Interactive Display Stage Selector */}
                      <div className="flex items-center gap-1">
                        <select
                          value={rule.displayStage || 'product_page'}
                          onChange={(e) =>
                            handleQuickChangeStage(
                              rule.id,
                              e.target.value as PromotionDisplayStage
                            )
                          }
                          className="text-[10px] uppercase font-semibold px-2 py-1 rounded bg-[#1c1c1c] text-[#d4af37] border border-[#3a3a3a] hover:border-[#d4af37] focus:outline-none cursor-pointer"
                          title="Modifier directement l'étape du parcours client"
                        >
                          <option value="product_page">✦ 1. Fiche Produit</option>
                          <option value="cart_add">✦ 2. Tiroir Panier</option>
                          <option value="checkout_start">✦ 3. Checkout</option>
                          <option value="purchase_completed">✦ 4. Post-Achat</option>
                        </select>
                      </div>
                    </div>

                    {/* Source Product Vignette */}
                    <div className="flex items-center gap-2.5 bg-[#1a1a1a] border border-[#2c2c2c] rounded-lg p-2 min-w-[180px]">
                      <div className="w-10 h-12 rounded overflow-hidden bg-[#111] shrink-0">
                        <img
                          src={srcP?.img || `https://picsum.photos/seed/${srcP?.seed || 'source'}/150/180`}
                          alt={srcP?.name || rule.sourceSku}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-[#d4af37] block">
                          SKU : {rule.sourceSku}
                        </span>
                        <span className="text-xs font-semibold text-white truncate block">
                          {srcP?.name || 'Produit Source'}
                        </span>
                        <span className="text-[10px] text-[#888]">
                          {srcP ? `${srcP.price} DH` : '—'}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#d4af37] shrink-0 hidden sm:block" />

                    {/* Target Product Vignette with Discount badge */}
                    <div className="flex items-center gap-2.5 bg-[#1a1a1a] border border-[#d4af37]/40 rounded-lg p-2 min-w-[220px]">
                      <div className="w-10 h-12 rounded overflow-hidden bg-[#111] shrink-0 border border-[#d4af37]/30">
                        <img
                          src={tgtP?.img || `https://picsum.photos/seed/${tgtP?.seed || 'target'}/150/180`}
                          alt={tgtP?.name || rule.targetSku}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-[#d4af37]">
                            SKU : {rule.targetSku}
                          </span>
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                            −{rule.discountPct}%
                          </span>
                        </div>
                        <span className="text-xs font-serif font-bold text-white truncate block mt-0.5">
                          {tgtP?.name || 'Bijou Recommandé'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="line-through text-[#888]">{origPrice} DH</span>
                          <span className="text-[#d4af37] font-bold">{discPrice} DH</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Accroche + Switch + Edit/Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#222]">
                    <div className="text-right hidden xl:block mr-2">
                      <span className="text-xs text-white font-medium block truncate max-w-[200px]">
                        « {rule.customTitle} »
                      </span>
                      <span className="text-[10px] text-[#888] block">
                        Badge : {rule.customBadge}
                      </span>
                    </div>

                    {/* Preview button */}
                    <button
                      type="button"
                      onClick={() => handlePreviewRule(rule)}
                      className="p-2 rounded-lg bg-[#222] hover:bg-[#d4af37]/20 text-[#cfcbc2] hover:text-[#d4af37] border border-transparent hover:border-[#d4af37]/40 transition cursor-pointer flex items-center gap-1.5"
                      title="Visualiser dans l'aperçu en direct"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium hidden sm:inline">Aperçu</span>
                    </button>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleRule(rule.id)}
                      className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${
                        rule.active ? 'bg-emerald-500' : 'bg-[#333]'
                      }`}
                      title={rule.active ? 'Désactiver' : 'Activer'}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          rule.active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleEditRule(rule)}
                      className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-[#cfcbc2] hover:text-white transition cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 rounded-lg bg-[#222] hover:bg-red-950/60 text-[#888] hover:text-red-400 transition cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Product Catalog Picker Modal */}
      {pickerTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#333] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-[#242424] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                <h4 className="text-sm font-serif font-bold text-white">
                  {pickerTarget === 'source'
                    ? 'Choisir le Bijou Déclencheur (Source)'
                    : 'Choisir le Bijou Recommandé (Cible)'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPickerTarget(null)}
                className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-[#aaa] hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b border-[#242424] bg-[#181818]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Rechercher par nom, catégorie, ou SKU..."
                  className="w-full bg-[#111] border border-[#333] focus:border-[#d4af37] rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {pickerTarget === 'source' && (
                <button
                  type="button"
                  onClick={() => {
                    setSourceSkuInput('*');
                    setPickerTarget(null);
                  }}
                  className="p-3 rounded-xl border border-dashed border-[#d4af37]/50 hover:border-[#d4af37] bg-[#1a1a1a] hover:bg-[#202020] text-left transition flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-12 h-14 rounded bg-[#d4af37]/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">✦ Tous les bijoux (*)</span>
                    <span className="text-[10px] text-[#888] block">Règle globale sur l&apos;ensemble du catalogue</span>
                  </div>
                </button>
              )}

              {products
                .filter((p) => {
                  if (!pickerSearch.trim()) return true;
                  const q = pickerSearch.toLowerCase();
                  return (
                    p.name.toLowerCase().includes(q) ||
                    p.cat.toLowerCase().includes(q) ||
                    getProductSku(p).toLowerCase().includes(q)
                  );
                })
                .map((p) => {
                  const sku = getProductSku(p);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (pickerTarget === 'source') {
                          setSourceSkuInput(sku);
                        } else {
                          setTargetSkuInput(sku);
                          if (formType === 'cross_sell') {
                            setCustomTitle(`Complétez votre parure avec : ${p.name}`);
                          }
                        }
                        setPickerTarget(null);
                      }}
                      className="p-2.5 rounded-xl border border-[#2a2a2a] hover:border-[#d4af37] bg-[#181818] hover:bg-[#202020] text-left transition flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-[#333] group-hover:border-[#d4af37]/50 transition">
                        <img
                          src={p.img || `https://picsum.photos/seed/${p.seed}/150/180`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-mono text-[#d4af37] uppercase block truncate">
                          {sku}
                        </span>
                        <h5 className="text-xs font-serif font-bold text-white truncate">
                          {p.name}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-[#888] mt-0.5">
                          <span>{p.cat}</span>
                          <span>•</span>
                          <span className="text-white font-semibold">{p.price} DH</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
