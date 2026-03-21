# AspectMiner — Product Review Analytics

A full-stack application that extracts product aspects from customer reviews and performs sentiment analysis using NLP techniques, with AI-powered insights via Google Gemini.

## Architecture

```
aspect-miner/
├── src/                  # React frontend (Vite + TypeScript + TailwindCSS)
│   ├── components/       # UI components (Sidebar, LiveAnalyzer, Dashboard, etc.)
│   ├── services/         # API client layer
│   └── types/            # Shared TypeScript types
├── server/               # Express backend (TypeScript)
│   └── src/
│       ├── routes/       # API endpoints (analyze, dashboard, ai)
│       └── services/     # Business logic (NLP, Gemini, dashboard data)
├── package.json          # Shared dependencies
├── vite.config.ts        # Vite config with API proxy
├── tsconfig.json         # Frontend TS config
└── tsconfig.server.json  # Backend TS config
```

## API Endpoints

| Method | Endpoint           | Description                            |
| ------ | ------------------ | -------------------------------------- |
| POST   | `/api/analyze`     | Extract aspects & sentiment from text  |
| GET    | `/api/dashboard`   | Get aggregated aspect sentiment data   |
| POST   | `/api/ai/generate` | Generate AI content via Gemini         |
| GET    | `/api/health`      | Health check                           |

## Getting Started

### Prerequisites

- Node.js 18+
- (Optional) Google Gemini API key for AI features

### Install

```bash
cd aspect-miner/frontend
npm install
```

### Configure (optional, for AI features)

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Run Development Servers

**Terminal 1 — Backend (Express on port 8000):**

```bash
npm run dev:server
```

**Terminal 2 — Frontend (Vite on port 5173):**

```bash
npm run dev
```

The Vite dev server proxies all `/api/*` requests to the Express backend automatically.

### Build for Production

```bash
# Frontend
npm run build

# Backend
npm run build:server
```

## Features

- **Live Aspect Analyzer**: Paste a review → extract aspects (battery, camera, price, etc.) with sentiment polarity
- **Aggregate Dashboard**: Visualize aspect rankings with positive/negative breakdown
- **AI Support Reply**: Gemini-powered draft responses to customer reviews
- **AI Executive Insights**: Automated product health analysis and R&D recommendations
