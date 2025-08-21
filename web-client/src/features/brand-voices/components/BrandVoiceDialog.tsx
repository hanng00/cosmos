"use client";

import * as React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AnalyzeForm } from "./AnalyzeForm";
import { VoiceEditor } from "./VoiceEditor";
import { DialogFooterActions } from "./DialogFooterActions";
import {
  useAnalyzeVoice,
  useVoiceDraft,
  useFreeBrandVoiceUserFlow,
} from "../hooks/useFreeBrandVoiceUserFlow";

export function BrandVoiceDialog({
  onClose,
  initialUrl,
}: {
  onClose: () => void;
  initialUrl?: string;
}) {
  const { websiteUrl, setWebsiteUrl, brandVoice, setBrandVoice, clearAll } =
    useVoiceDraft(initialUrl);
  const { state, start, reset } = useAnalyzeVoice();
  const flow = useFreeBrandVoiceUserFlow();
  const [writingSample, setWritingSample] = React.useState("");
  // no-op reference removed; stash occurs in flow hook

  React.useEffect(() => {
    if (state.brandVoice) setBrandVoice(state.brandVoice);
  }, [state.brandVoice, setBrandVoice]);

  const onCancel = () => {
    onClose();
    reset();
    clearAll();
  };

  const onSave = async () => {
    if (!brandVoice) return;
    await flow.saveToAccount({ voice: brandVoice, sourceUrl: websiteUrl });
    onClose();
  };

  const onUseVoice = async () => {
    if (!brandVoice) return;
    await flow.useForContent({ voice: brandVoice, sourceUrl: websiteUrl });
    onClose();
  };

  const hasVoice = !!brandVoice;

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {hasVoice ? "Edit Voice" : "Generate Your Brand Voice"}
        </DialogTitle>
      </DialogHeader>

      {!hasVoice ? (
        <AnalyzeForm
          websiteUrl={websiteUrl}
          onWebsiteUrlChange={setWebsiteUrl}
          writingSample={writingSample}
          onWritingSampleChange={setWritingSample}
          onAnalyze={start}
          isAnalyzing={state.isAnalyzing}
          isPolling={state.isPolling}
        />
      ) : (
        <VoiceEditor voice={brandVoice} onChange={setBrandVoice} />
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <DialogFooter>
        <DialogFooterActions
          hasVoice={hasVoice}
          isAnalyzing={state.isAnalyzing}
          isPolling={state.isPolling}
          onCancel={onCancel}
          onAnalyze={() =>
            start({
              sourceUrl: websiteUrl,
              writingSample: writingSample || undefined,
            })
          }
          onSave={onSave}
          onUseVoice={onUseVoice}
        />
      </DialogFooter>
    </DialogContent>
  );
}
