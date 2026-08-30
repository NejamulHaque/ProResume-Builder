# 📄 ProResume Builder — AI Resume & Overleaf LaTeX Engine

[![GitHub stars](https://img.shields.io/github/stars/NejamulHaque/ProResume-Builder?style=social)](https://github.com/NejamulHaque/ProResume-Builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-00d4aa.svg)](https://neon.tech)
[![Overleaf](https://img.shields.io/badge/LaTeX-Overleaf_Engine-10b981.svg)](https://overleaf.com)
[![IRUS AI](https://img.shields.io/badge/AI_Engine-IRUS_AI-7c6fff.svg)](https://irus-ai.onrender.com)

> **ProResume Builder** is a privacy-first, professional resume engineering suite featuring **Overleaf-grade LaTeX compilation**, **IRUS AI smart rewriting**, **Neon serverless PostgreSQL** storage, and automated **10-day ephemeral privacy auto-purge**.

---

## ✨ Features

- ⌨️ **Overleaf LaTeX Code Editor**:
  - Live side-by-side LaTeX source code editing with `Cmd+Enter` / `Ctrl+Enter` recompile.
  - Standard **FAANG / Jake's Resume** LaTeX architecture with custom macros (`\resumeSubheading`, `\resumeItem`, `\resumeProjectHeading`).
  - Bi-directional synchronization: edits in Visual Form update LaTeX code, and edits in LaTeX update the visual resume.
  - 1-Click `.tex` file source export.

- 🤖 **IRUS AI Career Intelligence**:
  - AI Summary Generator with 4 tailored tones (Executive/Lead, Technical/Quantified, Startup/Product, High-Impact ATS).
  - In-line bullet point enhancer to turn descriptions into metric-driven impact statements.
  - Integrated with **[IRUS AI Platform](https://irus-ai.onrender.com)**.

- ✉️ **IRUS AI Cover Letter Generator**:
  - Synthesizes your real experiences and target company into a formatted cover letter with 1-click clipboard copy or `.txt` download.

- 🎨 **5 Recruiter-Grade Templates & Live Palette**:
  - *Modern*, *Minimal*, *Executive*, *Technical*, *Creative*.
  - Live theme accent color switcher (7 curated palettes) and typography engine (Modern Sans, Classic Serif, Code Mono).

- 🔒 **Security & Privacy by Design**:
  - **10-Day Ephemeral Retention**: Background worker automatically deletes old resumes from database every 30 minutes for maximum candidate confidentiality.
  - **DDoS & Rate Limiting**: Express rate limiters on all write endpoints.
  - **Helmet HTTP Security**: Strict Content Security Policy, XSS filtering, and Frame isolation.
  - **Admin Shield**: Super-admin console restricted exclusively to `nejamulhaque.works@gmail.com`.

- 🖨️ **High-DPI Vector PDF Export**:
  - Clean client-side vector printing preserving exact fonts, margins, and crisp lines.

---

## 🛠️ Quickstart (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/NejamulHaque/ProResume-Builder.git
cd ProResume-Builder
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend and backend dependencies
npm run install:all
```

### 3. Run both Frontend and Backend concurrently
```bash
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`

---

## ☁️ Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions on deploying:
- **Frontend:** Vercel / Netlify
- **Backend:** Render / Railway
- **Database:** Neon Serverless PostgreSQL

---

## 👤 Author & Credits

- **Creator & Lead Architect:** [Nejamul Haque](https://github.com/NejamulHaque)
- **Email:** [nejamulhaque.works@gmail.com](mailto:nejamulhaque.works@gmail.com)
- **AI Platform:** [IRUS AI (irus-ai.onrender.com)](https://irus-ai.onrender.com)
- **Repository:** [https://github.com/NejamulHaque/ProResume-Builder](https://github.com/NejamulHaque/ProResume-Builder)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
