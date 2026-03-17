import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { generateAnalysis } from "@/services/analysisService";

interface AnalysisDisplayProps {
  query: string;
}

export function AnalysisDisplay({ query }: AnalysisDisplayProps) {
  if (!query) return null;

  const analysis = generateAnalysis(query);

  return (
    <Card className="w-full p-6 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="mb-3 text-blue-900">Analyse-Ergebnisse</h3>
          <div className="text-gray-700 whitespace-pre-line">
            {analysis}
          </div>
        </div>
      </div>
    </Card>
  );
}

