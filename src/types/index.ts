export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface RoomItemConfig {
  id: string;
  name: string;
  room: string;
  defaultQty: number;
  min: number;
  max: number;
  unitCostEstimate: number;
  iconName: string;
}

export interface HomePlanRecommendation {
  id: string;
  name: string;
  category: string;
  room: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  platform: 'IKEA' | 'Amazon' | 'Flipkart' | 'Pepperfry';
  searchQuery: string;
  rating: number;
  reviewsCount: number;
  reason: string;
  keyFeatures: string[];
  imageUrl: string;
}

export interface CategoryBreakdown {
  category: string;
  allocatedAmount: number;
  percentage: number;
}

export interface HomePlanResponse {
  summary: string;
  totalEstimatedCost: number;
  budgetUtilizationPercentage: number;
  savingsOrBuffer: number;
  categoryBreakdown: CategoryBreakdown[];
  recommendations: HomePlanRecommendation[];
  smartBudgetAdvice: string[];
  alternativeSuggestions: string[];
}

export interface PartyRecommendation {
  id: string;
  title: string;
  category: string;
  platform: 'Swiggy' | 'Zomato' | 'Amazon' | 'Flipkart' | 'OYO' | 'Urban Company / Local Vendor';
  unitPrice: number;
  vendor: string;
  searchQuery: string;
  rating: number;
  details: string;
  keyBenefit: string;
  imageUrl: string;
}

export interface PartyPlanResponse {
  summary: string;
  perPersonCost: number;
  totalEstimatedCost: number;
  savings: number;
  budgetDistribution: {
    catering: { percentage: number; amount: number; platform: string };
    decoration: { percentage: number; amount: number; platform: string };
    entertainment: { percentage: number; amount: number; platform: string };
    venueAccommodation: { percentage: number; amount: number; platform: string };
  };
  recommendations: PartyRecommendation[];
  timelineSchedule: { time: string; activity: string }[];
  costSavingHacks: string[];
}

export interface JewelryRecommendation {
  id: string;
  title: string;
  type: string;
  platform: 'Amazon' | 'Flipkart' | 'Myntra' | 'Tanishq' | 'CaratLane';
  price: number;
  metal: string;
  rating: number;
  reviewsCount: number;
  searchQuery: string;
  stylingTip: string;
  features: string[];
  imageUrl: string;
}

export interface JewelryPlanResponse {
  summary: string;
  colorHarmonyAnalysis: string;
  totalEstimatedCost: number;
  savingsOrBuffer: number;
  recommendations: JewelryRecommendation[];
  necklinePairingAdvice: string[];
  careAndValueTips: string[];
}

export interface OutfitAnalysis {
  outfitType: string;
  neckline: string;
  fabricAndDetails: string;
  dominantColors: { name: string; hex: string }[];
  recommendedMetals: string[];
  recommendedStyles: string[];
  stylingSummary: string;
}

export interface ProjectTask {
  id: string;
  epicId: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'High' | 'Medium' | 'Low';
  assignee: 'Janani R' | 'Kethsiya J';
}

export interface ProjectEpic {
  id: string;
  title: string;
  tasksCount: number;
  status: 'In Progress' | 'Completed' | 'Planned';
}

export interface ProjectInfo {
  demoUrl: string;
  githubUrl: string;
  mentor: string;
  teamMembers: { name: string; role: string; initial: string; email: string }[];
  epics: ProjectEpic[];
  tasks: ProjectTask[];
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  platform: string;
  price: number;
  quantity: number;
  scenario: 'home' | 'party' | 'jewelry';
  searchUrl: string;
}
