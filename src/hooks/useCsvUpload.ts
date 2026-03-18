import { useState, useCallback } from "react";
import { toast } from "sonner";
import { uploadCsvFiles as uploadCsvFilesRequest } from "@/services/csvUploadService";

export function useCsvUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadCsv = useCallback(async (files: File[]) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!files.length) {
        throw new Error("Bitte waehlen Sie mindestens eine CSV-Datei aus");
      }

      const invalidFile = files.find((file) => !file.name.toLowerCase().endsWith(".csv"));

      if (invalidFile) {
        throw new Error(`Nur CSV-Dateien sind erlaubt: ${invalidFile.name}`);
      }

      const responseData = await uploadCsvFilesRequest(files);

      const successMessage =
        files.length === 1
          ? `Datei "${files[0].name}" erfolgreich hochgeladen!`
          : `${files.length} CSV-Dateien erfolgreich hochgeladen!`;

      toast.success(successMessage);
      return responseData;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload fehlgeschlagen";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    uploadCsv,
    isLoading,
    error,
  };
}

