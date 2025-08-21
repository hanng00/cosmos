"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { BrandVoiceDialog } from "./components/BrandVoiceDialog";
import { useAuthSuccessHandlers } from "./hooks/useAuthSuccessHandlers";
import { useVoiceStore } from "./store";

export function BrandVoiceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpen = useVoiceStore((s) => s.modal.isOpen);
  const closeModal = useVoiceStore((s) => s.closeModal);
  const draft = useVoiceStore((s) => s.draft);

  useAuthSuccessHandlers();

  return (
    <>
      {children}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => (open ? null : closeModal())}
      >
        {isOpen && (
          <BrandVoiceDialog
            onClose={closeModal}
            initialUrl={draft?.sourceUrl}
          />
        )}
      </Dialog>
    </>
  );
}
