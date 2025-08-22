"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthEvents } from "@/features/auth/AuthProvider";
import { useFreeBrandVoiceUserFlow } from "./useFreeBrandVoiceUserFlow";
import { useVoiceStore } from "../store";
import { saveBrandVoice } from "@/features/brands/api";
import { normalizeVoice } from "../utils/voice";

export function useAuthSuccessHandlers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = useFreeBrandVoiceUserFlow();
  const { registerOnAuthSuccess } = useAuthEvents();
  const { pendingToSave, setPendingToSave } = useVoiceStore();

  React.useEffect(() => {
    const handleAuthSuccess = async () => {
      const freeVoiceId = searchParams.get("free_brand_voice_id");
      
      // Handle free brand voice claiming
      if (freeVoiceId) {
        console.log("Attempting to claim free brand voice...");
        const result = await flow.claimFreeVoice(freeVoiceId);
        
        if (result.success) {
          console.log("Claim successful, redirect handled by claimFreeVoice");
          return; // claimFreeVoice handles the redirect
        }
        console.warn("Failed to claim free brand voice");
      }

      // Handle pending saves
      if (pendingToSave) {
        try {
          const res = await saveBrandVoice({
            voice: normalizeVoice(pendingToSave.voice),
            sourceUrl: pendingToSave.sourceUrl,
          });
          
          if (res?.next === "done" && res.brandId) {
            setPendingToSave(undefined);
            const redirectUrl = res.jobId 
              ? `/brands/${res.brandId}/generate/${res.jobId}`
              : `/brands/${res.brandId}`;
            router.replace(redirectUrl);
            return; // We handled the redirect
          }
        } catch (error) {
          console.error("Failed to complete pending save:", error);
        }
      }
    };

    return registerOnAuthSuccess(handleAuthSuccess);
  }, [searchParams, pendingToSave, flow, router, setPendingToSave, registerOnAuthSuccess]);
}