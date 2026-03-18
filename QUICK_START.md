# OVACP Frontend - Quick Start Guide

## 🎯 Überblick

OVACP ist eine moderne **Omni-Channel-Vertriebsanalyse-Plattform** mit:
- 📊 **Dynamische Chart-Generierung** (Bar, Histogram, Heatmap, Pie)
- 📈 **AI-gestützte Datenanalyse** mit Polling
- 📁 **CSV-Upload** mit Validierung
- 🔐 **Benutzer-Authentifizierung**
- 🎨 **Moderne UI** mit Shadcn/UI & Tailwind

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+
- npm oder yarn
- Backend Services auf localhost:8080, 8081, 8083

### Installation
```bash
# 1. In Projekt-Verzeichnis
cd ovacp_frontend

# 2. Dependencies installieren
npm install

# 3. Frontend starten
npm run dev

# Frontend öffnet sich auf http://localhost:5173
```

### Production Build
```bash
npm run build    # Build erstellen
npm run preview  # Preview des Builds
```

## 📋 Features & Workflows

### 1️⃣ Benutzer-Registrierung
```
Klick "Registrierung"
  ↓
Gib Name, Email, Password ein
  ↓
POST /api/users/signup
  ↓
Erfolgreiche Registrierung mit User-ID
```

### 2️⃣ CSV-Upload
```
Klick "CSV-Dateien hochladen"
  ↓
Wähle eine oder mehrere CSV-Dateien
  ↓
Klick "Hochladen"
  ↓
POST /api/files/upload
  ↓
Dateien sind jetzt im System verfügbar
```

### 3️⃣ Chart Generieren
```
Im "Chart-Generator" Bereich:
  ↓
1. Wähle Diagramm-Typ:
   - Balkendiagramm (Bar Chart)
   - Histogramm
   - Heatmap
   - Tortendiagramm (Pie Chart)
  ↓
2. Wähle eine CSV-Datei
  ↓
3. Optional: Spalte wählen (für Bar Charts)
  ↓
4. Klick "Generieren"
  ↓
GET /api/charts/[type]?file=...
  ↓
Chart wird mit Recharts visualisiert
```

### 4️⃣ Daten-Analyse
```
Gib eine Frage/Anfrage ein:
  z.B. "Analysiere die Rossmann-Verkaufsdaten"
  ↓
Klick "Analysieren"
  ↓
POST /api/analysis (mit fileNames & query)
  ↓
Erhalte jobId vom Backend
  ↓
Frontend pollt: GET /api/analysis/result/{jobId}
  (alle 2 Sekunden, max 10 Minuten)
  ↓
Wenn Status 200: Ergebnis anzeigen
  ↓
AnalysisDisplay rendert Markdown formatiert
```

## 📁 Projektstruktur (Kurzform)

```
src/
├── features/           # Feature Modules
│   ├── auth/          # Login/Register
│   ├── csv-upload/    # CSV Upload
│   ├── dashboard/     # Charts & Query
│   ├── analysis/      # Results Display
│   └── layout/        # Navigation
├── services/          # API Integration
│   ├── authService
│   ├── csvUploadService
│   ├── analysisService
│   ├── chartService        ⭐ NEW
│   └── httpClient
├── hooks/             # State Management
│   ├── useAuth
│   ├── useCsvUpload
│   ├── useChart        ⭐ NEW
│   └── useQuery
├── components/        # Reusable UI
│   └── ui/           # Shadcn Components
├── types/            # TypeScript Definitions
└── App.tsx           # Main Component
```

## 🔧 Konfiguration

### API Base URLs
Alle Backend-Anfragen gehen zu `http://localhost:8080/api/...`:

```typescript
// Auth
POST   /api/users/login
POST   /api/users/signup

// Files
POST   /api/files/upload

// Analysis
POST   /api/analysis
GET    /api/analysis/result/{jobId}

// Charts
GET    /api/charts/types
GET    /api/charts/files
GET    /api/charts/columns?file=...
POST   /api/charts/generate
GET    /api/charts/bar?file=...&column=...
GET    /api/charts/histogram?file=...
GET    /api/charts/heatmap?file=...
GET    /api/charts/pie?file=...
```

### Timeouts
- Standard: 10 Minuten (600s)
- CSV Upload: 60 Sekunden
- Chart Generation: 30 Sekunden

## 🎨 UI Components

### Verfügbare Komponenten
- Dialog (Login, Register)
- Card (Content Container)
- Button (Actions)
- Select (Dropdowns)
- Input (Text Fields)
- Label (Form Labels)
- Toast (Notifications via Sonner)
- Und 20+ weitere Shadcn Components

### Styling
- **Tailwind CSS** für Utility Classes
- **Responsive Design** (Mobile, Tablet, Desktop)
- **Dark Mode Ready** (via next-themes)

## 📊 Charts mit Recharts

Unterstützte Chart-Typen:
```
✅ Bar Chart     - Balkendiagramm für Kategorien
✅ Histogram     - Verteilung von Daten
✅ Pie Chart     - Anteile & Prozentuale Verteilung
✅ Heatmap       - Wärmekarte für Daten-Muster
```

Beispiel Bar Chart:
```typescript
<BarChart data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="value" fill="#8884d8" />
</BarChart>
```

## 🔄 Data Flow

```
Benutzer Input
    ↓
Component Event Handler
    ↓
Hook (useAuth, useChart, useCsvUpload, etc.)
    ↓
Service (authService, chartService, etc.)
    ↓
httpClient (mit Timeout & Error Handling)
    ↓
Backend API
    ↓
Response Parsing
    ↓
Hook State Update
    ↓
Component Re-render
```

## 🐛 Fehlerbehandlung

### Globales Error Handling
- Toast Notifications für Fehler
- Error Messages vom Backend
- Fallback Messages als Backup
- Console Logging für Debugging

### Häufige Fehler & Lösungen

**"Bitte geben Sie mindestens einen Dateinamen an"**
- → Datei wurde nicht hochgeladen
- → Lösung: CSV-Datei hochladen

**"Analyse konnte nicht gestartet werden: 400"**
- → fileNames war null oder leer
- → Lösung: ✅ Wurde bereits in v1 gefixt

**"Chart konnte nicht generiert werden"**
- → Datei-Format nicht unterstützt
- → Lösung: CSV-Format überprüfen

## 📚 Wichtige Dateien

### Zu lesen vor der Entwicklung:
1. **PROJECT_STRUCTURE.md** - Komplette Projektstruktur
2. **API_INTEGRATION.md** - API Endpoints Dokumentation
3. **IMPLEMENTATION_GUIDE.md** - Development Checklisten

## 💡 Tips & Tricks

### Development
```bash
npm run dev          # Start mit HMR
npm run build        # Production Build
npm run preview      # Build Preview
npm run lint         # ESLint Check
```

### Debugging
- React DevTools Browser Extension
- Chrome DevTools Network Tab
- Console Logging (console.log)
- VS Code Debugger

### Performance
- React Profiler Tool
- Lighthouse Audit
- Bundle Analyzer
- Network Throttling

## 🧪 Testing (Optional)

Noch nicht implementiert, aber empfohlen:
```bash
npm install --save-dev vitest @testing-library/react
npm run test         # Unit Tests
npm run test:e2e     # E2E Tests
```

## 🚀 Deployment

### vor Deployment
```bash
npm run build        # Build erstellen
npm run preview      # Build testen
npm run lint         # Lint Check
```

### Deployment zu Production
```bash
# Umgebungsvariablen setzen (.env.production)
VITE_API_BASE_URL=https://api.your-domain.com

# Build & Deploy
npm run build
# Deploye build/ Folder zu Server
```

## 📞 Support & Resources

### Dokumentation
- [React Docs](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Shadcn UI](https://ui.shadcn.com)

### Community
- React Discord
- TypeScript Discord
- Stack Overflow

## 🤝 Contributing

### Code Standards
- TypeScript Strict Mode
- Functional Components
- React Hooks
- ESLint Configuration
- Tailwind Classes

### Commit Konvention
```
feat: Neue Feature
fix: Bug Fix
docs: Dokumentation
style: Code Style
refactor: Umstrukturierung
test: Tests
chore: Maintenance
```

## 📝 Lizenz & Credits

- **Framework**: React 18.3
- **UI Library**: Shadcn/UI
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Language**: TypeScript

## 🎯 Häufig gestellte Fragen

**F: Wie starte ich das Backend?**
A: Backend läuft auf Port 8080, 8081, 8083. Starte die Services separat.

**F: Warum funktioniert Chart-Upload nicht?**
A: Stelle sicher, dass CSV-Dateien zuerst hochgeladen wurden (CsvUpload-Komponente).

**F: Wie lange dauert eine Analyse?**
A: Bis zu 10 Minuten (MAX_POLL_ATTEMPTS = 300 × 2s). Sieh Console für Details.

**F: Kann ich Chart exportieren?**
A: Nicht aktuell, aber ist geplant (Recharts hat Export-Plugins).

**F: Wie ändere ich die API-URLs?**
A: In `services/` Dateien die `ENDPOINT` Konstanten anpassen.

---

**Version**: 1.0.0
**Letztes Update**: 2026-03-18
**Status**: ✅ Production Ready

