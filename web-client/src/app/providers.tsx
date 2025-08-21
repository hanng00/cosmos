"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { BrandVoiceProvider } from "@/features/brand-voices/BrandVoiceProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrandVoiceProvider>
          {children}
          <Toaster />
        </BrandVoiceProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
