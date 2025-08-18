"use client";

import { authenticatedFetch, publicFetch } from "@/lib/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export type BrandVoice = {
  name: string;
  purpose: string;
  audience: string;
  tone: string[];
  emotion: string[];
  character: string[];
  syntax: string[];
  language: string[];
};

export type CreateVoiceAnalysisParams = { sourceUrl: string; writingSample?: string };
export type CreateVoiceAnalysisResult = { analysisId: string; status: "IN_PROGRESS" | "COMPLETED" | "FAILED" };

export async function createVoiceAnalysis(params: CreateVoiceAnalysisParams): Promise<CreateVoiceAnalysisResult> {
  const url = `${API_BASE_URL}/brand-voices/analyses`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const data = (await res.json()) as CreateVoiceAnalysisResult;
  return data;
}

export type BrandVoiceAnalysis = {
  analysisId: string;
  sourceUrl: string;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  voice?: BrandVoice;
  createdAt: string;
  updatedAt: string;
};

export async function getVoiceAnalysis(analysisId: string): Promise<BrandVoiceAnalysis> {
  const url = `${API_BASE_URL}/brand-voices/analyses/${analysisId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as BrandVoiceAnalysis;
}

export async function createFreeBrandVoice(params: { voice: BrandVoice; email?: string | null }): Promise<{ freeVoiceId: string }>
{
  const res = await publicFetch(`/brand-voices/free`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voice: params.voice, email: params.email ?? null }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as { freeVoiceId: string };
}

export async function claimFreeBrandVoice(params: { freeVoiceId: string }): Promise<{ brandId: string }>
{
  const res = await authenticatedFetch(`/brand-voices/free/${params.freeVoiceId}/claim`, { method: "POST" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as { brandId: string };
}

export async function saveBrandVoice(params: { voice: BrandVoice; brandId?: string; sourceUrl?: string }): Promise<{ next: "auth" | "done"; brandId?: string; jobId?: string } | void> {
  try {
    let brandId = params.brandId;
    if (!brandId) {
      const brandRes = await authenticatedFetch(`/brands`, { method: "POST" });
      if (brandRes.status === 401) return { next: "auth" };
      if (!brandRes.ok) throw new Error(`${brandRes.status} ${brandRes.statusText}`);
      const brand = (await brandRes.json()) as { brandId: string };
      brandId = brand.brandId;
    }

    const saveRes = await authenticatedFetch(`/brands/${brandId}/voice`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params.voice),
    });
    if (saveRes.status === 401) return { next: "auth" };
    if (!saveRes.ok) throw new Error(`${saveRes.status} ${saveRes.statusText}`);

    let jobId: string | undefined;
    if (params.sourceUrl) {
      const genRes = await authenticatedFetch(`/brands/${brandId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl: params.sourceUrl }),
      });
      if (genRes.ok) {
        const data = (await genRes.json()) as { jobId: string };
        jobId = data.jobId;
      }
    }
    return { next: "done", brandId, jobId };
  } catch (e) {
    return { next: "auth" };
  }
}


