"use client";

import { useParams, useSearchParams } from "next/navigation";

export default function BrandGeneratingPage() {
  const params = useParams<{ brandId: string; jobId: string }>();
  const sp = useSearchParams();
  const sourceUrl = sp.get("sourceUrl");
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Generating…</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Brand {params.brandId} — Job {params.jobId}
          {sourceUrl ? ` for ${sourceUrl}` : ""}
        </p>
      </div>
    </div>
  );
}


