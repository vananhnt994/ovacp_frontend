import { useState, useCallback } from "react";

interface QueryState {
  query: string;
  isLoading: boolean;
}

export function useQuery() {
  const [queryState, setQueryState] = useState<QueryState>({
    query: "",
    isLoading: false,
  });

  const submitQuery = useCallback((query: string) => {
    setQueryState({ query, isLoading: true });
    
    // Simuliere Verarbeitung (später: echtes Backend)
    setTimeout(() => {
      setQueryState({ query, isLoading: false });
    }, 500);
  }, []);

  const clearQuery = useCallback(() => {
    setQueryState({ query: "", isLoading: false });
  }, []);

  return {
    ...queryState,
    submitQuery,
    clearQuery,
  };
}

