"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createVoiceAnalysis,
  getVoiceAnalysis,
  saveBrandVoice,
  createFreeBrandVoice,
  claimFreeBrandVoice,
  type BrandVoice,
  type CreateVoiceAnalysisResult,
  type BrandVoiceAnalysis,
} from "./api";
import { useVoiceStore } from "./store";
import { getErrorMessage, normalizeVoice } from "./utils/voice";
import { validateBrandVoice } from "./validation";

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
    setDraft({ sourceUrl: websiteUrl, voice: brandVoice as any });
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

  const analyze = useMutation<CreateVoiceAnalysisResult, unknown, { sourceUrl: string; writingSample?: string }>(
    {
      mutationFn: createVoiceAnalysis,
      onSuccess: (data) => {
        setAnalysisId(data.analysisId);
      },
      onError: (e: unknown) => setError(getErrorMessage(e)),
    }
  );

  const queryKey = React.useMemo(() => ["voiceAnalysis", analysisId] as const, [analysisId]);

  const analysisQuery = useQuery<BrandVoiceAnalysis, Error, BrandVoiceAnalysis, readonly [string, string | null]>({
    queryKey,
    queryFn: async (): Promise<BrandVoiceAnalysis> => {
      if (!analysisId) throw new Error("No analysisId");
      return getVoiceAnalysis(analysisId);
    },
    enabled: Boolean(analysisId),
    refetchInterval: (data) => (data?.status === "IN_PROGRESS" ? 1500 : false),
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

export function useSaveOrUseVoice() {
  const router = useRouter();
  return {
    save: async (args: { voice: BrandVoice; sourceUrl?: string }) => {
      const valid = validateBrandVoice(args.voice);
      if (!valid.ok) throw new Error(valid.message);
      const res = await saveBrandVoice({ voice: args.voice, sourceUrl: args.sourceUrl });
      if (res?.next === "auth") return { next: "auth" as const };
      if (res?.next === "done" && res.brandId) {
        if (res.jobId) router.push(`/brands/${res.brandId}/generate/${res.jobId}`);
        else router.push(`/brands/${res.brandId}`);
      }
      return { next: "done" as const };
    },
    useFree: async (args: { voice: BrandVoice }) => {
      const valid = validateBrandVoice(args.voice);
      if (!valid.ok) throw new Error(valid.message);
      const { freeVoiceId } = await createFreeBrandVoice({ voice: args.voice });
      router.push(`/signup?free_brand_voice_id=${encodeURIComponent(freeVoiceId)}`);
    },
    claimFree: async (freeVoiceId: string) => {
      const { brandId } = await claimFreeBrandVoice({ freeVoiceId });
      router.replace(`/brands/${brandId}`);
    },
  } as const;
}


