import React from 'react';
import {
  Wallet,
  Home,
  PartyPopper,
  Gem,
  Kanban,
  Cpu,
  ShoppingBag,
  ExternalLink,
  Github,
  ChevronDown
} from 'lucide-react';
import { Currency } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenLinksModal: () => void;
  demoUrl: string;
  githubUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  cartCount,
  onOpenCart,
  onOpenLinksModal,
  demoUrl,
  githubUrl
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'home', label: 'Home Interior', icon: Home, badge: 'Scenario 1' },
    { id: 'party', label: 'Party Planner', icon: PartyPopper, badge: 'Scenario 2' },
    { id: 'jewelry', label: 'Jewelry & Outfit', icon: Gem, badge: 'Scenario 3' },
    { id: 'workspace', label: 'Workspace & Kanban', icon: Kanban, count: '16 Tasks' },
    { id: 'tech', label: 'Tech Architecture', icon: Cpu }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-900">PocketSmart</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">AI</span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">Smart Budget & Recommendation Assistant</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        isActive ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {tab.count && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isActive ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Currency, Cart, Links, Team */}
          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <div className="relative">
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg pl-2.5 pr-6 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              title="View Planned Items & Budget Burn-Down"
            >
              <ShoppingBag className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">My Plan</span>
              {cartCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Team Avatars Indicator */}
            <div
              onClick={onOpenLinksModal}
              className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
              title="Team: Janani R (Lead), Kethsiya J (Member)"
            >
              <div className="flex -space-x-1.5">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold border-2 border-white">
                  J
                </span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold border-2 border-white">
                  K
                </span>
              </div>
              <div className="text-[11px] leading-tight text-slate-500 hidden xl:block">
                <p className="font-semibold text-slate-800">Team Finance</p>
                <p className="text-[10px]">2 Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Horizontal Scroll */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
