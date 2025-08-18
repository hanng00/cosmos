"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface DialogFooterActionsProps {
  hasVoice: boolean;
  isAnalyzing: boolean;
  isPolling: boolean;
  onCancel: () => void;
  onAnalyze?: () => void;
  onSave?: () => void;
  onUseVoice?: () => void;
}

export function DialogFooterActions({
  hasVoice,
  isAnalyzing,
  isPolling,
  onCancel,
  onAnalyze,
  onSave,
  onUseVoice,
}: DialogFooterActionsProps) {
  return (
    <>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      {!hasVoice ? (
        <>
          {!isPolling && (
            <Button disabled={isAnalyzing} onClick={onAnalyze}>
              {isAnalyzing ? "Starting…" : "Analyze"}
            </Button>
          )}
          {isPolling && (
            <div className="px-2 text-sm text-muted-foreground">Analyzing…</div>
          )}
        </>
      ) : (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onSave}>
            Save Voice to My Account
          </Button>
          <Button onClick={onUseVoice}>Use Voice to Create Content</Button>
        </div>
      )}
    </>
  );
}
