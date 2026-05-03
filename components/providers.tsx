"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { isApiError } from "@/lib/api";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            // Queries are read-only (GET) in this app; keep retries bounded and only for transient failures.
            retry: (failureCount, error) => {
              if (failureCount >= 2) {
                return false;
              }
              if (!isApiError(error)) {
                return true;
              }
              return error.kind === "unavailable";
            },
            retryDelay: (attempt) => Math.min(1000 * (attempt + 1), 3000),
          },
          // Never auto-retry mutations to avoid duplicate writes.
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
