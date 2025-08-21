import { authenticatedFetch } from "@/lib/apiClient";
import { BrandVoice } from "../../brand-voices/types";

export async function saveBrandVoice(params: {
  voice: BrandVoice;
  brandId?: string;
  sourceUrl?: string;
}): Promise<{
  next: "auth" | "done";
  brandId?: string;
  jobId?: string;
} | void> {
  try {
    let brandId = params.brandId;
    if (!brandId) {
      const brandRes = await authenticatedFetch(`/brands`, { method: "POST" });
      if (brandRes.status === 401) return { next: "auth" };
      if (!brandRes.ok)
        throw new Error(`${brandRes.status} ${brandRes.statusText}`);
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
  } catch {
    return { next: "auth" };
  }
}
