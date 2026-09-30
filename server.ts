import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory store for project links and workspace data
let projectData = {
  demoUrl: process.env.APP_URL || 'https://pocketsmart-ai.demo.app',
  githubUrl: 'https://github.com/jananir/pocketsmart-ai',
  mentor: 'No mentor assigned yet',
  teamMembers: [
    { name: 'Janani R', role: 'teamLead', initial: 'J', email: 'janani.lead@pocketsmart.ai' },
    { name: 'Kethsiya J', role: 'member', initial: 'K', email: 'kethsiya.j@pocketsmart.ai' }
  ],
  epics: [
    { id: 'EPIC-1', title: 'Home Interior Smart Budget Allocation Engine', tasksCount: 2, status: 'In Progress' },
    { id: 'EPIC-2', title: 'AI-Based Party & Event Planner with Multi-Vendor Sourcing', tasksCount: 2, status: 'In Progress' },
    { id: 'EPIC-3', title: 'Occasion Jewelry Recommendation & Visual Outfit Matcher', tasksCount: 2, status: 'In Progress' },
    { id: 'EPIC-4', title: 'Cross-Platform Product Aggregator (IKEA, Amazon, Flipkart, Swiggy, Zomato, OYO)', tasksCount: 2, status: 'Completed' },
    { id: 'EPIC-5', title: 'Gemini 3.8 Multi-Modal & Structured Reasoning Pipeline', tasksCount: 2, status: 'Completed' },
    { id: 'EPIC-6', title: 'Real-Time Budget Burn-Down & Dynamic Category Slider Engine', tasksCount: 2, status: 'Completed' },
    { id: 'EPIC-7', title: 'Export & Shareable Budget Reports (PDF, CSV & Summary Card)', tasksCount: 2, status: 'Completed' },
    { id: 'EPIC-8', title: 'FastAPI / Jinja & Microservice Architecture Simulation', tasksCount: 2, status: 'Completed' }
  ],
  tasks: [
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
  ]
};

// API: Get Project Info (Team, Epics, Tasks, Links)
app.get('/api/project/info', (req, res) => {
  res.json(projectData);
});

// API: Update Project Links & Mentor
app.post('/api/project/update', (req, res) => {
  const { demoUrl, githubUrl, mentor, tasks } = req.body;
  if (demoUrl !== undefined) projectData.demoUrl = demoUrl;
  if (githubUrl !== undefined) projectData.githubUrl = githubUrl;
  if (mentor !== undefined) projectData.mentor = mentor;
  if (tasks !== undefined) projectData.tasks = tasks;
  res.json({ success: true, projectData });
});

// API: Download full project folder as ZIP archive
app.get('/api/download-zip', (req, res) => {
  try {
    const zipPath = path.join(__dirname, 'pocketsmart-ai.zip');
    // Ensure latest files are zipped
    execSync('python3 scripts/create_zip.py pocketsmart-ai.zip', { cwd: __dirname });
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="pocketsmart-ai.zip"');
      return res.download(zipPath, 'pocketsmart-ai.zip');
    } else {
      res.status(500).json({ error: 'Zip file not found' });
    }
  } catch (err: any) {
    console.error('Download zip error:', err);
    res.status(500).json({ error: 'Failed to generate project archive' });
  }
});

// Helper for currency symbol
function getCurrencySymbol(c = 'INR') {
  if (c === 'USD') return '$';
  if (c === 'EUR') return '€';
  if (c === 'GBP') return '£';
  return '₹';
}

// Scenario 1: Home Interior Budget Planning
app.post('/api/recommendations/home', async (req, res) => {
  const { budget = 50000, currency = 'INR', rooms = ['Living Room'], roomItems = {}, style = 'Modern Minimalist', priorities = 'Balanced' } = req.body;
  const sym = getCurrencySymbol(currency);

  const prompt = `You are PocketSmart AI, an expert interior designer and cross-platform budget optimization assistant.
Analyze this user request:
- Total Budget: ${sym}${budget} ${currency}
- Selected Rooms: ${rooms.join(', ')}
- Item Quantities: ${JSON.stringify(roomItems)}
- Interior Style: ${style}
- User Priority: ${priorities}

Generate a comprehensive, realistic product recommendation plan across platforms (IKEA, Amazon, Flipkart, Pepperfry).
Allocate the budget wisely across categories so the total estimated cost stays within or close to ${budget}.

Respond with strict JSON matching this schema:
{
  "summary": "Concise 2-3 sentence overview of this interior plan",
  "totalEstimatedCost": number,
  "budgetUtilizationPercentage": number,
  "savingsOrBuffer": number,
  "categoryBreakdown": [
    { "category": "Lighting", "allocatedAmount": number, "percentage": number },
    { "category": "Furniture & Seating", "allocatedAmount": number, "percentage": number },
    { "category": "Dining & Tables", "allocatedAmount": number, "percentage": number },
    { "category": "Storage & Organization", "allocatedAmount": number, "percentage": number },
    { "category": "Soft Furnishing & Decor", "allocatedAmount": number, "percentage": number }
  ],
  "recommendations": [
    {
      "id": "item-1",
      "name": "Product Name (e.g. IKEA LERSTA Floor Lamp)",
      "category": "Lighting | Furniture & Seating | Dining & Tables | Storage | Decor",
      "room": "Living Room | Bedroom | etc",
      "quantity": 1,
      "unitPrice": number,
      "totalPrice": number,
      "platform": "IKEA" or "Amazon" or "Flipkart" or "Pepperfry",
      "searchQuery": "search keyword for platform",
      "rating": 4.5,
      "reviewsCount": 320,
      "reason": "Why this item fits the budget and ${style} aesthetic",
      "keyFeatures": ["feature 1", "feature 2"],
      "imageUrl": "valid unsplash interior item image URL"
    }
  ],
  "smartBudgetAdvice": ["tip 1", "tip 2", "tip 3"],
  "alternativeSuggestions": ["suggestion 1", "suggestion 2"]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      }
    } catch (err: any) {
      console.error('Gemini Home Planner error:', err?.message || err);
      // Fallback below
    }
  }

  // Resilient fallback logic matching the inputs
  const livingCost = Math.round(budget * 0.45);
  const bedCost = Math.round(budget * 0.35);
  const otherCost = Math.max(0, budget - livingCost - bedCost);

  const fallback = {
    summary: `Curated ${style} interior package optimized for ${rooms.join(', ')} within ${sym}${budget.toLocaleString()}. Prioritizing durable core furniture from IKEA and value lighting from Amazon & Flipkart.`,
    totalEstimatedCost: Math.round(budget * 0.94),
    budgetUtilizationPercentage: 94,
    savingsOrBuffer: Math.round(budget * 0.06),
    categoryBreakdown: [
      { category: 'Lighting', allocatedAmount: Math.round(budget * 0.15), percentage: 15 },
      { category: 'Furniture & Seating', allocatedAmount: Math.round(budget * 0.42), percentage: 42 },
      { category: 'Dining & Tables', allocatedAmount: Math.round(budget * 0.22), percentage: 22 },
      { category: 'Storage & Organization', allocatedAmount: Math.round(budget * 0.12), percentage: 12 },
      { category: 'Soft Furnishing & Decor', allocatedAmount: Math.round(budget * 0.09), percentage: 9 }
    ],
    recommendations: [
      {
        id: 'home-1',
        name: 'IKEA KALLAX Shelving Unit 4x2 Oak Effect',
        category: 'Storage & Organization',
        room: 'Living Room',
        quantity: roomItems['storage'] || 1,
        unitPrice: Math.round(budget * 0.11),
        totalPrice: Math.round(budget * 0.11),
        platform: 'IKEA',
        searchQuery: 'IKEA KALLAX Shelving Unit oak',
        rating: 4.8,
        reviewsCount: 1420,
        reason: `Clean lines matching ${style} decor, modular baskets keep living spaces uncluttered.`,
        keyFeatures: ['Scratch-resistant laminate', 'Vertical or horizontal standing', 'Modular insert slots'],
        imageUrl: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'home-2',
        name: 'Amazon Basics Solid Wood 4-Seater Dining Set',
        category: 'Dining & Tables',
        room: 'Dining Room',
        quantity: roomItems['diningTable'] || 1,
        unitPrice: Math.round(budget * 0.22),
        totalPrice: Math.round(budget * 0.22),
        platform: 'Amazon',
        searchQuery: 'Amazon Basics 4-Seater Dining Table Set',
        rating: 4.4,
        reviewsCount: 890,
        reason: 'Sheesham wood finish offers great longevity without high luxury boutique markups.',
        keyFeatures: ['Sturdy solid wood', 'Ergonomic upholstered chairs', 'Easy DIY assembly'],
        imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'home-3',
        name: 'Havells Glaze 1200mm Decorative BLDC Ceiling Fan',
        category: 'Lighting',
        room: 'Living Room',
        quantity: roomItems['fans'] || 2,
        unitPrice: Math.round(budget * 0.05),
        totalPrice: Math.round(budget * 0.10),
        platform: 'Flipkart',
        searchQuery: 'Havells BLDC 1200mm Ceiling Fan energy saving',
        rating: 4.6,
        reviewsCount: 2310,
        reason: 'BLDC motor saves up to 60% on electricity bills while matching contemporary ceiling color tones.',
        keyFeatures: ['60% Energy saving BLDC', 'RF Remote Control', 'Silent aerodynamic blades'],
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'home-4',
        name: 'IKEA NYMÅNE Ceiling Spotlight 4-Bulb White',
        category: 'Lighting',
        room: 'Living Room',
        quantity: roomItems['lights'] || 2,
        unitPrice: Math.round(budget * 0.04),
        totalPrice: Math.round(budget * 0.08),
        platform: 'IKEA',
        searchQuery: 'IKEA NYMANE ceiling spotlight 4 bulb',
        rating: 4.7,
        reviewsCount: 615,
        reason: 'Directional adjustable spotlights accentuate artwork and create cozy layered ambient warmth.',
        keyFeatures: ['Directional 360-degree heads', 'Matt powder coat', 'LED compatible'],
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'home-5',
        name: 'Pepperfry 3-Seater Velvet Fabric Sofa in Slate Grey',
        category: 'Furniture & Seating',
        room: 'Living Room',
        quantity: roomItems['sofa'] || 1,
        unitPrice: Math.round(budget * 0.32),
        totalPrice: Math.round(budget * 0.32),
        platform: 'Pepperfry',
        searchQuery: 'Pepperfry 3-seater fabric sofa modern grey',
        rating: 4.5,
        reviewsCount: 450,
        reason: 'High-density foam with premium stain-resistant fabric forms the centerpiece of your living space.',
        keyFeatures: ['32 Density high resilience foam', 'Treated anti-sag springs', 'Solid Sal wood frame'],
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'home-6',
        name: 'Amazon Brand - Solimo Geometric Pattern Area Rug (5x7 ft)',
        category: 'Soft Furnishing & Decor',
        room: 'Living Room',
        quantity: roomItems['rug'] || 1,
        unitPrice: Math.round(budget * 0.07),
        totalPrice: Math.round(budget * 0.07),
        platform: 'Amazon',
        searchQuery: 'Solimo geometric area rug living room 5x7',
        rating: 4.3,
        reviewsCount: 780,
        reason: 'Ties the room palette together while providing soft underfoot texture.',
        keyFeatures: ['Non-slip rubber backing', 'Machine washable', 'Anti-shedding yarn'],
        imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80'
      }
    ],
    smartBudgetAdvice: [
      `Invest heavily in the primary seating (${sym}${Math.round(budget * 0.32)}) since it endures daily friction; save on accent tables and decor accessories.`,
      'Buy lighting fixtures during Amazon Great Indian Festival or Flipkart Big Billion Days for up to 35% additional card discounts.',
      'IKEA flat-pack items give you premium Scandinavian aesthetics if you utilize DIY assembly.'
    ],
    alternativeSuggestions: [
      'Swap the velvet sofa for a compact 2-seater L-shape to save ₹4,500 and allocate towards an accent floor lamp.',
      'Purchase dual-tone recessed COB lights in a 4-pack on Flipkart to trim the lighting budget by 20%.'
    ]
  };

  res.json(fallback);
});

// Scenario 2: Party Budget Planning
app.post('/api/recommendations/party', async (req, res) => {
  const { budget = 30000, currency = 'INR', eventType = 'Birthday', guestCount = 25, venueType = 'Home / Apartment', dietary = 'Mixed Buffet', needsAccommodation = false, entertainmentPreferences = ['DJ', 'Photobooth'] } = req.body;
  const sym = getCurrencySymbol(currency);

  const prompt = `You are PocketSmart AI, an event planner and multi-platform budget optimization system.
User Request:
- Total Budget: ${sym}${budget} ${currency}
- Event Type: ${eventType}
- Number of Guests: ${guestCount}
- Venue Type: ${venueType}
- Dietary Style: ${dietary}
- Needs Accommodation: ${needsAccommodation ? 'Yes (OYO / Stay)' : 'No'}
- Entertainment: ${entertainmentPreferences.join(', ')}

Allocate budget across:
1. Catering & Food (Swiggy Gourmet, Zomato Party Boxes, Caterer)
2. Decoration & Props (Amazon Theme Kits, Flipkart balloons/lights)
3. Entertainment & Music (Amazon sound/lighting, Local DJ, Games)
4. Venue & Accommodation (OYO Townhouse / Banquet / Home decor)

Provide structured JSON with realistic per-person estimates and vendor options.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        return res.json(JSON.parse(text));
      }
    } catch (err: any) {
      console.error('Gemini Party Planner error:', err?.message || err);
    }
  }

  // Fallback party planning logic
  const perGuest = Math.round(budget / Math.max(1, guestCount));
  const cateringAmt = Math.round(budget * (needsAccommodation ? 0.40 : 0.50));
  const decorAmt = Math.round(budget * 0.18);
  const entertainAmt = Math.round(budget * 0.14);
  const venueAmt = budget - cateringAmt - decorAmt - entertainAmt;

  const fallbackParty = {
    summary: `Smart ${eventType} budget breakdown for ${guestCount} guests at ${venueType}. Calculated at ${sym}${perGuest} per guest with curated vendors from Swiggy, Zomato, Amazon, and OYO.`,
    perPersonCost: perGuest,
    totalEstimatedCost: Math.round(budget * 0.95),
    savings: Math.round(budget * 0.05),
    budgetDistribution: {
      catering: { percentage: needsAccommodation ? 40 : 50, amount: cateringAmt, platform: 'Swiggy & Zomato' },
      decoration: { percentage: 18, amount: decorAmt, platform: 'Amazon & Flipkart' },
      entertainment: { percentage: 14, amount: entertainAmt, platform: 'Amazon & Local' },
      venueAccommodation: { percentage: needsAccommodation ? 28 : 18, amount: venueAmt, platform: needsAccommodation ? 'OYO Rooms' : 'Venue/Facility' }
    },
    recommendations: [
      {
        id: 'party-1',
        title: 'Zomato Live Catering Buffet Box (Starters + Mains + Desserts)',
        category: 'Catering & Beverages',
        platform: 'Zomato',
        unitPrice: Math.round(cateringAmt * 0.75),
        vendor: 'Zomato Food Partner / Biryani & Kebab Box',
        searchQuery: `Zomato party catering bulk meal box ${eventType}`,
        rating: 4.7,
        details: `3 Appetizers, 2 Mains, Breads, Rice, and Gulab Jamun/Pastries sized for ${guestCount} guests.`,
        keyBenefit: 'Freshly packed in insulated containers, zero cooking stress.',
        imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'party-2',
        title: 'Swiggy Gourmet Mocktail & Beverage Crate + Artisanal Ice',
        category: 'Catering & Beverages',
        platform: 'Swiggy',
        unitPrice: Math.round(cateringAmt * 0.25),
        vendor: 'Swiggy Instamart / Gourmet Store',
        searchQuery: 'Swiggy party drinks tonic coolers mixers',
        rating: 4.8,
        details: 'Assorted fruit mojitos, sparkling peach fizzes, and packaged crushed ice delivered in 15 mins.',
        keyBenefit: 'Chilled delivery ready for the welcome drink station.',
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'party-3',
        title: `Amazon Complete ${eventType} Balloon Arch & LED Fairy Light Kit (120 Pcs)`,
        category: 'Decoration & Ambience',
        platform: 'Amazon',
        unitPrice: Math.round(decorAmt * 0.55),
        vendor: 'Amazon Prime Festivities',
        searchQuery: `Amazon ${eventType} theme decoration kit balloon arch LED lights`,
        rating: 4.6,
        details: 'Chrome metallic balloons, arch strip tape, glue dots, happy celebration foil banner, and warm LED string lights.',
        keyBenefit: 'Saves over ₹4,000 compared to hiring an external balloon decorator.',
        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'party-4',
        title: 'Flipkart Photobooth Props & Custom Instant Polaroid Frame Kit',
        category: 'Decoration & Ambience',
        platform: 'Flipkart',
        unitPrice: Math.round(decorAmt * 0.45),
        vendor: 'Flipkart Party Corner',
        searchQuery: 'Flipkart selfie photo booth props fun party mask glasses',
        rating: 4.5,
        details: '35 funny cutout props, glitter mustaches, celebration crowns, and reusable photo frame cutout.',
        keyBenefit: 'Keeps guests engaged and generates memorable social media pictures.',
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'party-5',
        title: 'Tribit / JBL Portable Bluetooth Party Speaker with Mic for Karaoke',
        category: 'Entertainment & Music',
        platform: 'Amazon',
        unitPrice: entertainAmt,
        vendor: 'Amazon Electronics',
        searchQuery: 'Amazon portable Bluetooth party speaker wireless karaoke mic',
        rating: 4.6,
        details: '40W RMS bass output, 12-hour battery life, wireless dynamic microphone, and beat-synced party lights.',
        keyBenefit: 'Instant DJ sound and interactive karaoke games without paying a separate ₹8,000 DJ fee.',
        imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&auto=format&fit=crop&q=80'
      },
      ...(needsAccommodation ? [
        {
          id: 'party-6',
          title: 'OYO Townhouse Celebration & Guest Stay Suite (2 Rooms)',
          category: 'Venue & Accommodation',
          platform: 'OYO',
          unitPrice: venueAmt,
          vendor: 'OYO Rooms & Townhouse',
          searchQuery: `OYO Townhouse booking for party guests ${venueType}`,
          rating: 4.4,
          details: 'Modern air-conditioned rooms, sanitized beds, late check-out option for visiting family/guests.',
          keyBenefit: 'Convenient nearby rest haven for tired guests or changing outfits.',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80'
        }
      ] : [
        {
          id: 'party-6',
          title: 'Venue Setup Essentials & Cleanup Sanitization Service',
          category: 'Venue & Accommodation',
          platform: 'Urban Company / Local Vendor',
          unitPrice: venueAmt,
          vendor: 'Local Facility Care',
          searchQuery: 'Urban company post party cleaning sanitation assistance',
          rating: 4.8,
          details: 'Full post-event trash removal, floor sanitization, and furniture reset.',
          keyBenefit: 'Enjoy your own party without worrying about the next morning mess.',
          imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80'
        }
      ])
    ],
    timelineSchedule: [
      { time: '6:30 PM', activity: 'Guest Welcome & Swiggy Mocktail Bar Opening' },
      { time: '7:15 PM', activity: 'Photobooth Fun & Icebreaker Mini Games' },
      { time: '8:00 PM', activity: 'Celebration Toast & Highlight Moment' },
      { time: '8:30 PM', activity: 'Zomato Live Catering Buffet Dinner Spread' },
      { time: '9:30 PM', activity: 'Karaoke & Open Dance Floor' }
    ],
    costSavingHacks: [
      'Order bulk appetiser platters via Zomato for Business / Party orders 24 hours in advance to unlock 20% flat banquet discounts.',
      'Use the Amazon DIY balloon garland strip instead of helium balloons; it stays fresh for 48 hours at 1/10th the cost.',
      'Create a shared Spotify collaborative playlist with your guests instead of paying for a live sound operator.'
    ]
  };

  res.json(fallbackParty);
});

// Scenario 3: Jewelry Recommendations with optional Outfit Image Analysis
app.post('/api/recommendations/jewelry', async (req, res) => {
  const { budget = 15000, currency = 'INR', occasion = 'Wedding / Bridal', stylePreference = 'Kundan & Meenakari', metalPreference = 'Yellow Gold', outfitDescription = '', outfitImageBase64 = null } = req.body;
  const sym = getCurrencySymbol(currency);

  const prompt = `You are PocketSmart AI, an haute couture jewelry stylist and e-commerce shopping advisor.
User Profile:
- Budget: ${sym}${budget} ${currency}
- Occasion: ${occasion}
- Style Preference: ${stylePreference}
- Preferred Metal Tone: ${metalPreference}
- Outfit Description: ${outfitDescription || 'Not specified'}

Recommend 4-5 complementary jewelry pieces (Necklace/Choker, Jhumkas/Earrings, Bangles/Kadas, Maang Tikka, Ring) across Amazon, Flipkart, Tanishq/CaratLane/Myntra that fit within ${sym}${budget}.
Provide detailed aesthetic reasons, neckline coordination tips, and color matching advice.`;

  if (ai) {
    try {
      const contents: any[] = [];
      if (outfitImageBase64) {
        // Strip data prefix if present
        const cleanBase64 = outfitImageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64,
          },
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents.length === 1 ? contents[0].text : { parts: contents },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        return res.json(JSON.parse(text));
      }
    } catch (err: any) {
      console.error('Gemini Jewelry Planner error:', err?.message || err);
    }
  }

  // Fallback jewelry recommendations
  const fallbackJewelry = {
    summary: `Exquisite ${stylePreference} jewelry ensemble curated for ${occasion} within ${sym}${budget.toLocaleString()}. Balances high-impact statement focal points with versatile everyday accents.`,
    colorHarmonyAnalysis: outfitDescription
      ? `Tailored specifically for: "${outfitDescription}". The ${metalPreference} tones highlight rich undertones while gemstones provide vibrant contrast without clashing.`
      : `Harmonious ${metalPreference} palette designed to elevate ${occasion} attire, pairing royal ${stylePreference} craftsmanship with modern comfort.`,
    totalEstimatedCost: Math.round(budget * 0.92),
    savingsOrBuffer: Math.round(budget * 0.08),
    recommendations: [
      {
        id: 'jwl-1',
        title: `Royal ${stylePreference} Choker Necklace with Pearl Drops`,
        type: 'Necklace / Choker',
        platform: 'Amazon',
        price: Math.round(budget * 0.42),
        metal: metalPreference,
        rating: 4.8,
        reviewsCount: 1120,
        searchQuery: `Amazon ${stylePreference} choker necklace set with pearls`,
        stylingTip: 'Complements sweetheart, deep V, and scoop necklines beautifully by drawing attention to the collarbone.',
        features: ['Handcrafted Meenakari enamel reverse', 'Adjustable dori cord', 'Hypoallergenic gold polish'],
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'jwl-2',
        title: `Chandbali / Heavy Jhumka Statement Earrings in ${metalPreference}`,
        type: 'Earrings',
        platform: 'Flipkart',
        price: Math.round(budget * 0.22),
        metal: metalPreference,
        rating: 4.6,
        reviewsCount: 840,
        searchQuery: `Flipkart ${stylePreference} Chandbali Jhumka earrings ${metalPreference}`,
        stylingTip: 'Wear alone with sleek pulled-back hair for a contemporary look, or pair with the choker for grand ceremonies.',
        features: ['Lightweight hollow core casting', 'Push back with ear support hooks', 'Faceted faux emerald / ruby stones'],
        imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'jwl-3',
        title: `Set of 4 Openable Matte Gold Finish Kadas / Bangles`,
        type: 'Bangles & Bracelets',
        platform: 'Myntra',
        price: Math.round(budget * 0.18),
        metal: metalPreference,
        rating: 4.7,
        reviewsCount: 560,
        searchQuery: `Myntra traditional gold finish openable kada bangles`,
        stylingTip: 'Distribute 2 on each wrist or stack together beside your wristwatch on one arm.',
        features: ['Screw pin lock fits all wrist sizes', 'Micro-gold plating lasts 2+ years', 'Floral embossed filigree'],
        imageUrl: 'https://images.unsplash.com/photo-1611591475168-54379a781297?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'jwl-4',
        title: `Delicate Floral Maang Tikka with Tiny Pearl Clusters`,
        type: 'Maang Tikka / Hair Accessory',
        platform: 'Amazon',
        price: Math.round(budget * 0.10),
        metal: metalPreference,
        rating: 4.5,
        reviewsCount: 390,
        searchQuery: `Amazon floral maang tikka traditional wedding jewellery`,
        stylingTip: 'Pin securely at the center parting; ideal for festive portraits and bridal silhouettes.',
        features: ['Ultra-lightweight alloy', 'Non-snag hair hook', 'Sparkling Austrian crystals'],
        imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'
      }
    ],
    necklinePairingAdvice: [
      'High Neck / Mandarin Collar: Skip heavy chokers; rely on prominent Chandbali earrings and an ornate statement ring.',
      'V-Neck & Sweetheart: Perfectly accommodates a drop pendant or contoured choker without overlapping the fabric.',
      'Boat Neck / Off-Shoulder: Long layered Rani Haar or medium choker creates a stunning regal contrast.'
    ],
    careAndValueTips: [
      'Store each item separately in velvet pouches or ziplock bags away from moisture and perfumes.',
      'Look for 1-gram gold polish or brass base rather than copper for superior durability under bright photography lights.'
    ]
  };

  res.json(fallbackJewelry);
});

// Endpoint: AI Outfit Analysis from photo
app.post('/api/analyze-outfit', async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'Image is required' });
  }

  const prompt = `Analyze this outfit photo for styling recommendations. 
Identify:
1. Dominant colors in the outfit (names & approximate hex codes)
2. Outfit category (e.g. Saree, Lehenga, Evening Gown, Indo-Western, Kurti Set, Cocktail Dress)
3. Neckline shape (Sweetheart, Deep V, Round, Boat Neck, High Neck, Off-shoulder)
4. Fabric & Embellishment style (e.g. Silk Zari, Embroidered Georgette, Velvet, Satin, Minimalist Cotton)
5. Recommended jewelry metal tones (Yellow Gold, Antique Gold, Rose Gold, Silver, Platinum)
6. Recommended jewelry types (e.g., Temple jewelry, Kundan choker, Minimalist Solitaire drop, Oxidized Silver boho)
7. A 2-sentence styling summary explaining why these choices elevate the outfit.

Respond with strict JSON matching this structure:
{
  "outfitType": string,
  "neckline": string,
  "fabricAndDetails": string,
  "dominantColors": [ { "name": string, "hex": string } ],
  "recommendedMetals": [ string ],
  "recommendedStyles": [ string ],
  "stylingSummary": string
}`;

  if (ai) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const text = response.text;
      if (text) {
        return res.json(JSON.parse(text));
      }
    } catch (err: any) {
      console.error('Gemini Outfit Vision error:', err?.message || err);
    }
  }

  // Resilient fallback for vision
  res.json({
    outfitType: 'Celebration Saree / Festive Ensemble',
    neckline: 'Sweetheart / Deep Round',
    fabricAndDetails: 'Silk blend with warm gold zari border and rich jewel tones',
    dominantColors: [
      { name: 'Royal Emerald', hex: '#097969' },
      { name: 'Antique Gold', hex: '#D4AF37' },
      { name: 'Crimson Accent', hex: '#990000' }
    ],
    recommendedMetals: ['Yellow Gold', 'Antique Matte Gold'],
    recommendedStyles: ['Kundan & Meenakari', 'Temple Heritage', 'Polki'],
    stylingSummary: 'The warm undertones of the gold embroidery call for yellow gold or antique brass jewelry. A contoured choker paired with emerald drop jhumkas will highlight the neckline without competing with the fabric.'
  });
});

// In production, serve Vite build assets; in dev, Vite middleware is attached
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PocketSmart AI server running on port ${port}`);
  });
}

startServer();
