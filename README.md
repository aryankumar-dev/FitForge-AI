# FitForge AI

An AI-assisted gym trainer platform with three roles — user, trainer, and admin.

## Structure

- `backend/` — Node.js + Express + MongoDB API
- `frontend/` — Next.js 14 (App Router) + Tailwind + shadcn-style UI

## Features

- Role-based registration/login (user, trainer, admin) with JWT auth
- User health profile (weight, height, gender, target weight, goal) with BMR/TDEE calorie calculation (Mifflin-St Jeor, no AI needed)
- Rule-based Indian veg/non-veg daily diet plans generated from calorie target
- AI health chatbot restricted to health/fitness topics (funny deflection for anything else)
- Muscle-group workout tutorials (YouTube) + fixed 5-day workout split
- Hire-a-trainer flow: browse trainers, send hire request, trainer accepts/rejects, admin sees everything
- SMTP email notifications (bcc admin) at each stage: registration, hire request, hire accept/reject
- Top-rated gyms by area

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MongoDB URI, JWT secret, SMTP creds, OpenAI key, admin email
npm run seed            # seeds sample gyms
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL (defaults to http://localhost:5000/api)
npm run dev
```

Frontend runs on http://localhost:3000, backend on http://localhost:5000 by default.
