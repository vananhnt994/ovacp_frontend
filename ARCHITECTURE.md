# OVACP Frontend - Technisches Übersicht Diagram

## 🏗️ Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                         OVACP Frontend                           │
│                      React 18 + TypeScript                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
         ┌──────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
         │  Features   │ │ Hooks  │ │ Components │
         └──────┬──────┘ └───┬────┘ └─────┬──────┘
                │             │            │
    ┌───────────┼────┬────────┼────┬───────┼────┐
    │           │    │        │    │       │    │
┌───▼───┐ ┌─────▼──┐ │ ┌──────▼──┐│┌─────▼──┐ │
│ Auth  │ │CSV-Upd│ │ │Dashboard││ Analysis  │ │
│ Login │ │       │ │ │ChartSel │ │Display   │ │
│Regist │ │Upload │ │ │Query    │ │(Markdown)│ │
└───┬───┘ └─────┬──┘ │ └──────┬──┘│└─────┬────┘ │
    │           │    │        │   │      │      │
    └─────────────────────────────────────┘
           │
    ┌──────▼────────────────────┐
    │   Services Layer           │
    │ ┌───────────────────────┐  │
    │ │  authService          │  │
    │ │  chartService    ⭐   │  │
    │ │  analysisService 🔄   │  │
    │ │  csvUploadService     │  │
    │ │  httpClient           │  │
    │ └───────────────────────┘  │
    └──────┬─────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │   Backend API              │
    │  (localhost:8080/api)      │
    │                            │
    │  POST   /users/login       │
    │  POST   /users/signup      │
    │  POST   /files/upload      │
    │  POST   /analysis          │
    │  GET    /analysis/result/* │
    │  GET    /charts/*          │
    │  POST   /charts/generate   │
    └────────────────────────────┘
```

## 📊 Component Hierarchy

```
App.tsx
├── Navbar
│   ├── LoginDialog
│   └── RegisterDialog
├── ChartDisplay
├── CsvUpload
├── ChartSelector ⭐ NEW
│   ├── Select (Chart Type)
│   ├── Select (File)
│   ├── Select (Column - optional)
│   ├── Button (Generate)
│   └── Chart Visualization
│       ├── BarChart (recharts)
│       ├── PieChart (recharts)
│       ├── Heatmap (custom)
│       └── Loading/Error States
├── QueryInput
│   └── TextArea
│       └── Button (Submit)
└── AnalysisDisplay 🔄 IMPROVED
    ├── Markdown Parser
    ├── Code Blocks
    ├── Lists
    ├── Headers (h1-h3)
    ├── Blockquotes
    ├── Bold/Italic/Code inline
    └── Loading/Error States
```

## 🔄 Data Flow für Chart-Generation

```
User Action
    │
    ▼
ChartSelector.tsx
    │ onClick="generateChartData()"
    ▼
useChart Hook
    │ generateChartData()
    ▼
chartService.generateChartByType()
    │
    ├─► getBarChart() ──┐
    ├─► getHistogram()──┤
    ├─► getHeatmap()───┤── httpClient()
    └─► getPieChart()──┘
         │
         ▼ (GET /api/charts/[type])
    Backend API
         │
         ▼ (JSON Response)
    parseChartResponse()
         │
         ▼
    Hook State Update
         │
         ▼
    Component Re-render
         │
         ▼
    Recharts Visualization
```

## 🔄 Data Flow für Analysis

```
User Input (Query + Files)
    │
    ▼
QueryInput.handleSubmit()
    │
    ▼
AnalysisDisplay useEffect()
    │
    ▼
analysisService.requestAnalysis()
    │
    ├─► 1. POST /api/analysis
    │      (Payload: query, fileNames, etc.)
    │   ◄─ Response: { jobId }
    │
    ├─► 2. Loop: GET /api/analysis/result/{jobId}
    │      Interval: 2 Sekunden
    │      Max: 300 Versuche (10 Minuten)
    │
    │   Status 202 → Continue Polling
    │   Status 200 → Got Result ✅
    │   Status != 200 → Error ❌
    │
    ▼
getAnalysisText() (Field Checking)
    │ Sucht nach: analysis, data, content, text, 
    │             result, message, oder erste String > 10 chars
    ▼
parseMarkdown() (Enhanced Renderer)
    │ ├─ Headers (###, ##, #)
    │ ├─ Lists (* items)
    │ ├─ Code Blocks (```)
    │ ├─ Blockquotes (>)
    │ ├─ Inline Formatting (**bold**, *italic*, `code`)
    │ └─ Regular Paragraphs
    ▼
AnalysisDisplay Render
```

## 🎣 Hook Zusammenarbeit

```
┌─────────────────────────────────┐
│      Component                   │
│  (ChartSelector, QueryInput)     │
└──────────────┬──────────────────┘
               │
        ┌──────┴──────┐
        │             │
    ┌───▼────┐   ┌────▼────┐
    │useChart│   │useCsvUp.│
    │        │   │         │
    │ - files│   │ - upload│
    │ - cols │   │ - error │
    │ - gen. │   │ - load  │
    └───┬────┘   └────┬────┘
        │             │
        └──────┬──────┘
               │
         ┌─────▼──────────┐
         │  chartService  │
         │ csvUploadServ. │
         │  httpClient    │
         └─────┬──────────┘
               │
        ┌──────▼──────────┐
        │  Backend API    │
        │  localhost:8080 │
        └─────────────────┘
```

## 🔐 Type System

```
TypeScript Strict Mode ✅

Auth Types
├─ AuthCredentials { email, password }
├─ RegisterPayload { name, email, password }
├─ User { id?, name, email }
└─ AuthResponse Record | string | null

Chart Types ⭐ NEW
├─ ChartType "bar" | "histogram" | "heatmap" | "pie"
├─ ChartRequest { file?, column?, type? }
├─ ChartResponse { chartType, data, labels?, ... }
├─ FileInfo { name, size? }
└─ ColumnInfo { name, type? }

Analysis Types
├─ AnalysisRequest { query, fileNames?, ... }
├─ AnalysisResult { query, analysis, timestamp? }
└─ AnalysisApiResponse Record | string | null

CSV Types
├─ CsvUploadResponse Record | string | null
└─ CsvUploadResult { fileName, rowCount, success }
```

## 🚀 Request Lifecycle

```
1. REQUEST CREATION
   Service: chartService.getBarChart("file.csv", "column")
   
2. HTTP CLIENT
   httpClient(url, { method: "GET", timeout: 30000 })
   └─ AbortController für Timeout
   └─ DEFAULT_TIMEOUT: 600s
   
3. RESPONSE PARSING
   parseChartResponse()
   └─ JSON oder Text
   
4. ERROR HANDLING
   if (!response.ok) {
     getChartErrorMessage()
     → Toast notification
   }
   
5. HOOK STATE UPDATE
   setChartState({ chartData, isLoading, error })
   
6. COMPONENT RE-RENDER
   ```

## 📦 Bundle Composition

```
Total: 740.04 KB (gzipped: 216.31 KB)

Main Dependencies:
├─ react@18.3.1                    (main framework)
├─ react-dom@18.3.1                (rendering)
├─ recharts@2.15.2                 (charts) 📊
├─ @radix-ui/*@latest              (components)
├─ tailwindcss@latest              (styling)
├─ typescript@latest               (types)
├─ vite@6.3.5                      (build)
└─ sonner@2.0.3                    (toasts)

CSS: 26.80 KB (gzipped: 5.78 KB)
JS:  740.04 KB (gzipped: 216.31 KB)
HTML: 0.43 KB (gzipped: 0.28 KB)
```

## 🧪 Testing Strategy (Optional)

```
Unit Tests (Vitest)
├─ chartService functions
├─ analysisService functions
├─ Hook logic (useChart, useAuth)
└─ Type validation

Component Tests (React Testing Library)
├─ ChartSelector interactions
├─ AnalysisDisplay rendering
├─ Form validations
└─ Error states

E2E Tests (Cypress/Playwright)
├─ Complete workflow: CSV → Chart
├─ Complete workflow: Query → Analysis
├─ Complete workflow: Registration → Login
└─ Error scenarios
```

## 🔄 Lifecycle Events

```
App Mount
    ↓
├─ ChartSelector loads available files
│  └─ useChart.loadFiles() → getAvailableFiles()
├─ Register/Login dialogs ready
└─ CSV Upload component ready

User Interaction
    ├─ File Upload → uploadCsvFiles()
    ├─ Chart Generation → generateChartByType()
    ├─ Query Submit → requestAnalysis()
    └─ File Selection → loadColumnsForFile()

Result Handling
    ├─ Success → Toast + State Update + Re-render
    └─ Error → Toast + Error State + Fallback UI

Cleanup
    ├─ Component Unmount → Hook cleanup
    ├─ Request Abort on Navigation
    └─ Timer Cleanup (polling stops)
```

## 🎯 Performance Optimizations

```
Current:
✅ Lazy Loading Components (React.lazy)
✅ Memoization (useMemo, useCallback)
✅ Efficient Re-renders (useState in hooks)
✅ Debounced API Calls (via hooks)
✅ Polling Intervals (2s, not continuous)
✅ Request Caching (in hook state)

Potential Future:
□ Code Splitting (dynamic imports)
□ Virtual Scrolling (large lists)
□ Image Optimization
□ Bundle Analysis (webpack-bundle-analyzer)
□ Performance Monitoring (Sentry)
```

## 🔐 Security Layers

```
Frontend:
✅ Input Validation (CSV extension check)
✅ XSS Prevention (React auto-escaping)
✅ Type Safety (TypeScript strict mode)
✅ Error Message Sanitization
✅ Safe Component Composition

Backend (prepared):
- HTTPS/TLS (ready)
- CORS (ready)
- CSRF Tokens (ready)
- Rate Limiting (ready)
- Input Validation (ready)
```

---

**Version**: 1.0.0
**Last Updated**: 2026-03-18
**Architecture**: Modular, Feature-based, Type-safe
**Build Status**: ✅ Successful

