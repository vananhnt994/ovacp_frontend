/**
 * Analysis Service
 * Generiert Analysen basierend auf Benutzeranfragen
 */

export function generateAnalysis(userQuery: string): string {
  const lowerQuery = userQuery.toLowerCase();
  
  if (lowerQuery.includes("quartal 1") || lowerQuery.includes("q1")) {
    return `Analyse für Quartal 1 2025:\n\nDie Daten zeigen eine positive Entwicklung im ersten Quartal 2025. Der Umsatz liegt bei durchschnittlich 45.000€ pro Monat, mit einem Spitzenwert von 65.000€ im März.\n\nKey Insights:\n• Januar zeigte einen starken Start mit 35.000€\n• Februar verzeichnete ein stabiles Wachstum auf 45.000€\n• März war der stärkste Monat mit 65.000€\n\nDer positive Trend deutet auf eine erfolgreiche Verkaufsstrategie hin. Es wird empfohlen, die Maßnahmen aus März zu analysieren und für Q2 zu replizieren.`;
  }
  
  if (lowerQuery.includes("umsatz") && lowerQuery.includes("2025")) {
    return `Umsatzanalyse 2025:\n\nDie Umsatzentwicklung zeigt einen positiven Wachstumstrend über das Jahr. Der durchschnittliche monatliche Umsatz beträgt 50.000€.\n\nWichtigste Erkenntnisse:\n• Gesamtumsatz liegt bei schätzungsweise 600.000€ für das Jahr\n• Wachstumsrate von durchschnittlich 8% pro Quartal\n• Saisonale Spitzen in den Monaten März, Juni und Dezember\n\nEmpfehlung: Fokussierung auf die Hochsaison-Monate zur Maximierung des Umsatzes.`;
  }
  
  if (lowerQuery.includes("vergleich") || lowerQuery.includes("vergleichen")) {
    return `Vergleichsanalyse:\n\nDie Daten wurden über mehrere Zeiträume hinweg verglichen. Es zeigen sich folgende Muster:\n\n• Konsistentes Wachstum in allen Vertriebskanälen\n• Online-Verkäufe zeigen die stärkste Wachstumsrate (+15%)\n• Stationärer Handel bleibt stabil mit moderatem Wachstum (+5%)\n\nDie Omni-Channel-Strategie zeigt positive Ergebnisse mit einer ausgewogenen Verteilung zwischen allen Kanälen.`;
  }
  
  return `Analyse für: "${userQuery}"\n\nDie Datenanalyse wurde durchgeführt. Basierend auf den verfügbaren Informationen zeigen sich folgende Erkenntnisse:\n\n• Die Daten zeigen einen konsistenten Trend über den ausgewählten Zeitraum\n• Es wurden keine signifikanten Anomalien festgestellt\n• Die Performance liegt im erwarteten Bereich\n\nFür eine detailliertere Analyse können Sie spezifischere Parameter angeben, wie z.B. Zeiträume, Produktkategorien oder Vertriebskanäle.`;
}

