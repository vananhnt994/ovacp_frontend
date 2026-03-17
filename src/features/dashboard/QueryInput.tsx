import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
}

export function QueryInput({ onSubmit }: QueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      console.log("Nutzeranfrage:", query);
      onSubmit(query);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="w-full p-6">
      <h3 className="mb-4 text-gray-700">Was möchten Sie mit den Daten machen?</h3>
      <div className="relative">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Beschreiben Sie hier Ihre Anfrage..."
          className="min-h-32 pr-16 resize-none"
        />
        <Button
          onClick={handleSubmit}
          size="icon"
          className="absolute bottom-3 right-3"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}

