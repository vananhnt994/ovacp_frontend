import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useCsvUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadCsv = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validiere Dateityp
      if (!file.name.endsWith(".csv")) {
        throw new Error("Nur CSV-Dateien sind erlaubt");
      }

      // Simuliere Upload (später: echtes Backend)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Datei "${file.name}" erfolgreich hochgeladen!`);
      console.log("CSV hochgeladen:", file);
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

