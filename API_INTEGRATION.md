# API Integration Dokumentation

## Übersicht der Endpoints

### Authentication
- **Login**: `POST http://localhost:8080/api/users/login`
- **Signup**: `POST http://localhost:8080/api/users/signup` (oder `localhost:8081/api/citizens/signup`)

### CSV Upload
- **Upload**: `POST http://localhost:8080/api/files/upload`

### Analysis
- **Start Analysis**: `POST http://localhost:8080/api/analysis`
- **Get Result**: `GET http://localhost:8080/api/analysis/result/{jobId}`

### Charts
- **Get Chart Types**: `GET http://localhost:8080/api/charts/types`
- **Get Available Files**: `GET http://localhost:8080/api/charts/files`
- **Get File Columns**: `GET http://localhost:8080/api/charts/columns?file=...`
- **Generate Chart**: `POST http://localhost:8080/api/charts/generate`
- **Bar Chart (Quick)**: `GET http://localhost:8080/api/charts/bar?file=...&column=...`
- **Histogram (Quick)**: `GET http://localhost:8080/api/charts/histogram?file=...`
- **Heatmap (Quick)**: `GET http://localhost:8080/api/charts/heatmap?file=...`
- **Pie Chart (Quick)**: `GET http://localhost:8080/api/charts/pie?file=...`

## Service-Struktur

### authService.ts
```typescript
loginUser(credentials: AuthCredentials): Promise<AuthResponse>
registerUser(payload: RegisterPayload): Promise<AuthResponse>
```

### csvUploadService.ts
```typescript
uploadCsvFiles(files: File[]): Promise<CsvUploadResponse>
```

### analysisService.ts
```typescript
requestAnalysis(query: string, options?: RequestAnalysisOptions): Promise<string>
```

### chartService.ts
```typescript
// GET Requests
getChartTypes(): Promise<ChartType[]>
getAvailableFiles(): Promise<FileInfo[]>
getFileColumns(fileName: string): Promise<ColumnInfo[]>

// POST Request
generateChart(chartType: ChartType, file: string, column?: string): Promise<ChartResponse>

// Quick APIs
getBarChart(file: string, column?: string): Promise<ChartResponse>
getHistogram(file: string): Promise<ChartResponse>
getHeatmap(file: string): Promise<ChartResponse>
getPieChart(file: string): Promise<ChartResponse>
generateChartByType(chartType: ChartType, file: string, column?: string): Promise<ChartResponse>
```

## UI-Komponenten

### ChartSelector
Neue Komponente zum Auswählen und Generieren von verschiedenen Diagrammtypen:
- Diagramm-Typ auswählen (Bar, Histogram, Heatmap, Pie)
- Datei aus hochgeladenen CSV-Dateien wählen
- Optional Spalte auswählen (für Bar-Chart)
- Chart automatisch generieren und anzeigen
- Visualisierung mit recharts

### AnalysisDisplay
Verbesserte Komponente für die Anzeige von Analyse-Ergebnissen:
- Bessere Markdown-Formatierung
- Code-Block-Support
- Listen-Support mit korrekter Hierarchie
- Blockquote-Support
- Formatierte Inline-Elemente (bold, italic, code)

## Fehlerbehandlung

Alle Services verwenden zentralisierte Fehlerbehandlung:
- Timeout-Handling (httpClient mit DEFAULT_TIMEOUT_MS = 600000ms)
- Response-Parsing für JSON und Text
- Error Message Extraktion

## Polling für Analyse

Die analysisService nutzt ein Polling-System:
- Startet eine Analyse-Anfrage und erhält eine jobId
- Pollt regelmäßig (alle 2 Sekunden) den Status
- Gibt das Ergebnis zurück, wenn Status 200 ist
- Timeout nach 300 Versuchen (~10 Minuten)

