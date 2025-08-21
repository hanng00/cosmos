import { publicFetch } from "@/lib/apiClient";
import { BrandVoice } from "../types";

export async function createFreeBrandVoice(params: {
  voice: BrandVoice;
  email?: string | null;
  sourceUrl?: string;
}): Promise<{ freeVoiceId: string }> {
  const res = await publicFetch(`/free-brand-voices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voice: params.voice, email: params.email ?? null, sourceUrl: params.sourceUrl }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as { freeVoiceId: string };
}
