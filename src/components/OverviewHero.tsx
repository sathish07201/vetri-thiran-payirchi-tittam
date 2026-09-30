import React from 'react';
import {
  Home,
  PartyPopper,
  Gem,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Layers,
  CheckCircle2,
  Users,
  Target,
  ExternalLink,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

interface OverviewHeroProps {
  onSelectScenario: (scenario: 'home' | 'party' | 'jewelry') => void;
  currency: Currency;
  onOpenLinksModal: () => void;
  mentor: string;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({
  onSelectScenario,
  currency,
  onOpenLinksModal,
  mentor
}) => {
  const platforms = [
    { name: 'IKEA', category: 'Modular Home Furniture', color: 'bg-blue-600' },
    { name: 'Amazon', category: 'Decor, Tech & Outfits', color: 'bg-amber-600' },
    { name: 'Flipkart', category: 'Appliances & Festive Wear', color: 'bg-sky-600' },
    { name: 'Swiggy', category: 'Gourmet Drinks & Delivery', color: 'bg-orange-500' },
    { name: 'Zomato', category: 'Live Party Catering Boxes', color: 'bg-red-600' },
    { name: 'OYO', category: 'Banquet & Guest Stay Suites', color: 'bg-rose-500' },
    { name: 'Pepperfry', category: 'Solid Wood & Sofa Decor', color: 'bg-yellow-600' }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-2xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Gemini 3.8 Flash
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">Finance Group Project</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">Cross-Platform Recommendation Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop overspending. Plan life events with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">
              precision AI budgeting.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Managing budgets across home decor, celebrations, and jewelry shopping can be overwhelming due to fragmented platforms and wildly fluctuating prices. PocketSmart AI balances cost, aesthetic harmony, and quality across Amazon, Flipkart, IKEA, Swiggy, Zomato, and OYO.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectScenario('home')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Start Budget Planning
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLinksModal}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-sm border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-amber-400" />
              Team & Mentor Overview
            </button>
          </div>
        </div>

        {/* Quick project pill stats at bottom */}
        <div className="relative z-10 mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Epics</p>
            <p className="text-2xl font-bold text-white mt-0.5">8 Epics</p>
            <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Fully Structured
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Stories & Subtasks</p>
            <p className="text-2xl font-bold text-white mt-0.5">16 Tasks</p>
            <p className="text-xs text-slate-400 mt-0.5">0 Pending Subtasks</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Core Scenarios</p>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">3 Modules</p>
            <p className="text-xs text-slate-400 mt-0.5">Home, Party, Jewelry</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Sourced Platforms</p>
            <p className="text-2xl font-bold text-white mt-0.5">7 Ecosystems</p>
            <p className="text-xs text-slate-400 mt-0.5">Live Deep-Search Links</p>
          </div>
        </div>
      </section>

      {/* The 3 Core Scenarios Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Three Intelligent Budgeting Scenarios</h2>
            <p className="text-xs text-slate-500">Select any planner below to test adaptive recommendations and dynamic budget allocation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Scenario 1: Home Interior */}
          <div
            onClick={() => onSelectScenario('home')}
            className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Scenario 1
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Home Interior Planning
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                  Specify rooms (Living Room, Kitchen, Bedroom), quantities for lights, ceiling fans, dining tables, and style preferences. Gemini allocates budget with curated picks from IKEA, Amazon, and Pepperfry.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Room-by-room item matrix</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>IKEA & Amazon deep linking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Dynamic budget reallocation sliders</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
              <span>Open Home Planner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Scenario 2: Party Planner */}
          <div
            onClick={() => onSelectScenario('party')}
            className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                  Scenario 2
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                  AI-Based Party Planning
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                  Input guest count, event type, and venue details. The AI balances catering, decoration, sound/entertainment, and OYO accommodation with Swiggy, Zomato, and Amazon integration.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Per-guest cost calculation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Swiggy & Zomato catering boxes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>OYO Townhouse room allocation</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-orange-700">
              <span>Open Party Planner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Scenario 3: Jewelry Recommendations */}
          <div
            onClick={() => onSelectScenario('jewelry')}
            className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Gem className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Scenario 3
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Jewelry & Outfit Styling
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                  Upload an outfit image or pick a color palette. Gemini analyzes neckline compatibility, color harmony, and style to recommend jewelry from Amazon, Flipkart, and Myntra.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Gemini Vision outfit image analysis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Neckline pairing guidelines</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Kundan, Polki & Gold finish filters</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Open Jewelry Matcher</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Platform Ecosystem Coverage */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Supported E-Commerce Ecosystems</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            PocketSmart AI bridges across specialized vendors to bypass high single-platform markups.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="bg-white border border-slate-200 rounded-lg p-3 text-center space-y-1 hover:border-slate-300 transition-colors"
            >
              <p className="text-sm font-bold text-slate-900">{p.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{p.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project & Team Workspace Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Team & Mentor Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">Assigned roles and project review status</p>
          </div>

          <button
            onClick={onOpenLinksModal}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Update Project Credentials</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
              J
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Team Lead</p>
              <p className="text-sm font-bold text-slate-900">Janani R</p>
              <p className="text-xs text-slate-500 mt-0.5">GenAI Algorithms & Backend Integration</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
              K
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Team Member</p>
              <p className="text-sm font-bold text-slate-900">Kethsiya J</p>
              <p className="text-xs text-slate-500 mt-0.5">Frontend UX, Sourcing Connectors & Kanban</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center shrink-0">
              M
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Evaluation Mentor</p>
              <p className="text-sm font-semibold text-slate-800">{mentor}</p>
              <button
                onClick={onOpenLinksModal}
                className="text-xs text-amber-700 hover:text-amber-800 font-medium underline mt-1 block"
              >
                Assign or update mentor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
