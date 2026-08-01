"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

/**
 * `<QueryProvider>` wraps the app with a TanStack Query `QueryClientProvider`.
 *
 * Creates a stable `QueryClient` instance per component mount using `useState`
 * to ensure server-side rendering compatibility (AD-5, AD-6).
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
