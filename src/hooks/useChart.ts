import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { ChartType, ChartResponse, ChartSelectionType } from "@/types";
import {
  generateChartByType as generateChart,
} from "@/services/chartService";

interface ChartState {
  selectedColumn: string;
  selectedChartType: ChartSelectionType;
  chartData: ChartResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useChart() {
  const [chartState, setChartState] = useState<ChartState>({
    selectedColumn: "",
    selectedChartType: "bar",
    chartData: null,
    isLoading: false,
    error: null,
  });

  // Wähle eine Spalte aus
  const setSelectedColumn = useCallback((columnName: string) => {
    setChartState((prev) => ({
      ...prev,
      selectedColumn: columnName,
    }));
  }, []);

  // Wähle einen Chart-Typ aus
  const setSelectedChartType = useCallback((chartType: ChartSelectionType) => {
    setChartState((prev) => ({
      ...prev,
      selectedChartType: chartType,
      chartData: null,
    }));
  }, []);

  // Generiere ein Chart
  const generateChartData = useCallback(async () => {
    const { selectedChartType, selectedColumn } = chartState;

    if (selectedChartType === "none") {
      setChartState((prev) => ({
        ...prev,
        chartData: null,
        error: null,
      }));
      return;
    }

    try {
      setChartState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await generateChart(
        selectedChartType as ChartType,
        selectedColumn || undefined,
      );
      setChartState((prev) => ({
        ...prev,
        chartData: data,
      }));
      toast.success("Chart erfolgreich generiert!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fehler beim Generieren des Charts";
      setChartState((prev) => ({ ...prev, error: message }));
      toast.error(message);
    } finally {
      setChartState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [chartState]);

  // Reset State
  const reset = useCallback(() => {
    setChartState({
      selectedColumn: "",
      selectedChartType: "bar",
      chartData: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...chartState,
    setSelectedColumn,
    setSelectedChartType,
    generateChartData,
    reset,
  };
}

