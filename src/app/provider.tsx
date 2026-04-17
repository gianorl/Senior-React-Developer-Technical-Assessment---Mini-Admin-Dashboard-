import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { MainErrorFallback } from "@/components/errors/main";
import { Notifications } from "@/components/ui/notifications";
import { Spinner } from "@/components/ui/spinner";
import { AuthLoader } from "@/features/auth/components/auth-guard";
import { queryConfig } from "@/lib/react-query";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <Notifications />
          <AuthLoader
            renderLoading={() => (
              <div className="flex h-screen w-screen items-center justify-center">
                <Spinner size="xl" />
              </div>
            )}
          >
            {children}
          </AuthLoader>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
