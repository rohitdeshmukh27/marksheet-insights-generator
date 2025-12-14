# Marksheet Insights Generator

A small app to extract marks/grades from uploaded CSV/PDF files, analyze class statistics, and generate AI-powered insights and recommendations.

**Features**
- Parse CSV and PDF marksheets (backend). 
- Compute class statistics, top/bottom performers, weak subjects.
- Send compact, structured data to a Google Gemini model for natural-language insights.
- Frontend shows a dashboard with AI insights, recommendations, and charts.

**Quickstart (dev)**

Prerequisites:
- Node.js 18+ and npm
- Google Gemini API key (see below)

1. Backend

- Create `.env` from example and add keys: [backend/.env.example](backend/.env.example)

```bash
cd backend
cp .env.example .env
# then edit .env to add GEMINI_API_KEY and Supabase keys
npm install
npm start
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend dev server (Vite will show the URL, typically `http://localhost:5173`).

**Environment / LLM**
- The backend reads `GEMINI_API_KEY` and `GEMINI_MODEL` from [backend/.env](backend/.env).
- By default we send compact, structured JSON to the LLM (see [backend/lib/generateInsights.js](backend/lib/generateInsights.js)) to minimize token usage.

**Where to look**
- API route that handles uploads and analysis: [backend/routes/analyze.js](backend/routes/analyze.js)
- CSV/PDF parsing: [backend/lib/parseCSV.js](backend/lib/parseCSV.js), [backend/lib/parsePDF.js](backend/lib/parsePDF.js)
- Stats calculation: [backend/lib/analyzeStats.js](backend/lib/analyzeStats.js)
- LLM wrapper: [backend/lib/generateInsights.js](backend/lib/generateInsights.js)
- Frontend Results/dashboard: [frontend/src/components/Results.jsx](frontend/src/components/Results.jsx)

**Notes & Troubleshooting**
- If the LLM returns non-JSON text, the backend falls back to a concise local summary.

**More Improvements can be done by**
- Improve prompt engineering in `generateInsights.js` for more structured outputs.
- Add tests for parsing & stats.
- Add storing of results on the users account
- Retrieve past analysis on dashboard
- Dashboard with all previous tests and students topper scoring consistently
---