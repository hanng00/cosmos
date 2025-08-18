"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { BrandVoiceDialog } from "./components/BrandVoiceDialog";
import { usePendingSave } from "./hooks/usePendingSave";

interface BrandVoiceContextValue {
  open: (url?: string) => void;
  close: () => void;
}

const BrandVoiceContext = React.createContext<BrandVoiceContextValue | null>(null);

export function useBrandVoiceModal(): BrandVoiceContextValue {
  const ctx = React.useContext(BrandVoiceContext);
  if (!ctx) throw new Error("useBrandVoiceModal must be used within BrandVoiceProvider");
  return ctx;
}

export function BrandVoiceProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialUrl, setInitialUrl] = React.useState<string | undefined>(undefined);

  usePendingSave();

  const open = React.useCallback((url?: string) => {
    setInitialUrl(url);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    setInitialUrl(undefined);
  }, []);

  return (
    <BrandVoiceContext.Provider value={{ open, close }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {isOpen && <BrandVoiceDialog onClose={close} initialUrl={initialUrl} />}
      </Dialog>
    </BrandVoiceContext.Provider>
  );
}


