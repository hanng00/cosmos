import { authenticatedFetch } from "@/lib/apiClient";

export async function claimFreeBrandVoice(params: {
  freeVoiceId: string;
}): Promise<{ brandId: string }> {
  const res = await authenticatedFetch(
    `/free-brand-voices/${params.freeVoiceId}/claim`,
    { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freeVoiceId: params.freeVoiceId })
    }
  );
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as { brandId: string };
}
