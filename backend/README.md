# FitForge AI — Backend

AI gym trainer platform API built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your own values:
   ```bash
   cp .env.example .env
   ```

3. Seed the database with sample gyms:
   ```bash
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000` (or the `PORT` you configure).

## Environment Variables

See `.env.example` for the full list: `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`,
`OPENAI_API_KEY`, `OPENAI_MODEL`, `CLIENT_URL`.

## API Routes

- `/api/auth` — register, login, me
- `/api/users` — profile, calories, diet-plan, workout-plan, chat
- `/api/trainers` — public trainer listing & profiles
- `/api/hire-requests` — create/list/update hire requests
- `/api/gyms` — gym listing
- `/api/admin` — stats, users, hire requests (admin only)
