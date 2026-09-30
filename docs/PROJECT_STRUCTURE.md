# PocketSmart AI: Complete Project Directory Architecture

```
pocketsmart-ai/
├── backend/                       # Python FastAPI & Jinja Template Engine Backend
│   ├── main.py                    # FastAPI application with REST endpoints
│   ├── requirements.txt           # Python dependencies (FastAPI, uvicorn, jinja2, google-genai)
│   └── templates/                 # Jinja2 template files
│       └── budget_report.html     # HTML budget summary rendered with Jinja2
│
├── docs/                          # Project Documentation for Mentors & Evaluators
│   ├── PROJECT_STRUCTURE.md       # Directory layout and architecture guide
│   ├── SYSTEM_REQUIREMENTS.md     # Minimum hardware and software requirements
│   └── MENTOR_REVIEW_GUIDE.md     # Step-by-step evaluation guide for mentors
│
├── src/                           # React 19 + TypeScript + Tailwind CSS Frontend
│   ├── components/                # Modular UI Components
│   │   ├── CartDrawer.tsx         # Budget burn-down & saved items slide-over
│   │   ├── HomePlanner.tsx        # Scenario 1: Home Interior Budget Allocation
│   │   ├── JewelryPlanner.tsx     # Scenario 3: Jewelry & Outfit Matching Studio
│   │   ├── MentorBanner.tsx       # Alert banner prompting demo & GitHub links update
│   │   ├── Navbar.tsx             # Global navigation bar with currency picker
│   │   ├── OverviewHero.tsx       # Landing overview & scenario launcher
│   │   ├── PartyPlanner.tsx       # Scenario 2: AI-Based Party & Event Planner
│   │   ├── ProjectLinksModal.tsx  # Modal to update demo URL, GitHub & mentor
│   │   ├── TechnicalArchitecture.tsx # System requirements & pipeline specs
│   │   └── WorkspaceKanban.tsx    # 8 Epics & 16 Tasks Agile Kanban board
│   │
│   ├── types/                     # TypeScript Interfaces & Definitions
│   │   └── index.ts               # Budget models, recommendations, epics, tasks
│   │
│   ├── utils/                     # Helper Utilities
│   │   └── formatters.ts          # Currency formatter & deep search link generators
│   │
│   ├── App.tsx                    # Root React Application
│   ├── index.css                  # Global Tailwind CSS import
│   └── main.tsx                   # React DOM root entry point
│
├── .env.example                   # Environment variables template (GEMINI_API_KEY)
├── index.html                     # HTML5 entry with synced metadata
├── metadata.json                  # AI Studio project metadata & capabilities
├── package.json                   # Node.js dependencies & full-stack scripts
├── server.ts                      # Express full-stack server with Vite middleware & Gemini API
├── tsconfig.json                  # TypeScript compiler configuration
└── vite.config.ts                 # Vite bundler configuration
```

## Running the Application
1. **Full-Stack Express + Vite (Development)**:
   ```bash
   npm install
   npm run dev
   ```
2. **Python FastAPI Backend (Optional microservice)**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
