import { Navbar } from "@/features/layout";
import { ChartDisplay, QueryInput, ChartSelector } from "@/features/dashboard";
import { CsvUpload } from "@/features/csv-upload";
import { AnalysisDisplay } from "@/features/analysis";
import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import type { AnalysisChartOption } from "@/types";

export default function App() {
  const [query, setQuery] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [chartOptions, setChartOptions] = useState<AnalysisChartOption[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);

  const handleQuerySubmit = useCallback((userQuery: string) => {
    setQuery(userQuery);
    setShowAnalysis(true);
    setSelectedChartId(null);
  }, []);

  const handleChartOptionsChange = useCallback((options: AnalysisChartOption[]) => {
    setChartOptions(options);
    setSelectedChartId(options.length > 0 ? options[0].id : null);
  }, []);

  const selectedChart = chartOptions.find((option) => option.id === selectedChartId) || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <ChartDisplay selectedChart={selectedChart} />
          <CsvUpload onUploadedFileNamesChange={setUploadedFileNames} />
          <ChartSelector
            options={chartOptions}
            selectedChartId={selectedChartId}
            onSelectChart={setSelectedChartId}
          />
          <QueryInput onSubmit={handleQuerySubmit} />
          {showAnalysis && (
            <AnalysisDisplay
              query={query}
              fileNames={uploadedFileNames}
              onChartOptionsChange={handleChartOptionsChange}
            />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}