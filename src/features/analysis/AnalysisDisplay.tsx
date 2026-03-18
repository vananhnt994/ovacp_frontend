import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { requestAnalysis } from "@/services/analysisService";
import type { AnalysisChartOption } from "@/types";

interface AnalysisDisplayProps {
  query: string;
  fileNames?: string[];
  onChartOptionsChange?: (options: AnalysisChartOption[]) => void;
}

function parseMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let listItems: string[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Code Block handling
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // Ende des Code Blocks
        elements.push(
          <pre
            key={`code-${idx}`}
            className="bg-gray-800 text-gray-100 p-3 rounded mb-3 text-sm overflow-x-auto"
          >
            <code>{codeContent}</code>
          </pre>,
        );
        codeContent = "";
        inCodeBlock = false;
      } else {
        // Start des Code Blocks
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // Flush liste wenn keine ListItem mehr
    if (listItems.length > 0 && !line.startsWith("* ") && line.trim() !== "") {
      elements.push(
        <ul key={`list-${idx}`} className="ml-6 list-disc space-y-1 mb-3">
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }

    // Headers
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={idx} className="mt-5 mb-3 text-xl font-bold text-gray-900">
          {line.replace(/^## /, "")}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={idx} className="mt-4 mb-2 text-lg font-semibold text-gray-800">
          {line.replace(/^### /, "")}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={idx} className="mt-6 mb-4 text-2xl font-bold text-gray-900">
          {line.replace(/^# /, "")}
        </h1>,
      );
      continue;
    }

    // Lists
    if (line.startsWith("* ")) {
      listItems.push(line.replace(/^\* /, ""));
      continue;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      elements.push(
        <div
          key={idx}
          className="border-l-4 border-blue-500 bg-blue-50 p-3 my-2 rounded text-gray-700"
        >
          {line.replace(/^> /, "")}
        </div>,
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={idx} className="my-2" />);
      continue;
    }

    // Regular paragraph mit Formatting
    let processedLine = line
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-gray-900'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
      .replace(/`(.*?)`/g, "<code class='bg-gray-100 px-2 py-1 rounded text-red-600 font-mono text-sm'>$1</code>");

    elements.push(
      <p key={idx} className="text-gray-700 leading-relaxed mb-2">
        <span dangerouslySetInnerHTML={{ __html: processedLine }} />
      </p>,
    );
  }

  // Flush liste am Ende
  if (listItems.length > 0) {
    elements.push(
      <ul key="list-end" className="ml-6 list-disc space-y-1 mb-3">
        {listItems.map((item, i) => (
          <li key={i} className="text-gray-700">
            {item}
          </li>
        ))}
      </ul>,
    );
  }

  return elements;
}

export function AnalysisDisplay({ query, fileNames = [], onChartOptionsChange }: AnalysisDisplayProps) {
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setAnalysis("");
      setError(null);
      setIsLoading(false);
      onChartOptionsChange?.([]);
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

        setAnalysis(result.analysisText);
        onChartOptionsChange?.(result.chartOptions);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message = err instanceof Error ? err.message : "Analyse konnte nicht geladen werden";
        setError(message);
        setAnalysis("");
        onChartOptionsChange?.([]);
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
  }, [query, fileNames, onChartOptionsChange]);

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
