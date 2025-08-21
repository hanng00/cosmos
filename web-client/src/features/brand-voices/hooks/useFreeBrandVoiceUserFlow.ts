"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useVoiceStore } from "../store";
import { normalizeVoice, getErrorMessage } from "../utils/voice";
import {
  createVoiceAnalysis,
  getVoiceAnalysis,
  createFreeBrandVoice,
  claimFreeBrandVoice,
  type BrandVoice,
  type CreateVoiceAnalysisResult,
  type BrandVoiceAnalysis,
} from "../api";
import { saveBrandVoice } from "@/features/brands/api";
import { useMe } from "@/features/auth/useMe";
import { getUrlIfValid } from "@/lib/url";

type SaveArgs = { voice: BrandVoice; sourceUrl?: string };

// UI State Hooks (consolidated from hooks.ts)

export function useVoiceDraft(initialUrl?: string) {
  const { draft, setDraft, clearAll } = useVoiceStore();
  const [websiteUrl, setWebsiteUrl] = React.useState(initialUrl ?? "");
  const [brandVoice, setBrandVoice] = React.useState<BrandVoice | null>(null);

  React.useEffect(() => {
    if (draft) {
      if (draft.sourceUrl) setWebsiteUrl(draft.sourceUrl);
      if (draft.voice) setBrandVoice(normalizeVoice(draft.voice));
    } else if (initialUrl) {
      setWebsiteUrl(initialUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setDraft({ sourceUrl: websiteUrl, voice: brandVoice ?? null });
  }, [websiteUrl, brandVoice, setDraft]);

  return { websiteUrl, setWebsiteUrl, brandVoice, setBrandVoice, clearAll } as const;
}

export interface VoiceAnalysisState {
  analysisId: string | null;
  brandVoice: BrandVoice | null;
  error: string | null;
  isAnalyzing: boolean;
  isPolling: boolean;
}

export function useAnalyzeVoice() {
  const [analysisId, setAnalysisId] = React.useState<string | null>(null);
  const [brandVoice, setBrandVoice] = React.useState<BrandVoice | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const analyze = useMutation<CreateVoiceAnalysisResult, unknown, { sourceUrl: string; writingSample?: string }>({
    mutationFn: createVoiceAnalysis,
    onSuccess: (data) => {
      setAnalysisId(data.analysisId);
    },
    onError: (e: unknown) => setError(getErrorMessage(e)),
  });

  const queryKey = React.useMemo(() => ["voiceAnalysis", analysisId] as const, [analysisId]);

  const analysisQuery = useQuery<BrandVoiceAnalysis, Error, BrandVoiceAnalysis, readonly [string, string | null]>({
    queryKey,
    queryFn: async (): Promise<BrandVoiceAnalysis> => {
      if (!analysisId) throw new Error("No analysisId");
      return getVoiceAnalysis(analysisId);
    },
    enabled: Boolean(analysisId),
    refetchInterval: (query) => (query.state.data?.status === "IN_PROGRESS" ? 1500 : false),
    retry: true,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    const data = analysisQuery.data;
    if (!data) return;
    if (data.status === "COMPLETED" && data.voice) {
      setBrandVoice(normalizeVoice(data.voice));
    } else if (data.status !== "IN_PROGRESS") {
      setError("Voice generation failed. Please try again.");
    }
  }, [analysisQuery.data]);

  return {
    state: {
      analysisId,
      brandVoice,
      error,
      isAnalyzing: analyze.isPending,
      isPolling: Boolean(analysisQuery.data?.status === "IN_PROGRESS" || analysisQuery.isFetching),
    } as VoiceAnalysisState,
    start: (args: { sourceUrl: string; writingSample?: string }) => {
      setError(null);
      analyze.mutate(args);
    },
    reset: () => {
      setAnalysisId(null);
      setBrandVoice(null);
      setError(null);
    },
  } as const;
}

// Business Logic Flow

export function useFreeBrandVoiceUserFlow() {
  const router = useRouter();
  const { data: me } = useMe();
  const setPendingToSave = useVoiceStore((state) => state.setPendingToSave);
  const openModal = useVoiceStore((s) => s.openModal);

  // Save the user's brand voice to their account. If not signed in, stash and redirect to signup.
  const saveToAccount = async (args: SaveArgs) => {
    const normalized = normalizeVoice(args.voice);
    if (me === null) {
      setPendingToSave({ voice: normalized, sourceUrl: args.sourceUrl ?? "" });
      router.push("/signup");
      return { next: "auth" as const };
    }
    const res = await saveBrandVoice({
      voice: normalized,
      sourceUrl: args.sourceUrl,
    });
    if (res?.next === "done" && res.brandId) {
      if (res.jobId)
        router.replace(`/brands/${res.brandId}/generate/${res.jobId}`);
      else router.replace(`/brands/${res.brandId}`);
    } else if (res?.next === "auth") {
      setPendingToSave({ voice: normalized, sourceUrl: args.sourceUrl ?? "" });
      router.push("/signup");
    }
    return res ?? { next: "done" as const };
  };

  // Use the generated voice to start content creation. If unauthenticated, create a free voice record and send to signup to claim.
  const useForContent = async (args: SaveArgs) => {
    const normalized = normalizeVoice(args.voice);
    if (me) {
      const res = await saveBrandVoice({
        voice: normalized,
        sourceUrl: args.sourceUrl,
      });
      if (res?.next === "done" && res.brandId) {
        if (res.jobId)
          router.push(`/brands/${res.brandId}/generate/${res.jobId}`);
        else router.push(`/brands/${res.brandId}`);
      } else if (res?.next === "auth") {
        setPendingToSave({ voice: normalized, sourceUrl: args.sourceUrl ?? "" });
        router.push("/signup");
      }
      return res ?? { next: "done" as const };
    }
    if (me === null) {
      const { freeVoiceId } = await createFreeBrandVoice({
        voice: normalized,
        sourceUrl: args.sourceUrl,
      });
      router.push(
        `/signup?free_brand_voice_id=${encodeURIComponent(freeVoiceId)}`
      );
      return { next: "auth" as const };
    }
    // me is undefined (loading). Try save; fall back to auth if 401.
    const res = await saveBrandVoice({
      voice: normalized,
      sourceUrl: args.sourceUrl,
    });
    if (res?.next === "auth") {
      setPendingToSave({ voice: normalized, sourceUrl: args.sourceUrl ?? "" });
      router.push("/signup");
      return { next: "auth" as const };
    }
    if (res?.next === "done" && res.brandId) {
      if (res.jobId)
        router.push(`/brands/${res.brandId}/generate/${res.jobId}`);
      else router.push(`/brands/${res.brandId}`);
    }
    return res ?? { next: "done" as const };
  };

  // Claim a free brand voice and redirect to the brand page
  const claimFreeVoice = async (freeVoiceId: string) => {
    try {
      console.log("Claiming free brand voice:", freeVoiceId);
      const { brandId } = await claimFreeBrandVoice({ freeVoiceId });
      console.log("Successfully claimed brand voice, redirecting to brand:", brandId);
      router.push(`/d/brands/${brandId}`);
      return { success: true, brandId };
    } catch (error) {
      console.error("Failed to claim free brand voice:", error);
      return { success: false, error };
    }
  };

  return {
    startFromUrl: (input: string): { ok: true } | { ok: false; error: string } => {
      const valid = getUrlIfValid(input);
      if (!valid) return { ok: false, error: "Please enter a valid URL." };
      
      // If user is already signed in, redirect to brands (no free flow)
      if (me) {
        router.push("/d/brands");
        return { ok: true };
      }
      
      // Only open modal for unauthenticated users (customer acquisition)
      openModal(valid.toString());
      return { ok: true };
    },
    saveToAccount,
    useForContent,
    claimFreeVoice,
  };
}
