import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);

  useEffect(() => {
    // Create QueryClient only on the client side
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          retry: 1,
        },
      },
    });
    setQueryClient(client);
  }, []);

  // Don't render until QueryClient is ready
  if (!queryClient) {
    return <>{children}</>;
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
