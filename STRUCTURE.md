# 📁 Neue Projektstruktur OVACP Frontend

## Überblick

Das Projekt wurde vollständig reorganisiert in eine **Feature-Based Architecture** mit klarer **Separation of Concerns**. Dies erhöht die Wartbarkeit, Skalierbarkeit und Testbarkeit.

## 🗂️ Projektstruktur

```
src/
├── features/                    # Feature-Module (Geschäftslogik)
│   ├── auth/                   # Authentifizierung (Login/Register)
│   │   ├── LoginDialog.tsx
│   │   ├── RegisterDialog.tsx
│   │   └── index.ts           # Barrel Export
│   ├── dashboard/              # Dashboard (Chart & Query)
│   │   ├── ChartDisplay.tsx
│   │   ├── QueryInput.tsx
│   │   └── index.ts
│   ├── csv-upload/             # CSV Upload Feature
│   │   ├── CsvUpload.tsx
│   │   └── index.ts
│   ├── analysis/               # Analyse-Display
│   │   ├── AnalysisDisplay.tsx
│   │   └── index.ts
│   └── layout/                 # Layout (Navbar)
│       ├── Navbar.tsx
│       └── index.ts
├── components/                 # Wiederverwendbare UI-Komponenten
│   └── ui/                     # Radix-UI Komponenten
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── ... (weitere UI-Komponenten)
├── hooks/                      # Custom React Hooks (State Management)
│   ├── useAuth.ts             # Auth State Management
│   ├── useCsvUpload.ts        # CSV Upload Logic
│   ├── useQuery.ts            # Query State Management
│   └── index.ts               # Barrel Export
├── services/                   # Business Logic & API Integration
│   ├── analysisService.ts     # Analyse-Generierung
│   ├── chartService.ts        # Chart-Daten Verarbeitung
│   └── authService.ts         # (Später für API-Calls)
├── types/                      # TypeScript Interfaces & Types
│   └── index.ts               # Alle Type-Definitionen
├── constants/                  # Konstanten & Config
│   ├── chartData.ts           # Hartcodierte Chart-Daten
│   └── appConfig.ts           # App-Konfiguration
├── utils/                      # Utility-Funktionen
│   └── (validators, formatters, etc.)
├── styles/                     # Globale Styles
│   └── globals.css
├── App.tsx                     # Root Component
├── main.tsx                    # Entry Point
└── index.css                   # Import für Tailwind
```

## 🎯 Vorteile der neuen Struktur

### 1. **Feature-Based Organization**
- Jedes Feature ist selbstständig und verständlich
- Features können unabhängig entwickelt und getestet werden
- Leichtere Team-Zusammenarbeit (jedes Feature = 1 Person)

### 2. **Separation of Concerns**
- **Features**: UI-Komponenten mit Geschäftslogik
- **Hooks**: Reusable State Management Logic
- **Services**: Pure Business Logic (keine React-Abhängigkeiten)
- **Types**: Zentrale Type-Definitionen
- **Constants**: Hartcodierte Daten und Config

### 3. **Skalierbarkeit**
- Einfach neue Features hinzufügen
- Services vorbereitet für Backend-Integration
- Path Aliases (`@/`) für lesbare Imports

### 4. **Maintainability**
- Klare Dateiorganisation
- Barrel Exports (`index.ts`) für saubere Imports
- Logische Gruppierung verwandter Code

## 📝 Import-Beispiele

### Vor (Alt)
```typescript
import { Navbar } from "./components/navbar";
import { ChartDisplay } from "./components/chart-display";
import { LoginDialog } from "./components/login-dialog";
```

### Nach (Neu)
```typescript
import { Navbar } from "@/features/layout";
import { ChartDisplay, QueryInput } from "@/features/dashboard";
import { LoginDialog, RegisterDialog } from "@/features/auth";
import { useAuth } from "@/hooks/useAuth";
import { generateAnalysis } from "@/services/analysisService";
import { DEFAULT_CHART_DATA } from "@/constants/chartData";
import type { User } from "@/types";
```

## 🔧 Custom Hooks (State Management)

### `useAuth()`
Verwaltet Authentifizierungsstatus und Benutzerinformationen.

```typescript
const { isAuthenticated, user, login, register, logout } = useAuth();
```

### `useCsvUpload()`
Verwaltet CSV-Upload-Logik und Fehlerbehandlung.

```typescript
const { uploadCsv, isLoading, error } = useCsvUpload();
```

### `useQuery()`
Verwaltet Query-State für Suchanfragen.

```typescript
const { query, isLoading, submitQuery, clearQuery } = useQuery();
```

## 🛠️ Services (Business Logic)

### `analysisService.ts`
Generiert Analysen basierend auf Benutzeranfragen.
- Keine React-Abhängigkeiten
- Pure Functions - einfach zu testen

### `chartService.ts`
Hilfsfunktionen für Chart-Datenverarbeitung.
- Formatierung
- Filterung nach Query-Parametern

## 📦 Nächste Schritte

### 1. Backend-Integration
```typescript
// In services/authService.ts
export async function loginApi(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}
```

### 2. State Management mit Zustand/Redux
Wenn die App komplexer wird, können Sie zu Zustand oder Redux migrieren:
```typescript
// Hooks sind bereits vorbereitet für diese Migration
```

### 3. API-Integration in Services
Services sind **speziell** für API-Calls vorbereitet - keine React-Abhängigkeiten!

### 4. Testing
- Features können isoliert getestet werden
- Services haben keine Side Effects (einfach zu testen)
- Hooks können mit `@testing-library/react-hooks` getestet werden

## 📋 Checkliste für bestehende Dateien

- ✅ Auth-Features (Login/Register) → `features/auth/`
- ✅ Layout (Navbar) → `features/layout/`
- ✅ Dashboard (Chart, Query) → `features/dashboard/`
- ✅ CSV-Upload → `features/csv-upload/`
- ✅ Analysis → `features/analysis/`
- ✅ Custom Hooks → `hooks/`
- ✅ Services → `services/`
- ✅ Types → `types/`
- ✅ Constants → `constants/`
- ⏳ Utils → `utils/` (bei Bedarf)

## 🚀 Weitere Verbesserungen

```
// Potential Future Structure
src/
├── features/
│   ├── [feature-name]/
│   │   ├── components/     # Feature-spezifische Komponenten
│   │   ├── hooks/          # Feature-spezifische Hooks
│   │   ├── services/       # Feature-spezifische Services
│   │   ├── types/          # Feature-spezifische Types
│   │   └── index.ts
├── middleware/             # API-Interceptors, Error Handling
├── store/                  # Global State (wenn Zustand/Redux)
└── __tests__/              # Test-Dateien
    └── features/
        └── [feature-name].test.tsx
```

---

**Struktur-Update:** 17.03.2026  
**Version:** 1.0 (Clean Architecture)

