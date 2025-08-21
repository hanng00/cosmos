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
    <div className="flex flex-row gap-2 justify-between w-full">
      <Button variant="secondary" onClick={onCancel} size="sm">
        Cancel
      </Button>
      {!hasVoice && (
        <>
          {!isPolling && (
            <Button disabled={isAnalyzing} onClick={onAnalyze} size="sm">
              {isAnalyzing ? "Starting…" : "Analyze"}
            </Button>
          )}
          {isPolling && (
            <div className="px-2 text-sm text-muted-foreground">Analyzing…</div>
          )}
        </>
      )}

      {hasVoice && (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onSave} size="sm">
            Save Voice to My Account
          </Button>
          <Button onClick={onUseVoice} size="sm">
            Use Voice to Create Content
          </Button>
        </div>
      )}
    </div>
  );
}
