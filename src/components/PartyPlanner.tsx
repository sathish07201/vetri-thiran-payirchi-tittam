import React, { useState } from 'react';
import {
  PartyPopper,
  Users,
  Utensils,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  Building,
  Music,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  BedDouble,
  Lightbulb
} from 'lucide-react';
import { Currency, PartyPlanResponse, PartyRecommendation, CartItem } from '../types';
import { formatCurrency, getPlatformSearchUrl, getPlatformBadgeStyle } from '../utils/formatters';

interface PartyPlannerProps {
  currency: Currency;
  onAddToCart: (item: CartItem) => void;
  isInCart: (id: string) => boolean;
}

export const PartyPlanner: React.FC<PartyPlannerProps> = ({
  currency,
  onAddToCart,
  isInCart
}) => {
  const [budget, setBudget] = useState<number>(35000);
  const [guestCount, setGuestCount] = useState<number>(30);
  const [eventType, setEventType] = useState<string>('Birthday');
  const [venueType, setVenueType] = useState<string>('Home / Apartment');
  const [dietary, setDietary] = useState<string>('Mixed Gourmet Buffet');
  const [needsAccommodation, setNeedsAccommodation] = useState<boolean>(false);
  const [selectedEntertainment, setSelectedEntertainment] = useState<string[]>([
    'Karaoke & Party Speaker',
    'Photobooth Props'
  ]);

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PartyPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventTypes = [
    'Birthday',
    'Corporate Mixer',
    'Wedding Sangeet / Reception',
    'Housewarming Celebration',
    'Anniversary',
    'Casual Weekend Party'
  ];

  const venueOptions = [
    'Home / Apartment',
    'Indoor Banquet Hall',
    'Lawn / Outdoor Garden',
    'Rooftop Lounge',
    'OYO Townhouse / Stay'
  ];

  const entertainmentOptions = [
    'Karaoke & Party Speaker',
    'Photobooth Props',
    'Party Games & Trivia',
    'DJ Sound System',
    'Magician / Performer'
  ];

  const budgetPresets = [
    { label: 'Intimate', amount: 15000, guests: 15 },
    { label: 'Popular', amount: 35000, guests: 30 },
    { label: 'Grand', amount: 75000, guests: 60 },
    { label: 'Extravagant', amount: 150000, guests: 100 }
  ];

  const toggleEntertainment = (ent: string) => {
    if (selectedEntertainment.includes(ent)) {
      if (selectedEntertainment.length > 1) {
        setSelectedEntertainment(selectedEntertainment.filter((e) => e !== ent));
      }
    } else {
      setSelectedEntertainment([...selectedEntertainment, ent]);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recommendations/party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          currency,
          eventType,
          guestCount,
          venueType,
          dietary,
          needsAccommodation,
          entertainmentPreferences: selectedEntertainment
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate party plan');
      }

      const data: PartyPlanResponse = await res.json();
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not generate party plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!plan && !loading) {
      handleGeneratePlan();
    }
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Scenario Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                Scenario 2
              </span>
              <span className="text-xs text-slate-500">Swiggy · Zomato · Amazon · OYO</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI-Based Party Budget Planning & Vendor Sourcing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Specify your budget, guest count, and venue requirements. The AI distributes funds across catering (Swiggy/Zomato), decorations (Amazon/Flipkart), entertainment, and guest accommodation (OYO).
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
                <span>Re-plan Event Budget</span>
              </>
            )}
          </button>
        </div>

        {/* Input Controls Form */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Budget & Guests */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Total Event Budget
                </label>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCurrency(budget, currency)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={300000}
                step={2500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-2 accent-orange-600 cursor-pointer"
              />

              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {budgetPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setBudget(p.amount);
                      setGuestCount(p.guests);
                    }}
                    className={`py-1 text-[11px] font-medium rounded border transition-colors ${
                      budget === p.amount
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Guest Count
                </label>
                <span className="text-sm font-bold text-slate-900">{guestCount} Guests</span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full mt-2 accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5 guests</span>
                <span>Avg: {formatCurrency(Math.round(budget / Math.max(1, guestCount)), currency)} / person</span>
                <span>150 guests</span>
              </div>
            </div>

            {/* Accommodation Toggle */}
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-lg p-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needsAccommodation}
                  onChange={(e) => setNeedsAccommodation(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-rose-600" />
                    Include OYO Guest Stay / Rooms
                  </p>
                  <p className="text-[10px] text-rose-800">
                    Allocates accommodation budget for out-of-town guests
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Event Type & Venue & Entertainment */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Occasion / Event Type
              </label>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((type) => {
                  const isSelected = eventType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Venue & Dietary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Venue Type
                </label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {venueOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Food & Beverage Style
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Mixed Gourmet Buffet">Mixed Gourmet Buffet (Veg & Non-Veg)</option>
                  <option value="Pure Vegetarian Celebration">Pure Vegetarian Celebration Spread</option>
                  <option value="Finger Foods & Craft Mocktails">Finger Foods & Craft Mocktails</option>
                  <option value="High Tea & Dessert Spread">High Tea & Dessert Platter</option>
                </select>
              </div>
            </div>

            {/* Entertainment Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Entertainment & Activities
              </label>
              <div className="flex flex-wrap gap-2">
                {entertainmentOptions.map((ent) => {
                  const isSelected = selectedEntertainment.includes(ent);
                  return (
                    <button
                      key={ent}
                      type="button"
                      onClick={() => toggleEntertainment(ent)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ent}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Results */}
      {plan && (
        <div className="space-y-6">
          {/* Header Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs text-slate-500 font-medium">Per-Guest Cost</span>
              <p className="text-2xl font-extrabold text-orange-600 mt-1">
                {formatCurrency(plan.perPersonCost, currency)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Calculated for {guestCount} guests</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs text-slate-500 font-medium">Estimated Total</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(plan.totalEstimatedCost, currency)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">All 4 categories inclusive</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs text-slate-500 font-medium">Safety Savings Buffer</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {formatCurrency(plan.savings, currency)}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Reserved for unexpected items</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs text-slate-500 font-medium">Catering Platform</span>
              <p className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                Swiggy & Zomato
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Bulk discount meal boxes</p>
            </div>
          </div>

          {/* Allocation Breakdown Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Budget Allocation by Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-orange-50/70 border border-orange-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-orange-950">Food & Catering</p>
                <p className="text-base font-bold text-orange-700 mt-0.5">
                  {formatCurrency(plan.budgetDistribution.catering.amount, currency)}
                </p>
                <p className="text-[10px] text-orange-600">{plan.budgetDistribution.catering.percentage}% · Swiggy/Zomato</p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-amber-950">Decor & Lighting</p>
                <p className="text-base font-bold text-amber-700 mt-0.5">
                  {formatCurrency(plan.budgetDistribution.decoration.amount, currency)}
                </p>
                <p className="text-[10px] text-amber-600">{plan.budgetDistribution.decoration.percentage}% · Amazon</p>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-950">Music & Sound</p>
                <p className="text-base font-bold text-blue-700 mt-0.5">
                  {formatCurrency(plan.budgetDistribution.entertainment.amount, currency)}
                </p>
                <p className="text-[10px] text-blue-600">{plan.budgetDistribution.entertainment.percentage}% · Amazon/Local</p>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-rose-950">Venue & Stay</p>
                <p className="text-base font-bold text-rose-700 mt-0.5">
                  {formatCurrency(plan.budgetDistribution.venueAccommodation.amount, currency)}
                </p>
                <p className="text-[10px] text-rose-600">{plan.budgetDistribution.venueAccommodation.percentage}% · {plan.budgetDistribution.venueAccommodation.platform}</p>
              </div>
            </div>
          </div>

          {/* Sourced Recommendations across Swiggy, Zomato, Amazon, OYO */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Curated Vendor Picks ({plan.recommendations.length} Recommendations)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.recommendations.map((rec) => {
                const badgeStyle = getPlatformBadgeStyle(rec.platform);
                const searchUrl = getPlatformSearchUrl(rec.platform, rec.searchQuery || rec.title);
                const inCart = isInCart(rec.id);

                return (
                  <div
                    key={rec.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img
                          src={rec.imageUrl}
                          alt={rec.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-bold shadow-xs border ${badgeStyle.bg} ${badgeStyle.border}`}
                          >
                            {rec.platform}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-xs">
                          ⭐ {rec.rating}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="text-[11px] text-slate-500 font-medium">
                          {rec.category} · {rec.vendor}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                          {rec.title}
                        </h4>

                        <div className="flex items-baseline justify-between pt-1">
                          <p className="text-lg font-extrabold text-slate-900">
                            {formatCurrency(rec.unitPrice, currency)}
                          </p>
                          <span className="text-[10px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded font-medium">
                            Bulk Partner Rate
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {rec.details}
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{rec.keyBenefit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Order on {rec.platform}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          onAddToCart({
                            id: rec.id,
                            name: rec.title,
                            category: rec.category,
                            platform: rec.platform,
                            price: rec.unitPrice,
                            quantity: 1,
                            scenario: 'party',
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
          </div>

          {/* Timeline Schedule & Cost-Saving Hacks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Event Day Timeline Schedule</span>
              </div>
              <div className="space-y-2.5">
                {plan.timelineSchedule.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded shrink-0">
                      {item.time}
                    </span>
                    <span className="text-slate-700">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Party Cost-Saving Hacks & Insider Tips</span>
              </div>
              <ul className="space-y-2 text-xs text-amber-950/80">
                {plan.costSavingHacks.map((hack, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">0{idx + 1}.</span>
                    <span>{hack}</span>
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
