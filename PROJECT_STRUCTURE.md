# OVACP Frontend - Projektstruktur & Dokumentation

## 📁 Verzeichnisstruktur

```
src/
├── components/
│   ├── figma/              # Figma-Integration
│   │   └── ImageWithFallback.tsx
│   └── ui/                 # Shadcn UI Komponenten (auto-generated)
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── card.tsx
│       ├── select.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── ... (weitere UI-Komponenten)
│
├── constants/              # Globale Konstanten
│   ├── appConfig.ts       # App-Konfiguration
│   └── chartData.ts       # Chart-Beispieldaten
│
├── features/              # Feature-basierte Module
│   ├── auth/              # Authentifizierung
│   │   ├── LoginDialog.tsx
│   │   ├── RegisterDialog.tsx
│   │   └── index.ts
│   │
│   ├── csv-upload/        # CSV Upload
│   │   ├── CsvUpload.tsx
│   │   └── index.ts
│   │
│   ├── dashboard/         # Dashboard & Charts
│   │   ├── ChartDisplay.tsx
│   │   ├── ChartSelector.tsx    # NEU: Chart-Typ Auswahl
│   │   ├── QueryInput.tsx
│   │   └── index.ts
│   │
│   ├── analysis/          # Datenanalyse
│   │   ├── AnalysisDisplay.tsx   # VERBESSERT: Markdown-Rendering
│   │   └── index.ts
│   │
│   └── layout/            # Layout-Komponenten
│       ├── Navbar.tsx
│       └── index.ts
│
├── hooks/                 # Custom React Hooks
│   ├── useAuth.ts         # Auth State Management
│   ├── useCsvUpload.ts    # CSV Upload Logic
│   ├── useChart.ts        # NEU: Chart State Management
│   ├── useQuery.ts        # Query Handling
│   └── index.ts
│
├── services/              # Backend API Integration
│   ├── authService.ts          # Login/Register API
│   ├── csvUploadService.ts     # CSV Upload API
│   ├── analysisService.ts      # Analysis API + Polling
│   ├── chartService.ts         # NEU: Charts API (alle Endpoints)
│   ├── httpClient.ts           # HTTP Utility mit Timeout
│   └── (weitere Services)
│
├── styles/                # Global CSS
│   └── globals.css
│
├── types/                 # TypeScript Type Definitionen
│   └── index.ts          # ERWEITERT: ChartType, ChartResponse, etc.
│
├── utils/                 # Utility Funktionen
│
├── App.tsx               # VERBESSERT: Mit ChartSelector
├── main.tsx              # Entry Point
└── index.css
```

## 🔄 Komponenten-Übersicht

### Auth Module
- **LoginDialog.tsx**: Dialog für Benutzer-Login
  - Email & Password Input
  - Error Handling mit Toast
  - Redirect nach erfolgreichem Login

- **RegisterDialog.tsx**: Dialog für Benutzer-Registrierung
  - Name, Email, Password Fields
  - Password Confirmation
  - Validierung (Länge, Gleichheit)

### CSV Upload Module
- **CsvUpload.tsx**: Datei-Upload Komponente
  - Drag & Drop Support
  - Multiple File Selection
  - File Validation (nur CSV)
  - Progress Feedback

### Dashboard Module
- **ChartDisplay.tsx**: Vordefinierte Chart-Anzeige
  - Verwendung von recharts
  - Chart-Daten aus Query

- **ChartSelector.tsx** (NEU): Interaktiver Chart-Generator
  - Chart-Typ Selection (Bar, Histogram, Heatmap, Pie)
  - Datei Selection aus hochgeladenen CSV
  - Spalten-Auswahl (für Bar Charts)
  - Live Chart-Anzeige
  - Powered by `useChart` Hook

- **QueryInput.tsx**: Query Input für Datenanalyse
  - Text Input für Nutzer-Fragen
  - Submit Handler
  - Integration mit AnalysisDisplay

### Analysis Module
- **AnalysisDisplay.tsx** (VERBESSERT): Analyse-Ergebnisse-Anzeige
  - Markdown Rendering mit Formatierung
  - Code Block Support
  - Listen Hierarchie
  - Blockquote Support
  - Polling für lange Operationen
  - Loading & Error States

### Layout Module
- **Navbar.tsx**: Navigations-Bar
  - Auth Buttons (Login/Register)
  - App Title

## 🎣 Hooks-Übersicht

### useAuth.ts
Verwaltet Authentifizierungs-State:
```typescript
- isAuthenticated: boolean
- user: { email, name } | null
- login(email, password): Promise
- register(name, email, password): Promise
- logout(): void
```

### useCsvUpload.ts
Verwaltet CSV-Upload Logic:
```typescript
- uploadCsv(files): Promise
- isLoading: boolean
- error: string | null
```

### useChart.ts (NEU)
Verwaltet Chart-State und Operationen:
```typescript
- files: FileInfo[]
- columns: ColumnInfo[]
- selectedFile: string
- selectedChartType: ChartType
- chartData: ChartResponse | null
- isLoading: boolean
- loadFiles(): Promise
- setSelectedFile(fileName): void
- setSelectedChartType(type): void
- generateChartData(): Promise
```

### useQuery.ts
Verwaltet Query-State:
```typescript
- query: string
- isLoading: boolean
- submitQuery(query): void
- clearQuery(): void
```

## 🔗 Services-Übersicht

### authService.ts
```typescript
loginUser(credentials: AuthCredentials): Promise<AuthResponse>
registerUser(payload: RegisterPayload): Promise<AuthResponse>
```
- Endpoints: `POST /api/users/login`, `POST /api/users/signup`
- Error Handling: Message Extraction, Fallback Messages
- Response Parsing: JSON & Text Support

### csvUploadService.ts
```typescript
uploadCsvFiles(files: File[]): Promise<CsvUploadResponse>
```
- Endpoint: `POST /api/files/upload`
- FormData für File Upload
- Timeout: 60 Sekunden

### analysisService.ts
```typescript
requestAnalysis(query: string, options?: RequestAnalysisOptions): Promise<string>
```
- Endpoints: `POST /api/analysis`, `GET /api/analysis/result/{jobId}`
- Polling-System: 2s Intervall, Max 300 Versuche
- Request Normalisierung: fileNames, dateien, query, frage
- Timeout-Handling: 30s per Request
- Comprehensive Logging

### chartService.ts (NEU)
Komplette Chart API Integration:
```typescript
// GET Endpoints
getChartTypes(): Promise<ChartType[]>
getAvailableFiles(): Promise<FileInfo[]>
getFileColumns(fileName): Promise<ColumnInfo[]>

// POST Endpoint
generateChart(chartType, file, column?): Promise<ChartResponse>

// Quick APIs (GET)
getBarChart(file, column?): Promise<ChartResponse>
getHistogram(file): Promise<ChartResponse>
getHeatmap(file): Promise<ChartResponse>
getPieChart(file): Promise<ChartResponse>

// Helper
generateChartByType(type, file, column?): Promise<ChartResponse>
```
- Alle Endpoints: `http://localhost:8080/api/charts/*`
- Error Handling & Response Parsing
- Timeout: 30 Sekunden (Chart-Generation)

### httpClient.ts
Zentrale HTTP-Utility:
```typescript
httpClient(url: string, options?: HttpRequestOptions): Promise<Response>
```
- Features:
  - Configurable Timeout (Default: 600s)
  - AbortController für Timeout-Handling
  - Request-Signal Support
  - Error Handling für Timeout

## 📝 Types (types/index.ts)

### Auth Types
- `AuthCredentials`: { email, password }
- `RegisterPayload`: { name, email, password }
- `User`: { id?, name, email }
- `AuthResponse`: Record | string | null

### Chart Types (NEU/ERWEITERT)
- `ChartType`: "bar" | "histogram" | "heatmap" | "pie"
- `ChartRequest`: { file?, column?, type? }
- `ChartGenerateRequest`: { chartType, file, column? }
- `ChartResponse`: { chartType, data, labels?, title?, ...}
- `FileInfo`: { name, size? }
- `ColumnInfo`: { name, type? }

### Analysis Types
- `AnalysisRequest`: { query, frage?, fileNames?, dateien?, model?, modell?, maxRows? }
- `AnalysisResult`: { query, analysis, timestamp? }
- `AnalysisApiResponse`: Record | string | null

### CSV Types
- `CsvUploadResponse`: Record | string | null
- `CsvUploadResult`: { fileName, rowCount, success }

## 🚀 Workflow Beispiele

### 1. CSV Upload → Chart Generieren
```
User uploades CSV
  ↓
useCsvUpload.uploadCsv()
  ↓
csvUploadService.uploadCsvFiles()
  ↓
File erscheint in ChartSelector
  ↓
User wählt Chart-Typ & Datei
  ↓
useChart.generateChartData()
  ↓
chartService.generateChartByType()
  ↓
Chart wird angezeigt
```

### 2. Daten-Analyse Query
```
User gibt Frage ein
  ↓
QueryInput.handleSubmit()
  ↓
analysisService.requestAnalysis()
  ↓
Backend gibt jobId zurück
  ↓
Polling: GET /api/analysis/result/{jobId}
  ↓
Status 200 → Ergebnis erhalten
  ↓
AnalysisDisplay rendert Markdown
```

### 3. Authentifizierung
```
User öffnet RegisterDialog
  ↓
Gibt Name, Email, Password ein
  ↓
RegisterDialog.handleSubmit()
  ↓
useAuth.register()
  ↓
authService.registerUser()
  ↓
Toast: Success oder Error
```

## 🛠️ Technologie Stack

- **React 18.3**: UI Framework
- **TypeScript**: Type Safety
- **Vite**: Build Tool
- **Tailwind CSS**: Styling
- **Shadcn UI**: UI Components
- **Recharts**: Chart Visualization
- **Sonner**: Toast Notifications
- **Axios** (implizit via fetch): HTTP Requests
- **Radix UI**: Accessible Component Primitives

## 📊 API Endpoints Summary

### Authentication (localhost:8080)
- `POST /api/users/login` - Benutzer-Login
- `POST /api/users/signup` - Benutzer-Registrierung

### Files & Upload (localhost:8080)
- `POST /api/files/upload` - CSV Upload

### Analysis (localhost:8080)
- `POST /api/analysis` - Start Analysis
- `GET /api/analysis/result/{jobId}` - Poll Result

### Charts (localhost:8080)
- `GET /api/charts/types` - Get Chart Types
- `GET /api/charts/files` - Get Available Files
- `GET /api/charts/columns?file=...` - Get Columns
- `POST /api/charts/generate` - Generate Chart
- `GET /api/charts/bar?file=...&column=...` - Quick Bar Chart
- `GET /api/charts/histogram?file=...` - Quick Histogram
- `GET /api/charts/heatmap?file=...` - Quick Heatmap
- `GET /api/charts/pie?file=...` - Quick Pie Chart

## 🔧 Konfiguration

### Basis URLs
- Auth & Upload: `http://localhost:8080`
- Analysis: `http://localhost:8080`
- Charts: `http://localhost:8080`

### Timeouts
- Standard HTTP: 600 Sekunden (10 Minuten)
- CSV Upload: 60 Sekunden
- Chart Generation: 30 Sekunden
- Analysis Start: 30 Sekunden
- Analysis Polling: 2 Sekunden Intervall, Max 300 Versuche

## 📚 Weitere Ressourcen

- API_INTEGRATION.md: Detaillierte API-Dokumentation
- tailwind.config.ts: Tailwind Konfiguration
- vite.config.ts: Vite Build Konfiguration

