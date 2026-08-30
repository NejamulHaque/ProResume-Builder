# 🚀 ProResume Builder — Full Cloud Deployment & Security Guide

This guide walks you through deploying **ProResume Builder** to the internet with full security, auto-scaling, and live Neon PostgreSQL cloud database integration.

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   ProResume Builder                    │
├────────────────────────────┬───────────────────────────┤
│ Frontend (Vercel/Netlify)  │ React 18, Vite, Overleaf  │
│ Backend  (Render/Railway)  │ Express, Rate-Limiting    │
│ Database (Neon PostgreSQL) │ Serverless PostgreSQL     │
│ AI Engine (IRUS AI)        │ https://irus-ai.onrender  │
└────────────────────────────┴───────────────────────────┘
```

---

## ⚡ Option A: 1-Click Frontend Deployment (Vercel)

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New Project** → Select your repository: `https://github.com/NejamulHaque/ProResume-Builder`.
3. Configure Project Settings:
   - **Root Directory:** `./` (or `frontend`)
   - **Build Command:** `npm run build --prefix frontend` (or `npm run build`)
   - **Output Directory:** `frontend/dist` (or `dist`)
4. Environment Variables:
   - `VITE_API_URL`: Your backend URL (e.g. `https://proresume-api.onrender.com/api` or leave blank for offline local store)
5. Click **Deploy**. Your frontend is live with automatic SSL, global CDN, and SPA routing!

---

## 🛡️ Option B: Backend Deployment (Render)

1. Go to **[render.com](https://render.com)** and click **New +** → **Web Service**.
2. Connect your repository: `NejamulHaque/ProResume-Builder`.
3. Configure Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   ```env
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-proresume-app.vercel.app
   ADMIN_EMAIL=nejamulhaque.works@gmail.com
   DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Click **Create Web Service**.

---

## 🐘 Option C: Database Setup (Neon Serverless PostgreSQL)

1. Create a free database at **[neon.tech](https://neon.tech)**.
2. Copy the **Connection String** (`postgresql://...`).
3. Set `DATABASE_URL` in your backend environment variables.
4. The backend automatically creates the `resumes`, `profiles`, and `resume_views` tables on first startup, and initiates the **10-day ephemeral auto-delete privacy worker**!

---

## 🔒 Security Features in Production

- **Ephemeral 10-Day Retention**: Automatically purges old resumes every 30 minutes to protect candidate privacy.
- **Helmet HTTP Headers**: X-Frame-Options, X-Content-Type-Options nosniff, and strict referrer policies.
- **DDoS & Brute-Force Rate Limiting**: `express-rate-limit` on all write and admin routes.
- **Row-Level Security & Parameterized SQL**: Zero SQL injection vulnerabilities with full user isolation.
- **Admin Lockdown**: Admin analytics and controls are restricted to `nejamulhaque.works@gmail.com`.
- **Zero-Crash Graceful Offline Fallback**: If backend services are sleeping or cold-starting, users can still build, edit, and export resumes with zero downtime using local sandboxed storage.
