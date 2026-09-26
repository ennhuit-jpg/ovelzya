'use client';

import React, { useState, useMemo } from 'react';
import { Order, Product } from '@/lib/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  ArrowUpRight,
  Sparkles,
  Award,
  Layers,
  Percent,
} from 'lucide-react';

interface AdminBusinessDashboardProps {
  orders: Order[];
  products: Product[];
}

export default function AdminBusinessDashboard({ orders, products }: AdminBusinessDashboardProps) {
  const [timeRange, setTimeRange] = useState<'30' | '14' | '7'>('30');

  // Filter orders by selected day range
  const daysCount = parseInt(timeRange, 10);
  const cutoffTime = useMemo(() => {
    return Date.now() - daysCount * 24 * 60 * 60 * 1000;
  }, [daysCount]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const orderTime = new Date(o.date).getTime();
      return orderTime >= cutoffTime;
    });
  }, [orders, cutoffTime]);

  // Key KPI calculations
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [filteredOrders]);

  const orderVolume = filteredOrders.length;

  const totalUnitsSold = useMemo(() => {
    return filteredOrders.reduce((acc, o) => {
      const itemsCount = o.items ? o.items.reduce((s, it) => s + (it.qty || 1), 0) : 0;
      return acc + itemsCount;
    }, 0);
  }, [filteredOrders]);

  const averageOrderValue = useMemo(() => {
    return orderVolume > 0 ? Math.round(totalRevenue / orderVolume) : 0;
  }, [totalRevenue, orderVolume]);

  const deliveredOrdersCount = useMemo(() => {
    return filteredOrders.filter((o) => o.status === 'livree').length;
  }, [filteredOrders]);

  const deliveryRate = useMemo(() => {
    return orderVolume > 0 ? Math.round((deliveredOrdersCount / orderVolume) * 100) : 100;
  }, [deliveredOrdersCount, orderVolume]);

  // Daily revenue & orders timeline for Area / Bar chart
  const timelineData = useMemo(() => {
    // Generate dates map for the past X days
    const daysMap: Record<string, { dateStr: string; label: string; revenue: number; orders: number; units: number }> = {};
    const now = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      daysMap[key] = { dateStr: key, label, revenue: 0, orders: 0, units: 0 };
    }

    // Populate with actual order data
    filteredOrders.forEach((o) => {
      const key = new Date(o.date).toISOString().slice(0, 10);
      if (daysMap[key]) {
        daysMap[key].revenue += o.total || 0;
        daysMap[key].orders += 1;
        const count = o.items ? o.items.reduce((sum, it) => sum + (it.qty || 1), 0) : 1;
        daysMap[key].units += count;
      }
    });

    return Object.values(daysMap);
  }, [filteredOrders, daysCount]);

  // Top-selling products calculation over the chosen period
  const topSellingProducts = useMemo(() => {
    const productStats: Record<
      string,
      {
        id: number;
        sku: string;
        name: string;
        unitsSold: number;
        revenue: number;
        category: string;
        currentStock: number;
        img: string;
        seed: string;
      }
    > = {};

    filteredOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.id || (p.sku && item.sku && p.sku === item.sku));
        const key = String(item.id || (prod ? prod.id : item.name));
        const qty = item.qty || 1;
        const price = item.price || (prod ? prod.price : 0);
        const itemRev = price * qty;

        if (!productStats[key]) {
          productStats[key] = {
            id: prod ? prod.id : item.id,
            sku: (prod && prod.sku) || item.sku || `MD-${String(item.id).padStart(3, '0')}`,
            name: (prod && prod.name) || item.name || 'Pièce de Joaillerie',
            unitsSold: 0,
            revenue: 0,
            category: (prod && prod.cat) || 'Bijoux',
            currentStock: prod && prod.stock !== undefined ? prod.stock : 10,
            img: (prod && prod.img) || '',
            seed: (prod && prod.seed) || 'bijou-or',
          };
        }

        productStats[key].unitsSold += qty;
        productStats[key].revenue += itemRev;
      });
    });

    return Object.values(productStats).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products]);

  // Payment methods breakdown for Donut chart
  const paymentMethodsData = useMemo(() => {
    const methods: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const raw = o.payMethod || 'Paiement à la livraison';
      const clean = raw.includes('livraison')
        ? 'Cash à la livraison'
        : raw.includes('Carte') || raw.includes('CMI')
        ? 'Carte Bancaire CMI'
        : raw.includes('Apple')
        ? 'Apple Pay'
        : raw;
      methods[clean] = (methods[clean] || 0) + 1;
    });

    const colors = ['#d4af37', '#10b981', '#a855f7', '#3b82f6', '#f59e0b'];
    return Object.entries(methods).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length],
    }));
  }, [filteredOrders]);

  // Order status breakdown for mini stats
  const statusData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      en_attente: 0,
      en_cours: 0,
      expediee: 0,
      livree: 0,
      annulee: 0,
    };
    filteredOrders.forEach((o) => {
      const st = o.status || 'en_attente';
      if (statusCounts[st] !== undefined) {
        statusCounts[st] += 1;
      }
    });
    return statusCounts;
  }, [filteredOrders]);

  // Top 5 products formatted for Horizontal BarChart
  const topProductsChartData = useMemo(() => {
    return topSellingProducts.slice(0, 5).map((p) => ({
      name: p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name,
      fullName: p.name,
      revenue: p.revenue,
      units: p.unitsSold,
      sku: p.sku,
    }));
  }, [topSellingProducts]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Performance Commerciale</span>
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#d4af37]/15 text-[#e8c878] border border-[#d4af37]/30">
              Live Recharts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white mt-1 font-bold">
            Tableau de Bord &amp; Métriques Clés
          </h1>
          <p className="text-xs sm:text-sm text-[#9a958a] mt-1">
            Analyse du chiffre d&apos;affaires, volume de ventes et top des créations sur les 30 derniers jours.
          </p>
        </div>

        {/* Time Selector Buttons */}
        <div className="flex items-center gap-1 bg-[#141414] p-1.5 rounded-xl border border-[#2a2a2a] self-start sm:self-center">
          <button
            type="button"
            onClick={() => setTimeRange('7')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              timeRange === '7' ? 'bg-[#d4af37] text-black shadow' : 'text-[#888] hover:text-white'
            }`}
          >
            7 Jours
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('14')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              timeRange === '14' ? 'bg-[#d4af37] text-black shadow' : 'text-[#888] hover:text-white'
            }`}
          >
            14 Jours
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              timeRange === '30' ? 'bg-[#d4af37] text-black shadow' : 'text-[#888] hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>30 Derniers Jours</span>
          </button>
        </div>
      </div>

      {/* 4 Major KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="p-5 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-b from-[#181816] to-[#121212] relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#9a958a] font-semibold">
              Chiffre d&apos;Affaires
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-[#e8c878] mt-3 font-bold">
            {totalRevenue.toLocaleString('fr-FR')} <span className="text-sm font-sans font-normal text-[#cfcbc2]">DH</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Sur les {daysCount} derniers jours</span>
          </div>
        </div>

        {/* Metric 2: Order Volume */}
        <div className="p-5 rounded-2xl border border-[#2a2a2a] bg-[#141414] hover:border-[#d4af37]/40 transition relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#9a958a] font-semibold">
              Volume de Commandes
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white mt-3 font-bold">
            {orderVolume}{' '}
            <span className="text-xs font-sans font-normal text-[#888]">
              commande{orderVolume > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#cfcbc2]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{deliveryRate}% livrées avec succès</span>
          </div>
        </div>

        {/* Metric 3: Total Units Sold */}
        <div className="p-5 rounded-2xl border border-[#2a2a2a] bg-[#141414] hover:border-[#d4af37]/40 transition relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#9a958a] font-semibold">
              Articles Vendus
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white mt-3 font-bold">
            {totalUnitsSold}{' '}
            <span className="text-xs font-sans font-normal text-[#888]">
              pièce{totalUnitsSold > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#9a958a]">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Catalogue 18K &amp; 316L</span>
          </div>
        </div>

        {/* Metric 4: Average Order Value (Panier Moyen) */}
        <div className="p-5 rounded-2xl border border-[#2a2a2a] bg-[#141414] hover:border-[#d4af37]/40 transition relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#9a958a] font-semibold">
              Panier Moyen (AOV)
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-white mt-3 font-bold">
            {averageOrderValue.toLocaleString('fr-FR')}{' '}
            <span className="text-sm font-sans font-normal text-[#cfcbc2]">DH</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-amber-400">
            <Award className="w-3.5 h-3.5" />
            <span>Panier joaillerie haut de gamme</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: AreaChart (Revenue Evolution) + Donut (Payment Methods) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & Orders Timeline */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-[#2a2a2a] bg-[#121212] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                <span>Évolution du Chiffre d&apos;Affaires Quotidien</span>
              </h3>
              <p className="text-xs text-[#888]">
                Recettes journalières enregistrées en Dirhams marocains (DH)
              </p>
            </div>
            <span className="text-xs font-mono text-[#d4af37] bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#2e2e2e] self-start sm:self-auto">
              Total : {totalRevenue.toLocaleString('fr-FR')} DH
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#666"
                  tick={{ fill: '#888', fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: '#888', fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(val) => `${val} DH`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-[#181818] border border-[#d4af37]/40 rounded-xl shadow-2xl text-xs space-y-1">
                          <p className="font-bold text-white font-serif">{label}</p>
                          <p className="text-[#d4af37] font-semibold">
                            CA : {Number(data.revenue).toLocaleString('fr-FR')} DH
                          </p>
                          <p className="text-[#aaa]">
                            Commandes : <span className="text-white font-medium">{data.orders}</span>
                          </p>
                          <p className="text-[#aaa]">
                            Articles : <span className="text-white font-medium">{data.units}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d4af37"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Payment Methods Donut */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#2a2a2a] bg-[#121212] flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-serif font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span>Modes de Paiement</span>
            </h3>
            <p className="text-xs text-[#888]">
              Répartition des commandes enregistrées
            </p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#121212" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="p-2.5 bg-[#181818] border border-[#333] rounded-lg text-xs shadow-xl">
                          <p className="font-semibold text-white">{data.name}</p>
                          <p className="text-[#d4af37]">{data.value} commande(s)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-serif font-bold text-white">{orderVolume}</span>
              <span className="text-[10px] text-[#888] uppercase tracking-wider">Total</span>
            </div>
          </div>

          {/* Legend list */}
          <div className="space-y-2 pt-2 border-t border-[#222]">
            {paymentMethodsData.map((it) => (
              <div key={it.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: it.color }} />
                  <span className="text-[#cfcbc2]">{it.name}</span>
                </div>
                <span className="font-mono text-white font-semibold">{it.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products Section (Horizontal Bar Chart & Table) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-serif font-bold text-white text-lg sm:text-xl">
                Top des Ventes ({daysCount} Derniers Jours)
              </h3>
            </div>
            <p className="text-xs text-[#888]">
              Classement des bijoux les plus commandés et chiffres d&apos;affaires générés
            </p>
          </div>
          <span className="text-xs text-[#888]">
            {topSellingProducts.length} pièces ayant généré des ventes
          </span>
        </div>

        {/* Top Products Bar Chart */}
        {topProductsChartData.length > 0 && (
          <div className="p-5 sm:p-6 rounded-2xl border border-[#2a2a2a] bg-[#121212] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#cfcbc2]">
              Revenu par Produit Phare (Top 5)
            </h4>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductsChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#666"
                    tick={{ fill: '#888', fontSize: 11 }}
                    tickFormatter={(v) => `${v} DH`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#666"
                    tick={{ fill: '#cfcbc2', fontSize: 11 }}
                    width={130}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#181818] border border-[#d4af37]/40 rounded-xl text-xs space-y-1 shadow-2xl">
                            <p className="font-serif font-bold text-white">{d.fullName}</p>
                            <p className="text-[11px] font-mono text-[#d4af37]">SKU : {d.sku}</p>
                            <p className="text-emerald-400 font-semibold">
                              Chiffre d&apos;affaires : {d.revenue.toLocaleString('fr-FR')} DH
                            </p>
                            <p className="text-[#aaa]">
                              Quantité vendue : <span className="text-white font-medium">{d.units} pièce(s)</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" fill="#d4af37" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detailed Products Table */}
        <div className="border border-[#2a2a2a] rounded-2xl overflow-hidden bg-[#121212]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] text-[#9a958a] uppercase tracking-wider text-[10px] border-b border-[#262626]">
                <tr>
                  <th className="py-3 px-4">Rang</th>
                  <th className="py-3 px-4">Bijou</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4 text-center">Unités Vendues</th>
                  <th className="py-3 px-4 text-right">Chiffre d&apos;Affaires</th>
                  <th className="py-3 px-4 text-center">Stock Restant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {topSellingProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#888]">
                      Aucune vente enregistrée sur cette période.
                    </td>
                  </tr>
                ) : (
                  topSellingProducts.map((prod, idx) => (
                    <tr key={prod.sku} className="hover:bg-[#161616] transition">
                      <td className="py-3 px-4 font-bold">
                        {idx === 0 ? (
                          <span className="w-6 h-6 rounded-full bg-[#d4af37] text-black inline-flex items-center justify-center font-bold text-xs shadow-md">
                            1
                          </span>
                        ) : idx === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-neutral-300 text-black inline-flex items-center justify-center font-bold text-xs">
                            2
                          </span>
                        ) : idx === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-700 text-white inline-flex items-center justify-center font-bold text-xs">
                            3
                          </span>
                        ) : (
                          <span className="text-[#888] font-mono pl-1.5">{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded bg-[#181818] overflow-hidden shrink-0 border border-[#2a2a2a]">
                            <img
                              src={prod.img || `https://picsum.photos/seed/${prod.seed}/150/180`}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-serif font-bold text-white block text-xs">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-[#888]">Plaqué Or 18K · Acier 316L</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#d4af37] font-semibold text-[11px]">
                        {prod.sku}
                      </td>
                      <td className="py-3 px-4 text-[#cfcbc2]">{prod.category}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded bg-[#202020] text-white font-bold font-mono">
                          {prod.unitsSold}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-serif font-bold text-[#e8c878] text-sm">
                        {prod.revenue.toLocaleString('fr-FR')} DH
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            prod.currentStock <= 3
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : prod.currentStock <= 8
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {prod.currentStock} en stock
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Status Distribution Quick Stats */}
      <div className="p-5 rounded-2xl border border-[#2a2a2a] bg-[#121212] space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#cfcbc2] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#d4af37]" />
          <span>Statut Opérationnel des Commandes</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-[#181818] border border-[#262626] text-center">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
              En Attente
            </span>
            <span className="text-xl font-serif font-bold text-white mt-1 block">
              {statusData.en_attente}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#181818] border border-[#262626] text-center">
            <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold block">
              En Cours
            </span>
            <span className="text-xl font-serif font-bold text-white mt-1 block">
              {statusData.en_cours}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#181818] border border-[#262626] text-center">
            <span className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold block">
              Expédiée
            </span>
            <span className="text-xl font-serif font-bold text-white mt-1 block">
              {statusData.expediee}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#181818] border border-[#262626] text-center">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">
              Livrée
            </span>
            <span className="text-xl font-serif font-bold text-white mt-1 block">
              {statusData.livree}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#181818] border border-[#262626] text-center">
            <span className="text-[10px] uppercase tracking-wider text-red-400 font-semibold block">
              Annulée
            </span>
            <span className="text-xl font-serif font-bold text-white mt-1 block">
              {statusData.annulee}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
