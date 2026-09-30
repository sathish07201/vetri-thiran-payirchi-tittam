import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  Plus,
  Minus,
  ExternalLink,
  ShoppingBag,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  Info,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { Currency, HomePlanResponse, HomePlanRecommendation, CartItem } from '../types';
import { formatCurrency, getPlatformSearchUrl, getPlatformBadgeStyle } from '../utils/formatters';

interface HomePlannerProps {
  currency: Currency;
  onAddToCart: (item: CartItem) => void;
  isInCart: (id: string) => boolean;
}

export const HomePlanner: React.FC<HomePlannerProps> = ({
  currency,
  onAddToCart,
  isInCart
}) => {
  // Budget state
  const [budget, setBudget] = useState<number>(60000);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['Living Room', 'Bedroom']);
  const [style, setStyle] = useState<string>('Modern Minimalist');
  const [priority, setPriority] = useState<string>('Balanced Value');

  // Quantities for items
  const [quantities, setQuantities] = useState<Record<string, number>>({
    lights: 4,
    fans: 2,
    diningTable: 1,
    sofa: 1,
    storage: 2,
    rug: 1
  });

  // State for AI generated plan
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<HomePlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active Category Filter for results
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Pre-configured room options
  const roomOptions = [
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Kitchen',
    'Home Office / Study',
    'Balcony & Patio'
  ];

  const styleOptions = [
    'Modern Minimalist',
    'Scandinavian Chic (IKEA aesthetic)',
    'Bohemian Warmth',
    'Industrial & Modern Wood',
    'Traditional Indian Heritage'
  ];

  const budgetPresets = [
    { label: 'Starter', amount: 35000 },
    { label: 'Popular', amount: 60000 },
    { label: 'Executive', amount: 120000 },
    { label: 'Luxury', amount: 250000 }
  ];

  const toggleRoom = (room: string) => {
    if (selectedRooms.includes(room)) {
      if (selectedRooms.length > 1) {
        setSelectedRooms(selectedRooms.filter((r) => r !== room));
      }
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const updateQuantity = (key: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, Math.min(10, current + delta));
      return { ...prev, [key]: next };
    });
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recommendations/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          currency,
          rooms: selectedRooms,
          roomItems: quantities,
          style,
          priorities: priority
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate plan');
      }

      const data: HomePlanResponse = await res.json();
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not complete recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate on first visit if not yet generated
  React.useEffect(() => {
    if (!plan && !loading) {
      handleGeneratePlan();
    }
  }, []);

  const filteredRecommendations = plan?.recommendations.filter((item) => {
    if (activeCategoryFilter === 'all') return true;
    return item.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());
  }) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Scenario Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Scenario 1
              </span>
              <span className="text-xs text-slate-500">IKEA · Amazon · Flipkart · Pepperfry</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Home Interior Planning with Smart Budget Allocation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Specify your budget, room selections, and quantities for essential furniture, lights, and fans. PocketSmart AI calculates optimal allocations and pulls curated picks across platforms without overspending.
            </p>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-xs"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Optimizing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Re-calculate Interior Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Configuration Form Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Budget input column */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Total Home Budget
                </label>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCurrency(budget, currency)}
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={15000}
                max={500000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-2 accent-slate-900 cursor-pointer"
              />

              {/* Preset quick buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {budgetPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setBudget(p.amount)}
                    className={`py-1 text-[11px] font-medium rounded border transition-colors ${
                      budget === p.amount
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interior Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Design Aesthetic
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {styleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Budget Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Maximum Savings', 'Balanced Value', 'Durability First'].map((pri) => (
                  <button
                    key={pri}
                    type="button"
                    onClick={() => setPriority(pri)}
                    className={`py-1.5 px-2 text-[10px] font-medium rounded border text-center transition-colors ${
                      priority === pri
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms and Item Quantities */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Rooms
              </label>
              <div className="flex flex-wrap gap-2">
                {roomOptions.map((room) => {
                  const isSelected = selectedRooms.includes(room);
                  return (
                    <button
                      key={room}
                      type="button"
                      onClick={() => toggleRoom(room)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {room}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantities Matrix */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Requirements & Quantities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'lights', label: 'Ceiling / Spot Lights', unit: 'pcs' },
                  { key: 'fans', label: 'BLDC Ceiling Fans', unit: 'fans' },
                  { key: 'diningTable', label: 'Dining Table Set', unit: 'set' },
                  { key: 'sofa', label: 'Living Room Sofa', unit: 'unit' },
                  { key: 'storage', label: 'Storage / TV Rack', unit: 'units' },
                  { key: 'rug', label: 'Area Rug / Carpets', unit: 'rugs' }
                ].map((item) => (
                  <div
                    key={item.key}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-500">
                        {quantities[item.key] || 0} {item.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, -1)}
                        className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-900">
                        {quantities[item.key] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, 1)}
                        className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Results Section */}
      {plan && (
        <div className="space-y-6">
          {/* Budget Burn-Down Summary Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  AI Allocation Summary
                </span>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {plan.summary}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Total Estimated</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(plan.totalEstimatedCost, currency)}
                  </p>
                </div>
                <div className="text-right pl-4 border-l border-slate-700">
                  <p className="text-[11px] text-emerald-400">Buffer / Savings</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {formatCurrency(plan.savingsOrBuffer, currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Burn-down meter */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>Budget Utilization ({plan.budgetUtilizationPercentage}%)</span>
                <span>
                  Target: {formatCurrency(budget, currency)} · Remaining:{' '}
                  {formatCurrency(Math.max(0, budget - plan.totalEstimatedCost), currency)}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, plan.budgetUtilizationPercentage)}%` }}
                />
              </div>
            </div>

            {/* Category breakdown bar pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {plan.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
                  <p className="text-[11px] text-slate-400 truncate">{cat.category}</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {formatCurrency(cat.allocatedAmount, currency)}
                  </p>
                  <p className="text-[10px] text-amber-300 mt-0.5">{cat.percentage}% of budget</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Category Filter buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Recommendations ({plan.recommendations.length})
              </button>
              {['Lighting', 'Furniture', 'Dining', 'Storage', 'Decor'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeCategoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              Showing {filteredRecommendations.length} verified products
            </span>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((item) => {
              const platformStyle = getPlatformBadgeStyle(item.platform);
              const searchUrl = getPlatformSearchUrl(item.platform, item.searchQuery || item.name);
              const inCart = isInCart(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image Header with Platform Pill */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-bold shadow-xs border ${platformStyle.bg} ${platformStyle.border}`}
                        >
                          {item.platform}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-xs">
                        ⭐ {item.rating} ({item.reviewsCount})
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                          <span>{item.category}</span>
                          <span>·</span>
                          <span>{item.room}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-xs text-slate-500">
                            Qty: {item.quantity} × {formatCurrency(item.unitPrice, currency)}
                          </span>
                          <p className="text-base font-extrabold text-slate-900">
                            {formatCurrency(item.totalPrice, currency)}
                          </p>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                          In Budget
                        </span>
                      </div>

                      {/* AI Reason */}
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                        <span className="font-semibold text-slate-800">Why AI picked this:</span>{' '}
                        {item.reason}
                      </p>

                      {/* Key features */}
                      {item.keyFeatures && (
                        <div className="space-y-1">
                          {item.keyFeatures.slice(0, 2).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions: Search / Deep link and Add to Cart */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      title={`Search on ${item.platform}`}
                    >
                      <span>Find on {item.platform}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart({
                          id: item.id,
                          name: item.name,
                          category: item.category,
                          platform: item.platform,
                          price: item.totalPrice,
                          quantity: item.quantity,
                          scenario: 'home',
                          searchUrl
                        })
                      }
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        inCart
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{inCart ? 'Saved' : 'Add to Plan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Smart Budget Advice & Alternatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Smart Budget Advice for Home Furnishing</span>
              </div>
              <ul className="space-y-2 text-xs text-amber-950/80">
                {plan.smartBudgetAdvice.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">0{idx + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Recommended Value Trade-offs</span>
              </div>
              <ul className="space-y-2 text-xs text-blue-950/80">
                {plan.alternativeSuggestions.map((alt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-blue-700 shrink-0">·</span>
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
