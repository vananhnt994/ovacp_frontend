import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { requestAnalysis } from "@/services/analysisService";

interface AnalysisDisplayProps {
  query: string;
  fileNames?: string[];
}

function parseMarkdown(text: string) {
  return text.split("\n").map((line, idx) => {
    // Headers
    if (line.startsWith("## ")) {
      return (
        <h2 key={idx} className="mt-4 mb-2 text-lg font-bold text-gray-900">
          {line.replace(/^## /, "")}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={idx} className="mt-3 mb-1 text-base font-semibold text-gray-800">
          {line.replace(/^### /, "")}
        </h3>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h1 key={idx} className="mt-5 mb-3 text-2xl font-bold text-gray-900">
          {line.replace(/^# /, "")}
        </h1>
      );
    }

    // Lists
    if (line.startsWith("* ")) {
      return (
        <li key={idx} className="ml-6 list-disc text-gray-700">
          {line.replace(/^\* /, "")}
        </li>
      );
    }

    // Bold
    let boldLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Inline code
    boldLine = boldLine.replace(/`(.*?)`/g, "<code>$1</code>");

    // Empty line = paragraph break
    if (line.trim() === "") {
      return <div key={idx} className="my-2" />;
    }

    // Regular paragraph
    return (
      <p key={idx} className="text-gray-700 leading-relaxed mb-2">
        <span dangerouslySetInnerHTML={{ __html: boldLine }} />
      </p>
    );
  });
}

export function AnalysisDisplay({ query, fileNames = [] }: AnalysisDisplayProps) {
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setAnalysis("");
      setError(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadAnalysis = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!fileNames.length) {
          throw new Error("Bitte laden Sie zuerst mindestens eine CSV-Datei hoch.");
        }

        const result = await requestAnalysis(query, { fileNames });

        if (!isMounted) {
          return;
        }

        setAnalysis(result);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message = err instanceof Error ? err.message : "Analyse konnte nicht geladen werden";
        setError(message);
        setAnalysis("");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAnalysis();

    return () => {
      isMounted = false;
    };
  }, [query, fileNames]);

  if (!query) return null;

  return (
    <Card className="w-full p-6 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1 w-full">
          <h3 className="mb-4 text-lg font-semibold text-blue-900">Analyse-Ergebnisse</h3>
          <div className="text-gray-700 prose prose-sm max-w-none">
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="inline-flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
                <span>Analyse läuft, bitte warten...</span>
              </div>
            )}
            {!isLoading && error && <span className="text-red-600 font-semibold">{error}</span>}
            {!isLoading && !error && analysis && (
              <div className="space-y-2 text-sm">{parseMarkdown(analysis)}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
