import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";

export function CsvUpload() {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Card className="w-full p-6">
      <h3 className="mb-4 text-gray-700">CSV-Dateien hochladen</h3>
      <div className="flex items-center gap-4">
        <label htmlFor="csv-upload" className="cursor-pointer">
          <Button asChild variant="outline">
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Datei auswählen
            </span>
          </Button>
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        {fileName && (
          <span className="text-sm text-gray-600">
            {fileName}
          </span>
        )}
      </div>
    </Card>
  );
}
