# FitForge AI — Frontend

An AI gym trainer platform frontend built with Next.js 14 (App Router), plain JavaScript, Tailwind CSS, and hand-written shadcn/ui-style components (Radix UI primitives).

## Features

- Public landing page with hero, feature highlights, and CTAs
- Auth (login/register) with role-based registration fields (User / Trainer / Admin)
- Role-aware protected dashboard:
  - **User**: profile, calorie & diet plan, muscle-specific workout tutorials & 5-day split, AI chat, trainer directory + hire flow, hire request tracking, gym search
  - **Trainer**: profile, incoming hire requests (accept/reject)
  - **Admin**: platform stats, user management, all hire requests
- Axios instance with automatic `Authorization: Bearer <token>` header from `localStorage`
- Client-side `RequireAuth` guard with role restrictions

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment example and point it at your backend:
   ```bash
   cp .env.example .env.local
   ```
   By default this expects the backend to be running at `http://localhost:5000/api` (see `NEXT_PUBLIC_API_URL`).
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

> This frontend expects the FitForge AI backend (built separately) to be running and implementing the documented API contract at the URL configured in `NEXT_PUBLIC_API_URL`.

## Tech Stack

- Next.js 14 (App Router, JavaScript only — no TypeScript)
- Tailwind CSS with a shadcn-style CSS-variable theme
- Radix UI primitives (Select, Dialog, Tabs, Avatar, Label)
- class-variance-authority, clsx, tailwind-merge
- lucide-react icons
- axios for API calls

## Project Structure

```
app/                  Next.js App Router pages
  page.js             Landing page
  login/              Login page
  register/           Register page
  dashboard/          Protected dashboard shell + role-aware pages
components/
  ui/                 Hand-written shadcn-style primitives
  Navbar.jsx, Sidebar.jsx, RequireAuth.jsx, TrainerCard.jsx,
  GymCard.jsx, ChatBubble.jsx, MuscleSelector.jsx
context/
  AuthContext.js      Auth state, login/register/logout, localStorage persistence
  ToastContext.js      Lightweight toast notifications
lib/
  api.js              Axios instance with auth interceptor
  utils.js            cn() className helper
```
