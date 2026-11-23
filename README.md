# BreatheWise – AI-Powered Winter Smog & Urban Air Pollution Assistant

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald)](#)

> **BreatheWise** is an intelligent, personalized, and data-driven digital air quality companion designed for families, vulnerable individuals, and local communities navigating severe winter smog episodes and urban air pollution.

---

## 🌟 The Core Mission: 5 Fundamental Questions

BreatheWise moves beyond passive AQI numbers to provide concrete, explainable answers:

| # | Core Question | How BreatheWise Answers It |
|---|---------------|-----------------------------|
| **1** | **How safe or unhealthy is the air around me right now?** | Multi-pollutant real-time readings (PM2.5, PM10, NO2, SO2, CO, O3) using official India CPCB NAQI or US EPA standards with zero scale confusion. |
| **2** | **What should my family do today to reduce exposure?** | Smart Daily Routine Planner with time-blocked Morning, Afternoon, Evening, and Night actions tailored to children, seniors, and active commuters. |
| **3** | **How can I improve the quality of air inside my home?** | Safe ventilation window algorithms, True HEPA filtration maintenance guides, kitchen exhaust protocols, and room-specific sanctuaries. |
| **4** | **What everyday lifestyle changes can help reduce pollution?** | Sustainable alternatives engine comparing transit, heating, and waste habits with quantified cost and carbon emission savings. |
| **5** | **What measurable positive impact can my actions create?** | Explainable carbon & sustainability ledger tracking personal, household, and community CO2e avoided using IPCC-verified factors. |

---

## 🏛️ Hybrid Intelligence Architecture (6 Layers)

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 6: Feedback & Adaptive Habit Logging                      │
│ - Verified personal sustainability history, streak tracking     │
├─────────────────────────────────────────────────────────────────┤
│ Layer 5: Explainable Impact Calculation Engine                  │
│ - IPCC transport & Central Electricity Authority grid baselines │
│ - Clear distinction between avoided emissions & ambient AQI     │
├─────────────────────────────────────────────────────────────────┤
│ Layer 4: Generative AI Assistant (Gemini / OpenRouter / Expert) │
│ - Multilingual natural language companion (English, Hindi, etc.)│
│ - Authoritative citations (CPCB, WHO, US EPA) + Health Safety   │
├─────────────────────────────────────────────────────────────────┤
│ Layer 3: Personalization Engine                                 │
│ - Demographic profile: children, seniors, asthma/COPD, budget   │
│ - Housing architecture (small apartment vs villa)               │
├─────────────────────────────────────────────────────────────────┤
│ Layer 2: Deterministic Safety & Recommendation Rules            │
│ - Stagnant thermal inversion alerts, window sealing conditions  │
│ - Strict prohibitions (never ozone generators or open burning)  │
├─────────────────────────────────────────────────────────────────┤
│ Layer 1: Environmental Data Engine                              │
│ - Real-time Open-Meteo & Copernicus CAMS atmospheric grid       │
│ - Optional WAQI / CPCB sensor network adapter                   │
│ - In-memory caching + calibrated fallback with honest metadata  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Application Views & Features (12 Complete Pages)

1. **Landing Page (`/`)**: Hero banner, live metropolitan smog benchmark ticker, 5 core mission pillars, and module links.
2. **User Registration & Login (`/auth`)**: Fast 1-click evaluation accounts (Delhi family with asthma, Mumbai urban home) + custom registration.
3. **Personalized Onboarding (`/onboarding`)**: 4-step wizard capturing location, household demographics, lifestyle, and preferences.
4. **Air Quality Dashboard (`/dashboard`)**: Radial AQI gauge, pollutant cards with WHO comparisons, 24-hr diurnal trend chart, and 3-day forecast.
5. **Smart Daily Routine Planner (`/routine`)**: Morning, Afternoon, Evening, and Night routines with interactive completion tracking.
6. **Indoor Air Sanctuary (`/indoor`)**: Ventilation window calculator, True HEPA maintenance guidelines, kitchen exhaust protocols, and DIY Corsi-Rosenthal box guide.
7. **Sustainable Alternatives (`/sustainable`)**: Interactive commute calculator comparing fuel savings and kg CO2e avoided.
8. **Explainable Impact Tracker (`/impact`)**: Personal, household, and neighborhood carbon ledgers with documented IPCC factors.
9. **Community Movement (`/community`)**: Privacy-preserving neighborhood challenges (Clean Transit Triplet, Zero Burning Watch) and local municipal initiatives.
10. **Conversational AI Companion (`/assistant`)**: Natural language chat with preset prompt chips, bilingual support (English/Hindi), and source citations.
11. **Notifications Center (`/notifications`)**: Threshold alert rules, pre-filter maintenance alerts, and quiet hours configuration.
12. **Household Profile & Settings (`/profile`)**: Household composition editor, multi-location manager, and data export.

---

## 📐 Scientific Rigor & Health Safety

- **AQI Piecewise Linear Interpolation:** Uses official breakpoint formulas to prevent distortions.
- **Scale Integrity:** Clear toggle between Indian CPCB National AQI (0–500) and US EPA AQI (0–500). Never mixes scales silently.
- **Medical Responsibility:** Never diagnoses disease or prescribes drugs. Recommends physician consultation for acute respiratory distress.
- **Critical Safety Guardrails:** Strictly prohibits ozone-generating air cleaners, unvented kerosene heaters, and burning incense in sealed rooms.
- **Health-First Policy:** Never recommends outdoor cycling or walking when ambient AQI is Poor or Severe, even if it saves emissions.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18+ (tested on v20 and v26)
- npm 9+

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd breathewise
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure optional API keys:
- `GEMINI_API_KEY`: Google Gemini API key (optional; built-in expert AI engine works out-of-the-box if omitted).
- `OPENROUTER_API_KEY`: OpenRouter key for alternative LLM providers (optional).
- `WAQI_API_KEY`: World Air Quality Index token (optional; Open-Meteo free API is used by default).

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Build & Start Production Server
```bash
npm run build
npm start
```
The application will be live at `http://localhost:3000`.

For local development mode with hot reload:
```bash
npm run dev
```

---

## 🧪 Testing Summary

The test runner (`npm test`) verifies 5 core domains:
1. **AQI Standards & Breakpoints:** Evaluates CPCB and US EPA interpolation equations and category mappings.
2. **Recommendation Engine:** Verifies morning/afternoon/evening/night action plans, each with all 5 required explanatory properties (Action, Why, Trigger, Benefit, Effort/Cost).
3. **Carbon Impact Engine:** Validates travel savings formulas against IPCC factors (0.170 kg/km car vs 0.028 kg/km metro).
4. **Environmental Service Fallback:** Validates graceful offline benchmark fallback with 100% transparency.
5. **Conversational Assistant:** Validates context-aware bilingual responses (English/Hindi) and health disclaimers.

---

## 📄 License
MIT License. Built for public health, scientific responsibility, and community environmental empowerment.
"# breathewise" 
