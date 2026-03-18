import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartNoAxesCombined } from "lucide-react";
import type { AnalysisChartOption } from "@/types";

interface ChartSelectorProps {
  options: AnalysisChartOption[];
  selectedChartId: string | null;
  onSelectChart: (chartId: string | null) => void;
}

export function ChartSelector({ options, selectedChartId, onSelectChart }: ChartSelectorProps) {
  const selectedValue = selectedChartId ?? "none";
  const hasOptions = options.length > 0;

  return (
    <Card className="w-full border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ChartNoAxesCombined className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Chart-Auswahl</h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Diagramm</label>
        <Select
          value={selectedValue}
          onValueChange={(value) => onSelectChart(value === "none" ? null : value)}
          disabled={!hasOptions}
        >
          <SelectTrigger className="h-12 rounded-xl border-gray-300 bg-gray-50 text-base hover:bg-white">
            <SelectValue placeholder={hasOptions ? "Diagramm wählen..." : "Keine Chart-Daten verfügbar"} />
          </SelectTrigger>
          <SelectContent className="max-h-72 rounded-xl border-gray-200 bg-white p-1 shadow-lg">
            <SelectItem value="none" className="rounded-lg py-2.5">
              <span className="text-gray-700">Kein Diagramm</span>
            </SelectItem>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id} className="rounded-lg py-2.5">
                <span className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {option.chartType}
                  </span>
                  <span className="truncate text-sm text-gray-900">{option.title}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasOptions && <p className="text-xs text-gray-500">{options.length} Vorschläge verfügbar</p>}
      </div>

      {!hasOptions && (
        <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">
          Noch keine Chart-Vorschläge vorhanden. Bitte zuerst eine Analyse starten.
        </p>
      )}
    </Card>
  );
}

