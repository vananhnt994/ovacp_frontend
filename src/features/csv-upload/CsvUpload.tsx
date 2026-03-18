import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useCsvUpload } from "@/hooks/useCsvUpload";

interface CsvUploadProps {
  onUploadedFileNamesChange?: (fileNames: string[]) => void;
}

export function CsvUpload({ onUploadedFileNamesChange }: CsvUploadProps) {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const { uploadCsv, isLoading } = useCsvUpload();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length) {
      const selectedFileNames = selectedFiles.map((file) => file.name);
      setFileNames(selectedFileNames);

      try {
        await uploadCsv(selectedFiles);
        onUploadedFileNamesChange?.(selectedFileNames);
      } finally {
        e.target.value = "";
      }
    }
  };

  return (
    <Card className="w-full p-6">
      <h3 className="mb-4 text-gray-700">CSV-Dateien hochladen</h3>
      <div className="flex items-center gap-4">
        <label htmlFor="csv-upload" className={isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}>
          <Button asChild variant="outline">
            <span>
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? "Lade hoch..." : "Dateien auswählen"}
            </span>
          </Button>
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
        />
        {fileNames.length > 0 && (
          <span className="text-sm text-gray-600">
            {fileNames.length === 1 ? fileNames[0] : `${fileNames.length} Dateien ausgewaehlt`}
          </span>
        )}
      </div>
    </Card>
  );
}

