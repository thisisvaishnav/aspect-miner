# AspectMiner — Product Review Analytics

AspectMiner is a full-stack web app that extracts product *aspects* (e.g., battery, camera, price) from customer reviews, performs sentiment analysis, and generates AI-powered insights (optional) using Google Gemini.

## Features

- **Live Aspect Analyzer**: Paste a review and extract aspects with sentiment polarity.
- **Aggregate Dashboard**: Visualize aspect rankings with positive/negative breakdown.
- **AI Support Reply (optional)**: Draft responses to customer reviews using Gemini.
- **AI Executive Insights (optional)**: Automated product health analysis and R&D recommendations.

## Tech Stack

- **Frontend**: React (Vite) + TypeScript + TailwindCSS
- **Backend**: Node.js + Express (TypeScript)
- **NLP / AI**: Aspect extraction + sentiment analysis services, with optional Google Gemini integration

## Repository Structure

```text
aspect-miner/
├── frontend/              # React frontend (Vite + TypeScript + TailwindCSS)
│   ├── src/
│   │   ├── components/    # UI components (Sidebar, LiveAnalyzer, Dashboard, etc.)
│   │   ├── services/      # API client layer
│   │   └── types/         # Shared TypeScript types
│   └── vite.config.ts     # Vite config with API proxy
├── backend/               # Express backend (TypeScript)
│   └── src/
│       ├── routes/        # API endpoints (analyze, dashboard, ai)
│       └── services/      # Business logic (NLP, Gemini, dashboard data)
└── package.json           # Project dependencies / scripts
```

## API Endpoints

| Method | Endpoint           | Description                           |
| ------ | ------------------ | ------------------------------------- |
| POST   | `/api/analyze`     | Extract aspects & sentiment from text |
| GET    | `/api/dashboard`   | Aggregated aspect sentiment data      |
| POST   | `/api/ai/generate` | Generate AI content via Gemini        |
| GET    | `/api/health`      | Health check                          |

## Getting Started

### Prerequisites

- Node.js **18+**
- npm
- (Optional) Google Gemini API key for AI features

### Install

```bash
git clone https://github.com/thisisvaishnav/aspect-miner.git
cd aspect-miner

# Install deps (run from repo root)
npm install
```

### Configure (optional, for AI features)

Create an `.env` file for the backend (or copy from an example if present):

```bash
# Example
GEMINI_API_KEY=your_key_here
```

### Run in Development

**Terminal 1 — Backend (Express, port 8000):**

```bash
npm run dev:server
```

**Terminal 2 — Frontend (Vite, port 5173):**

```bash
npm run dev
```

The Vite dev server proxies `/api/*` requests to the Express backend.

### Build for Production

```bash
# Frontend
npm run build

# Backend
npm run build:server
```

## Notes

- If you are deploying, ensure your environment variables are set securely.
- If the AI endpoints are enabled, Gemini requests require a valid API key.
