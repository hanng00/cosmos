"use client";

import { authenticatedFetch } from "@/lib/apiClient";

export async function generateUnderBrand(params: {
  brandId: string;
  sourceUrl: string;
}): Promise<{ jobId: string; brandId: string }> {
  const res = await authenticatedFetch(`/brands/${params.brandId}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sourceUrl: params.sourceUrl }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as { jobId: string; brandId: string };
}


