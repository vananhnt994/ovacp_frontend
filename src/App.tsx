import { Navbar } from "@/features/layout";
import { ChartDisplay, QueryInput } from "@/features/dashboard";
import { CsvUpload } from "@/features/csv-upload";
import { AnalysisDisplay } from "@/features/analysis";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

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
          <CsvUpload onUploadedFileNamesChange={setUploadedFileNames} />
          <QueryInput onSubmit={handleQuerySubmit} />
          {showAnalysis && <AnalysisDisplay query={query} fileNames={uploadedFileNames} />}
        </div>
      </main>
      <Toaster />
    </div>
  );
}