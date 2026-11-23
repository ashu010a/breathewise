# BreatheWise Application Architecture

## 1. System Overview

BreatheWise is built as a unified full-stack application using **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**. It combines a client-side reactive store with modular backend API routes and external atmospheric models.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Client UI                                 │
│  - React 18 / Next.js App Router (12 Pages)                            │
│  - Tailwind CSS + Lucide Icons + Responsive SVG Data Visualizations    │
│  - LocalStorage Persisted State (useUserStore hook)                    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js API Routes                              │
│  - /api/air-quality      : Multi-source environmental aggregator       │
│  - /api/recommendations  : Personalized routine & sanctuary planner    │
│  - /api/chat             : Multilingual conversational AI companion    │
│  - /api/impact           : IPCC-aligned carbon calculation engine      │
│  - /api/community        : Privacy-preserving community challenges     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Core Service Layer                             │
│  ├── aqi-standards.ts       : CPCB NAQI & US EPA interpolation math    │
│  ├── open-meteo-adapter.ts  : Copernicus CAMS atmospheric grid API     │
│  ├── waqi-adapter.ts        : WAQI sensor station network adapter      │
│  ├── recommendation-engine  : Deterministic safety rules & routines    │
│  ├── impact-calculator.ts   : Transport & energy emission calculations │
│  └── gemini-client.ts       : Gemini 1.5 & Expert Knowledge Engine     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   External Data Providers & APIs                       │
│  - Open-Meteo Air Quality & Weather API (Global, Free, Hourly Forecast)│
│  - World Air Quality Index / WAQI (Official Sensor Stations)           │
│  - Google Gemini 1.5 Flash / OpenRouter (Optional Live LLM Providers)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 6 Intelligence Layers

### Layer 1: Environmental Data Engine
- **Open-Meteo Air Quality Adapter:** Fetches global Copernicus CAMS atmospheric model data for PM2.5, PM10, NO2, SO2, CO, O3, hourly trends, and 3-day meteorological forecasts.
- **WAQI Adapter:** Optional integration with official ground-level monitoring stations (e.g. CPCB Anand Vihar, Delhi).
- **In-Memory Caching:** 10-minute TTL per coordinate grid to prevent rate limits and provide instant UI transitions.
- **Calibrated Offline Fallback:** When internet connectivity is unavailable, activates a calibrated atmospheric benchmark clearly tagged with `isSimulatedFallback: true`.

### Layer 2: Deterministic Safety & Recommendation Rules
- Evaluates severe winter smog thresholds:
  - If AQI ≥ 300 or PM2.5 ≥ 120 µg/m³: outdoor exercise suspended, mandatory N95 masking, exterior windows sealed.
  - If AQI between 101 and 200: moderate outdoor exertion, midday ventilation flush permitted.
- Critical safety invariants:
  - **Forbidden:** Ozone-generating purifiers, ionizers producing ozone, burning incense/coils in closed spaces, unvented fuel heaters.
  - **Health-First Policy:** Never recommend walking or cycling commutes when outdoor AQI is Unhealthy or Severe.

### Layer 3: Personalization Engine
- Tailors advice to:
  - Demographic vulnerability: children breathing rates, elderly cardiovascular sensitivity, registered asthma/COPD.
  - Living space: small apartment vs multi-story house.
  - Purifier equipment: True HEPA vs DIY Corsi-Rosenthal box vs no purifier.
  - Commute mode: private car (cabin recirculation) vs two-wheeler (N95 mask) vs metro.

### Layer 4: Generative AI Layer
- **Google Gemini 1.5 Flash / OpenRouter Integration:** Structured JSON system prompts incorporating live environmental context and household demographics.
- **Expert Fallback Engine:** Built-in deterministic rule engine that answers all key domain questions with citations and action tips even when no external AI key is configured.

### Layer 5: Explainable Impact Calculation Engine
- **IPCC Transport Baseline:**
  - Petrol car: $0.170\text{ kg CO}_2\text{e / km}$
  - Diesel SUV: $0.185\text{ kg CO}_2\text{e / km}$
  - Two-wheeler: $0.055\text{ kg CO}_2\text{e / km}$
  - Electric Metro: $0.028\text{ kg CO}_2\text{e / passenger-km}$
- **Central Electricity Authority Baseline:**
  - Grid electricity India: $0.720\text{ kg CO}_2\text{e / kWh}$
  - Grid electricity US: $0.380\text{ kg CO}_2\text{e / kWh}$
- **Attribution Guard:** Explicit distinction between avoided greenhouse gas emissions and ambient neighborhood AQI.

### Layer 6: Feedback & Adaptive Habit Logging
- LocalStorage client ledger storing completed routines, commute switches, and community challenge participation.

---

## 3. Data Schema & Contracts

### AirQualityData Contract
```typescript
interface AirQualityData {
  station: MonitoringStation;
  assessment: AqiAssessment;
  altStandardAssessments: Record<AqiStandard, { value: number; category: string }>;
  pollutants: {
    pm25: number; // µg/m³
    pm10: number; // µg/m³
    no2: number;  // µg/m³
    so2: number;  // µg/m³
    co: number;   // mg/m³
    o3: number;   // µg/m³
  };
  hourlyTrends: HourlyTrendPoint[];
  dailyForecasts: DailyForecastPoint[];
  weather: {
    temperatureC: number;
    humidityPercent: number;
    windSpeedKmh: number;
    windDirectionDeg: number;
    conditionText: string;
  };
}
```

### RoutineActionItem Contract (The 5 Core Explanation Criteria)
```typescript
interface RoutineActionItem {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  title: string;
  action: string;          // 1. What action should be taken?
  whyRecommended: string;  // 2. Why is it recommended?
  triggerCondition: string;// 3. What environmental condition triggered it?
  benefit: string;         // 4. What benefit can it provide?
  effortLevel: 'low' | 'medium' | 'high'; // 5. Effort level
  costEstimate: 'free' | 'low' | 'moderate' | 'investment'; // 5. Expense
  completed?: boolean;
}
```

---

## 4. Known Limitations & Future Roadmap

1. **Indoor Air Sensor Hardware Integration:** Current indoor estimates rely on outdoor infiltration modeling; future versions can pair directly with local MQTT/Bluetooth sensors (e.g. AirGradient, Awair).
2. **Push Notifications on Mobile Devices:** In-app notification center is complete; Web Push API (Service Worker with VAPID keys) can be enabled for background OS notifications.
3. **Hyperlocal Street-Level Dispersion:** Open-Meteo uses 11-km Copernicus grid cells; micro-climate street canyon modeling can be integrated with traffic flow data in future updates.
