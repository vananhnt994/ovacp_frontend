import { Navbar } from "./components/navbar";
import { ChartDisplay } from "./components/chart-display";
import { CsvUpload } from "./components/csv-upload";
import { QueryInput } from "./components/query-input";
import { AnalysisDisplay } from "./components/analysis-display";
import { Toaster } from "./components/ui/sonner";
import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleQuerySubmit = (userQuery: string) => {
    setQuery(userQuery);
    setShowAnalysis(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <ChartDisplay query={query} />
          <CsvUpload />
          <QueryInput onSubmit={handleQuerySubmit} />
          {showAnalysis && <AnalysisDisplay query={query} />}
        </div>
      </main>
      <Toaster />
    </div>
  );
}