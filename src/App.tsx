import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MentorBanner } from './components/MentorBanner';
import { ProjectLinksModal } from './components/ProjectLinksModal';
import { OverviewHero } from './components/OverviewHero';
import { HomePlanner } from './components/HomePlanner';
import { PartyPlanner } from './components/PartyPlanner';
import { JewelryPlanner } from './components/JewelryPlanner';
import { WorkspaceKanban } from './components/WorkspaceKanban';
import { TechnicalArchitecture } from './components/TechnicalArchitecture';
import { CartDrawer } from './components/CartDrawer';
import { Currency, ProjectEpic, ProjectTask, CartItem } from './types';
import { Github, Globe, Users, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState<boolean>(false);

  // Project links & mentor details
  const [demoUrl, setDemoUrl] = useState<string>(
    window.location.origin || 'https://pocketsmart-ai.demo.app'
  );
  const [githubUrl, setGithubUrl] = useState<string>(
    'https://github.com/jananir/pocketsmart-ai'
  );
  const [mentor, setMentor] = useState<string>('No mentor assigned yet');

  // Epics and tasks
  const [epics, setEpics] = useState<ProjectEpic[]>([
    { id: 'EPIC-1', title: 'Home Interior Smart Budget Allocation Engine', tasksCount: 2, status: 'In Progress' },
    { id: 'EPIC-2', title: 'AI-Based Party & Event Planner with Multi-Vendor Sourcing', tasksCount: 2, status: 'In Progress' },
    { id: 'EPIC-3', title: 'Occasion Jewelry Recommendation & Visual Outfit Matcher', tasksCount: 2, status: 'In Progress' },
    { id: 'EPIC-4', title: 'Cross-Platform Product Aggregator (IKEA, Amazon, Flipkart, Swiggy, Zomato, OYO)', tasksCount: 2, status: 'Completed' },
    { id: 'EPIC-5', title: 'Gemini 3.8 Multi-Modal & Structured Reasoning Pipeline', tasksCount: 2, status: 'Completed' },
    { id: 'EPIC-6', title: 'Real-Time Budget Burn-Down & Dynamic Category Slider Engine', tasksCount: 2, status: 'Completed' },
    { id: 'EPIC-7', title: 'Export & Shareable Budget Reports (PDF, CSV & Summary Card)', tasksCount: 2, status: 'Completed' },
    { id: 'EPIC-8', title: 'FastAPI / Jinja & Microservice Architecture Simulation', tasksCount: 2, status: 'Completed' }
  ]);

  const [tasks, setTasks] = useState<ProjectTask[]>([
    { id: 'TASK-1', epicId: 'EPIC-1', title: 'Implement room type matrix (Living Room, Kitchen, Bedroom) & item quantity counters', status: 'done', priority: 'High', assignee: 'Janani R' },
    { id: 'TASK-2', epicId: 'EPIC-1', title: 'Integrate IKEA & Amazon catalog search algorithm for home furnishing', status: 'done', priority: 'High', assignee: 'Janani R' },
    { id: 'TASK-3', epicId: 'EPIC-2', title: 'Build party budgeting logic with per-guest cost distribution algorithms', status: 'done', priority: 'High', assignee: 'Kethsiya J' },
    { id: 'TASK-4', epicId: 'EPIC-2', title: 'Connect Swiggy, Zomato catering, Amazon decor & OYO stay aggregator', status: 'done', priority: 'Medium', assignee: 'Kethsiya J' },
    { id: 'TASK-5', epicId: 'EPIC-3', title: 'Construct occasion selector (Wedding, Sangeet, Festive, Black Tie, Everyday)', status: 'done', priority: 'Medium', assignee: 'Janani R' },
    { id: 'TASK-6', epicId: 'EPIC-3', title: 'Deploy Gemini Multimodal Outfit Image Analyzer for color harmony & neckline styling', status: 'done', priority: 'High', assignee: 'Janani R' },
    { id: 'TASK-7', epicId: 'EPIC-4', title: 'Build Amazon & Flipkart deep link generator with budget filters', status: 'done', priority: 'Medium', assignee: 'Kethsiya J' },
    { id: 'TASK-8', epicId: 'EPIC-4', title: 'Implement IKEA item card parser and Pepperfry price fallback engine', status: 'done', priority: 'Medium', assignee: 'Kethsiya J' },
    { id: 'TASK-9', epicId: 'EPIC-5', title: 'Set up Google GenAI SDK server-side endpoint with structured JSON parsing', status: 'done', priority: 'High', assignee: 'Janani R' },
    { id: 'TASK-10', epicId: 'EPIC-5', title: 'Prompt engineering for budget optimization, trade-offs, and savings advice', status: 'done', priority: 'High', assignee: 'Janani R' },
    { id: 'TASK-11', epicId: 'EPIC-6', title: 'Create interactive budget burn-down bar with over-budget warning triggers', status: 'done', priority: 'High', assignee: 'Kethsiya J' },
    { id: 'TASK-12', epicId: 'EPIC-6', title: 'Dynamic category adjustment sliders with real-time recalculation', status: 'done', priority: 'Medium', assignee: 'Kethsiya J' },
    { id: 'TASK-13', epicId: 'EPIC-7', title: 'Export budget breakdown to clean printable view & CSV download', status: 'done', priority: 'Low', assignee: 'Janani R' },
    { id: 'TASK-14', epicId: 'EPIC-7', title: 'Save and load customized scenarios in local storage', status: 'done', priority: 'Medium', assignee: 'Janani R' },
    { id: 'TASK-15', epicId: 'EPIC-8', title: 'Document technical architecture diagram & FastAPI/Jinja bridge specs', status: 'done', priority: 'Low', assignee: 'Kethsiya J' },
    { id: 'TASK-16', epicId: 'EPIC-8', title: 'Validate system requirements (Intel i5, 4GB RAM, 128GB SSD, 10Mbps)', status: 'done', priority: 'Low', assignee: 'Kethsiya J' }
  ]);

  // Cart / Saved items
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('pocketsmart_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pocketsmart_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error(err);
    }
  }, [cartItems]);

  // Fetch initial project info from server
  useEffect(() => {
    fetch('/api/project/info')
      .then((res) => res.json())
      .then((data) => {
        if (data.demoUrl) setDemoUrl(data.demoUrl);
        if (data.githubUrl) setGithubUrl(data.githubUrl);
        if (data.mentor) setMentor(data.mentor);
        if (data.epics) setEpics(data.epics);
        if (data.tasks) setTasks(data.tasks);
      })
      .catch((err) => console.log('Using default project state'));
  }, []);

  const handleSaveLinks = async (demo: string, github: string, newMentor: string) => {
    setDemoUrl(demo);
    setGithubUrl(github);
    setMentor(newMentor);
    try {
      await fetch('/api/project/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demoUrl: demo,
          githubUrl: github,
          mentor: newMentor
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTasks = async (updatedTasks: ProjectTask[]) => {
    setTasks(updatedTasks);
    try {
      await fetch('/api/project/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const isInCart = (id: string) => cartItems.some((i) => i.id === id);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      <div>
        {/* Mentor Evaluation Alert Notice Banner */}
        <MentorBanner
          demoUrl={demoUrl}
          githubUrl={githubUrl}
          mentor={mentor}
          onOpenModal={() => setIsLinksModalOpen(true)}
        />

        {/* Global Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currency={currency}
          setCurrency={setCurrency}
          cartCount={cartItems.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenLinksModal={() => setIsLinksModalOpen(true)}
          demoUrl={demoUrl}
          githubUrl={githubUrl}
        />

        {/* Main Content View Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'overview' && (
            <OverviewHero
              onSelectScenario={(sc) => setActiveTab(sc)}
              currency={currency}
              onOpenLinksModal={() => setIsLinksModalOpen(true)}
              mentor={mentor}
            />
          )}

          {activeTab === 'home' && (
            <HomePlanner
              currency={currency}
              onAddToCart={handleAddToCart}
              isInCart={isInCart}
            />
          )}

          {activeTab === 'party' && (
            <PartyPlanner
              currency={currency}
              onAddToCart={handleAddToCart}
              isInCart={isInCart}
            />
          )}

          {activeTab === 'jewelry' && (
            <JewelryPlanner
              currency={currency}
              onAddToCart={handleAddToCart}
              isInCart={isInCart}
            />
          )}

          {activeTab === 'workspace' && (
            <WorkspaceKanban
              epics={epics}
              tasks={tasks}
              onUpdateTasks={handleUpdateTasks}
              mentor={mentor}
              onOpenLinksModal={() => setIsLinksModalOpen(true)}
            />
          )}

          {activeTab === 'tech' && <TechnicalArchitecture />}
        </main>
      </div>

      {/* Cart / Saved Items Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currency={currency}
      />

      {/* Demo & GitHub Credentials Modal */}
      <ProjectLinksModal
        isOpen={isLinksModalOpen}
        onClose={() => setIsLinksModalOpen(false)}
        demoUrl={demoUrl}
        githubUrl={githubUrl}
        mentor={mentor}
        onSave={handleSaveLinks}
      />

      {/* Application Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">PocketSmart AI</span>
            <span>·</span>
            <span>Finance Group Project</span>
            <span>·</span>
            <span className="hidden sm:inline">
              Team: Janani R (Lead), Kethsiya J (Member)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLinksModalOpen(true)}
              className="text-amber-800 hover:text-amber-950 font-semibold transition-colors"
            >
              Update Mentor Evaluation Links
            </button>
            <span>·</span>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <span>·</span>
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
