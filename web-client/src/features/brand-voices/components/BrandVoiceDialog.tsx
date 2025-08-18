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
import { useAnalyzeVoice, useVoiceDraft, useSaveOrUseVoice } from "../hooks";
import { useVoiceStore } from "../store";

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
  const actions = useSaveOrUseVoice();
  const [writingSample, setWritingSample] = React.useState("");
  const setPendingToSave = useVoiceStore((state) => state.setPendingToSave);

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
    const res = await actions.save({
      voice: brandVoice,
      sourceUrl: websiteUrl,
    });
    if (res.next === "auth") {
      setPendingToSave({ sourceUrl: websiteUrl, voice: brandVoice });
      // redirect is handled in save() caller when next !== done; here we only stash pending state
    } else {
      onClose();
    }
  };

  const onUseVoice = async () => {
    if (!brandVoice) return;
    await actions.useFree({ voice: brandVoice });
  };

  const hasVoice = !!brandVoice;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {hasVoice ? "Review Your Brand Voice" : "Generate Your Brand Voice"}
        </DialogTitle>
        <DialogDescription>
          {hasVoice
            ? "You can refine any field below before saving."
            : "Enter your website and optionally paste a short sample of your writing. We'll analyze your tone, style, and audience."}
        </DialogDescription>
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
