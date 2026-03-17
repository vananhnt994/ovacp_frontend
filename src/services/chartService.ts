/**
 * Chart Data Service
 * Hilfsfunktionen zur Verarbeitung von Chart-Daten
 */

export function formatChartData(data: any[]) {
  // Formatiere Daten für Grafiken
  return data.map((item) => ({
    ...item,
    // Zusätzliche Transformationen hier
  }));
}

export function filterChartDataByQuery(data: any[], query: string) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("q1") || lowerQuery.includes("quartal 1")) {
    return data.slice(0, 3); // Nur erste 3 Monate
  }
  
  if (lowerQuery.includes("2025")) {
    return data; // Volles Jahr
  }
  
  return data;
}

