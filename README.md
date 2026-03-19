# OCVAP Frontend

Frontend für OCVAP (Omni-Channel-Vertriebsanalyse-Plattform) auf Basis von **React (TypeScript)**.

## Voraussetzungen

- Node.js (empfohlen: aktuelle LTS)
- npm

## Setup

### Abhängigkeiten installieren

```bash
npm install
```

### Development Server starten

```bash
npm run dev
```

Standardmäßig startet Vite auf:

- `http://localhost:3000`

## Build

```bash
npm run build
```

Das Build-Output liegt in:

- `./build`

## Projektstruktur / Doku

Im Repo liegen zusätzliche Struktur-Dokumente:

- `STRUCTURE.md`
- `PROJECT_TREE.md`
- `STRUCTURE_SUMMARY.md`

## Hinweise zur Backend-Anbindung

Das Frontend spricht typischerweise das **API Gateway** des Backends an.

Wenn du eine lokale API-URL brauchst (z. B. per `.env` oder Vite Proxy), sag kurz Bescheid, dann formatiere ich das README so, dass es eine klare Sektion “Environment / API Base URL” enthält.
