import React, { useState, useRef } from 'react';
import {
  Gem,
  Sparkles,
  Upload,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  Image as ImageIcon,
  Palette,
  Lightbulb,
  ShieldCheck,
  Eye,
  Camera
} from 'lucide-react';
import { Currency, JewelryPlanResponse, JewelryRecommendation, OutfitAnalysis, CartItem } from '../types';
import { formatCurrency, getPlatformSearchUrl, getPlatformBadgeStyle } from '../utils/formatters';

interface JewelryPlannerProps {
  currency: Currency;
  onAddToCart: (item: CartItem) => void;
  isInCart: (id: string) => boolean;
}

export const JewelryPlanner: React.FC<JewelryPlannerProps> = ({
  currency,
  onAddToCart,
  isInCart
}) => {
  const [budget, setBudget] = useState<number>(18000);
  const [occasion, setOccasion] = useState<string>('Wedding / Bridal');
  const [stylePreference, setStylePreference] = useState<string>('Kundan & Meenakari');
  const [metalPreference, setMetalPreference] = useState<string>('Yellow Gold');
  const [outfitDescription, setOutfitDescription] = useState<string>('Emerald green silk saree with intricate antique gold zari border');

  // Image upload and analysis state
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [outfitAnalysis, setOutfitAnalysis] = useState<OutfitAnalysis | null>(null);

  // Recommendations state
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<JewelryPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const occasions = [
    'Wedding / Bridal',
    'Sangeet / Reception',
    'Festive / Diwali / Eid',
    'Cocktail & Black Tie',
    'Everyday Office Chic',
    'Date Night & Anniversary'
  ];

  const stylePreferences = [
    'Kundan & Meenakari',
    'Polki Heritage',
    'Minimalist 14K Gold',
    'Oxidized Silver Boho',
    'Diamond & Solitaire Drop',
    'Rose Gold Contemporary'
  ];

  const metalPreferences = [
    'Yellow Gold',
    'Antique Matte Gold',
    'Silver / Rhodium Finish',
    'Rose Gold',
    'Platinum Tone'
  ];

  const budgetPresets = [
    { label: 'Budget Friendly', amount: 5000 },
    { label: 'Festive Classic', amount: 18000 },
    { label: 'Bridal Grand', amount: 45000 },
    { label: 'Precious Fine', amount: 100000 }
  ];

  // Curated demo outfit samples for quick testing
  const sampleOutfits = [
    {
      id: 'emerald',
      name: 'Emerald Green Silk Saree',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80',
      desc: 'Emerald green Banarasi silk saree with antique gold zari weaving',
      metal: 'Antique Matte Gold',
      style: 'Kundan & Meenakari'
    },
    {
      id: 'pink',
      name: 'Blush Pink Floral Lehenga',
      img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=80',
      desc: 'Blush pink organza lehenga with champagne sequin and pearl detailing',
      metal: 'Rose Gold',
      style: 'Diamond & Solitaire Drop'
    },
    {
      id: 'navy',
      name: 'Royal Navy Velvet Gown',
      img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=80',
      desc: 'Midnight navy velvet off-shoulder evening dress with subtle shimmer',
      metal: 'Silver / Rhodium Finish',
      style: 'Diamond & Solitaire Drop'
    },
    {
      id: 'ivory',
      name: 'Ivory Chikankari Anarkali',
      img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80',
      desc: 'Ivory white cotton-silk Lucknowi Chikankari Anarkali kurta set',
      metal: 'Yellow Gold',
      style: 'Oxidized Silver Boho'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setOutfitImage(base64);
        analyzeUploadedOutfit(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSampleOutfit = (sample: typeof sampleOutfits[0]) => {
    setOutfitDescription(sample.desc);
    setMetalPreference(sample.metal);
    setStylePreference(sample.style);
    setOutfitImage(sample.img);
    // Auto populate analysis
    setOutfitAnalysis({
      outfitType: sample.name,
      neckline: 'Sweetheart / Contoured V-Neck',
      fabricAndDetails: sample.desc,
      dominantColors: [
        { name: 'Primary Tone', hex: sample.id === 'emerald' ? '#065F46' : sample.id === 'pink' ? '#F472B6' : sample.id === 'navy' ? '#1E3A8A' : '#F5F5DC' },
        { name: 'Accent Zari', hex: '#D4AF37' }
      ],
      recommendedMetals: [sample.metal, 'Yellow Gold'],
      recommendedStyles: [sample.style, 'Polki Heritage'],
      stylingSummary: `The rich tones of ${sample.name} are elevated with ${sample.metal} accents. Delicate focal stones complement without overpowering the intricate craftsmanship.`
    });
  };

  const analyzeUploadedOutfit = async (base64: string) => {
    setIsAnalyzingImage(true);
    try {
      const res = await fetch('/api/analyze-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      if (res.ok) {
        const data: OutfitAnalysis = await res.json();
        setOutfitAnalysis(data);
        if (data.recommendedMetals?.[0]) {
          setMetalPreference(data.recommendedMetals[0]);
        }
        if (data.recommendedStyles?.[0]) {
          setStylePreference(data.recommendedStyles[0]);
        }
        setOutfitDescription(`${data.outfitType} · ${data.fabricAndDetails}`);
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recommendations/jewelry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          currency,
          occasion,
          stylePreference,
          metalPreference,
          outfitDescription,
          outfitImageBase64: outfitImage?.startsWith('data:') ? outfitImage : null
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate jewelry plan');
      }

      const data: JewelryPlanResponse = await res.json();
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not generate jewelry styling plan. Please try again.');
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Scenario 3
              </span>
              <span className="text-xs text-slate-500">Amazon · Flipkart · Myntra · Tanishq</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Jewelry Recommendations & Visual Outfit Color Coordination
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Select your occasion and budget, or upload a photo of your dress or ethnic attire. Gemini evaluates neckline harmony, color palettes, and metal tones to suggest stunning jewelry sets across top marketplaces.
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
                <span>Styling with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Re-style Jewelry Ensemble</span>
              </>
            )}
          </button>
        </div>

        {/* Outfit Matcher Studio & Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Outfit Vision Upload / Preset picker */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Outfit Matching Studio
              </label>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 relative overflow-hidden group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {outfitImage ? (
                  <div className="relative h-44 w-full rounded-lg overflow-hidden">
                    <img
                      src={outfitImage}
                      alt="Uploaded outfit"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                      <Camera className="w-4 h-4" /> Change Photo
                    </div>
                  </div>
                ) : (
                  <div className="py-6 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      Upload outfit photo (Saree, Lehenga, Gown)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Gemini Vision detects colors and neckline match
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Sample Outfits */}
              <div className="mt-3">
                <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                  Or select a popular celebration style:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {sampleOutfits.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectSampleOutfit(s)}
                      className="flex items-center gap-2 p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors"
                    >
                      <img src={s.img} alt={s.name} className="w-8 h-8 rounded object-cover shrink-0" />
                      <span className="text-[11px] font-medium text-slate-800 truncate">
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gemini Vision Analysis Badge / Card */}
              {outfitAnalysis && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Gemini Vision Match
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                      {outfitAnalysis.neckline}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-900 leading-snug">
                    {outfitAnalysis.stylingSummary}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-medium">Palette:</span>
                    {outfitAnalysis.dominantColors.map((c, i) => (
                      <span
                        key={i}
                        className="inline-block w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.hex})`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Budget, Occasion & Metal preferences */}
          <div className="lg:col-span-7 space-y-4">
            {/* Budget */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Jewelry Budget
                </label>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCurrency(budget, currency)}
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={150000}
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-600 cursor-pointer"
              />

              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {budgetPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setBudget(p.amount)}
                    className={`py-1 text-[11px] font-medium rounded border transition-colors ${
                      budget === p.amount
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Occasion / Dress Code
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => {
                  const isSelected = occasion === occ;
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style & Metal Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jewelry Craftsmanship Style
                </label>
                <select
                  value={stylePreference}
                  onChange={(e) => setStylePreference(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {stylePreferences.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Metal Tone Preference
                </label>
                <select
                  value={metalPreference}
                  onChange={(e) => setMetalPreference(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {metalPreferences.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text description override */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Outfit Fabric & Color Notes
              </label>
              <input
                type="text"
                value={outfitDescription}
                onChange={(e) => setOutfitDescription(e.target.value)}
                placeholder="e.g. Royal blue velvet lehenga with silver sequins"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {plan && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Curated Ensemble Overview
                </span>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {plan.summary}
                </p>
                {plan.colorHarmonyAnalysis && (
                  <p className="text-xs text-amber-300/90 mt-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 max-w-2xl">
                    <span className="font-semibold text-white">Color & Aesthetic Harmony:</span>{' '}
                    {plan.colorHarmonyAnalysis}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Total Ensemble</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(plan.totalEstimatedCost, currency)}
                  </p>
                </div>
                <div className="text-right pl-4 border-l border-slate-700">
                  <p className="text-[11px] text-emerald-400">Savings / Buffer</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {formatCurrency(plan.savingsOrBuffer, currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sourced Jewelry Pieces Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Coordinated Jewelry Pieces ({plan.recommendations.length} items)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={rec.imageUrl}
                          alt={rec.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold shadow-xs border ${badgeStyle.bg} ${badgeStyle.border}`}
                          >
                            {rec.platform}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-xs">
                          ⭐ {rec.rating}
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <div className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                          {rec.type}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {rec.title}
                        </h4>

                        <div className="flex items-baseline justify-between pt-1">
                          <p className="text-base font-extrabold text-slate-900">
                            {formatCurrency(rec.price, currency)}
                          </p>
                          <span className="text-[10px] text-slate-500">{rec.metal}</span>
                        </div>

                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-semibold text-slate-800">Neckline Tip:</span>{' '}
                          {rec.stylingTip}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          onAddToCart({
                            id: rec.id,
                            name: rec.title,
                            category: rec.type,
                            platform: rec.platform,
                            price: rec.price,
                            quantity: 1,
                            scenario: 'jewelry',
                            searchUrl
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                          inCart
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>{inCart ? 'Saved' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neckline Pairing & Jewelry Care Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>Neckline & Silhouette Pairing Guide</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {plan.necklinePairingAdvice.map((advice, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 shrink-0">·</span>
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Jewelry Care & Value Longevity Tips</span>
              </div>
              <ul className="space-y-2 text-xs text-amber-950/80">
                {plan.careAndValueTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">0{idx + 1}.</span>
                    <span>{tip}</span>
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
