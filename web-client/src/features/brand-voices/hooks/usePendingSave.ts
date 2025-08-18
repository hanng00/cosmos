"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useVoiceStore } from "../store";
import { saveBrandVoice } from "../api";
import { normalizeVoice } from "../utils/voice";

export function usePendingSave() {
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const pending = useVoiceStore.getState().pendingToSave as any;
      if (!pending) return;
      try {
        const res = await saveBrandVoice({ voice: normalizeVoice(pending.voice), sourceUrl: pending.sourceUrl });
        if (res?.next === "done" && res.brandId) {
          useVoiceStore.getState().setPendingToSave(undefined);
          if (res.jobId) router.replace(`/brands/${res.brandId}/generate/${res.jobId}`);
          else router.replace(`/brands/${res.brandId}`);
        }
      } catch {
        // no-op; user can retry manually
      }
    })();
  }, [router]);
}


