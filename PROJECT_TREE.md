# 📁 OVACP Frontend - Komplette Projektstruktur

```
ovacp_frontend/
│
├── 📄 package.json
├── 📄 vite.config.ts
├── 📄 tsconfig.json
├── 📄 index.html
├── 📄 README.md
├── 📄 STRUCTURE.md               ← Ausführliche Dokumentation
├── 📄 RESTRUCTURE_SUMMARY.md     ← Reorganisations-Summary
│
└── 📂 src/
    │
    ├── 📄 App.tsx               ← Root Component (UPDATED)
    ├── 📄 main.tsx              ← Entry Point
    ├── 📄 index.css             ← Tailwind Imports
    │
    ├── 📂 features/             ⭐ Feature-Based Modules
    │   │
    │   ├── 📂 auth/             🔐 Authentifizierung
    │   │   ├── LoginDialog.tsx
    │   │   ├── RegisterDialog.tsx
    │   │   └── index.ts         (Barrel Export)
    │   │
    │   ├── 📂 layout/           🎨 Layout
    │   │   ├── Navbar.tsx
    │   │   └── index.ts         (Barrel Export)
    │   │
    │   ├── 📂 dashboard/        📊 Dashboard
    │   │   ├── ChartDisplay.tsx
    │   │   ├── QueryInput.tsx
    │   │   └── index.ts         (Barrel Export)
    │   │
    │   ├── 📂 csv-upload/       📁 CSV Upload
    │   │   ├── CsvUpload.tsx
    │   │   └── index.ts         (Barrel Export)
    │   │
    │   └── 📂 analysis/         🔍 Analysis
    │       ├── AnalysisDisplay.tsx
    │       └── index.ts         (Barrel Export)
    │
    ├── 📂 components/           🧩 UI-Komponenten
    │   │
    │   ├── 📂 figma/
    │   │   └── ImageWithFallback.tsx
    │   │
    │   └── 📂 ui/               (50+ Radix-UI Komponenten)
    │       ├── accordion.tsx
    │       ├── alert.tsx
    │       ├── alert-dialog.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input.tsx
    │       ├── input-otp.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toggle.tsx
    │       ├── toggle-group.tsx
    │       ├── tooltip.tsx
    │       ├── use-mobile.ts
    │       └── utils.ts
    │
    ├── 📂 hooks/                🪝 Custom React Hooks
    │   ├── useAuth.ts           (Auth State Management)
    │   ├── useCsvUpload.ts      (CSV Upload Logic)
    │   ├── useQuery.ts          (Query State Management)
    │   └── index.ts             (Barrel Export)
    │
    ├── 📂 services/             ⚙️ Business Logic
    │   ├── analysisService.ts   (Analyse-Generierung)
    │   └── chartService.ts      (Chart-Daten-Verarbeitung)
    │
    ├── 📂 types/                📘 TypeScript Types
    │   └── index.ts
    │       ├── ChartDataPoint
    │       ├── User
    │       ├── AuthCredentials
    │       ├── QueryInputProps
    │       ├── AnalysisResult
    │       ├── CsvUploadResult
    │       └── ...
    │
    ├── 📂 constants/            🔧 Konstanten
    │   ├── chartData.ts
    │   │   ├── DEFAULT_CHART_DATA
    │   │   ├── Q1_DATA
    │   │   └── YEAR_DATA
    │   └── appConfig.ts
    │       ├── APP_NAME
    │       ├── APP_SUBTITLE
    │       ├── API_BASE_URL
    │       └── TOAST_DURATION
    │
    ├── 📂 utils/                🛠️ Utility Functions
    │   └── (bereit für Validators, Formatters, etc.)
    │
    └── 📂 styles/               🎨 CSS
        └── globals.css
```

---

## 🔍 Detailierte Beschreibung

### Features (Feature-Based Modules)
Jedes Feature ist unabhängig und selbstständig:

```typescript
// Einfache, saubere Imports
import { LoginDialog, RegisterDialog } from "@/features/auth";
import { Navbar } from "@/features/layout";
import { ChartDisplay, QueryInput } from "@/features/dashboard";
import { CsvUpload } from "@/features/csv-upload";
import { AnalysisDisplay } from "@/features/analysis";
```

### Components/UI
Radix-UI Komponenten für eine konsistente UI:
- 50+ vorkonfigurierte Komponenten
- Vollständig angepassbar mit Tailwind CSS
- Zugänglich und benutzerfreundlich

### Hooks
Custom React Hooks für State Management:
```typescript
const { isAuthenticated, user, login, register, logout } = useAuth();
const { uploadCsv, isLoading, error } = useCsvUpload();
const { query, isLoading, submitQuery, clearQuery } = useQuery();
```

### Services
Pure Business Logic (keine React-Abhängigkeiten):
```typescript
import { generateAnalysis } from "@/services/analysisService";
import { formatChartData, filterChartDataByQuery } from "@/services/chartService";
```

### Types
Zentrale TypeScript-Definitionen:
```typescript
import type { User, ChartDataPoint, AnalysisResult } from "@/types";
```

### Constants
Hartcodierte Daten und Konfiguration:
```typescript
import { DEFAULT_CHART_DATA, YEAR_DATA } from "@/constants/chartData";
import { APP_NAME, API_BASE_URL } from "@/constants/appConfig";
```

---

## 🎯 Vorteile dieser Struktur

| Aspekt | Vorteil |
|--------|---------|
| **Wartbarkeit** | Features sind isoliert und einfach zu modifizieren |
| **Skalierbarkeit** | Neue Features können schnell hinzugefügt werden |
| **Testbarkeit** | Services haben keine Side Effects (einfach zu testen) |
| **Team-Arbeit** | Jeder kann an einem Feature unabhängig arbeiten |
| **Code-Sharing** | Hooks und Services sind einfach zu teilen |
| **Performance** | Besseres Tree-Shaking mit Barrel Exports |
| **Lesbarkeit** | Path Aliases machen Imports lesbar und wartbar |

---

## 📝 Naming Conventions

### Feature-Ordner
- Kebab-case: `csv-upload`, `chart-display`

### Komponenten-Dateien
- PascalCase: `LoginDialog.tsx`, `ChartDisplay.tsx`

### Hooks
- camelCase mit "use"-Präfix: `useAuth.ts`, `useCsvUpload.ts`

### Services
- camelCase: `analysisService.ts`, `chartService.ts`

### Types/Interfaces
- PascalCase: `User`, `ChartDataPoint`, `AnalysisResult`

### Constants
- SCREAMING_SNAKE_CASE: `DEFAULT_CHART_DATA`, `API_BASE_URL`

---

## 🚀 Schnellstart für neue Features

```bash
# 1. Erstelle Feature-Ordner
mkdir -p src/features/my-feature

# 2. Erstelle Komponente
touch src/features/my-feature/MyFeature.tsx

# 3. Erstelle Barrel Export
touch src/features/my-feature/index.ts

# 4. Exportiere
# src/features/my-feature/index.ts
export { MyFeature } from "./MyFeature";

# 5. Verwende in App.tsx
import { MyFeature } from "@/features/my-feature";
```

---

## 📊 Statistiken

| Metrik | Wert |
|--------|------|
| Features | 5 |
| Custom Hooks | 3 |
| Services | 2 |
| UI Components | 50+ |
| Types | 10+ |
| Constants | 2 |
| Total Files (ts/tsx) | 79 |

---

**Letzte Aktualisierung:** 17.03.2026  
**Status:** ✅ Production Ready

