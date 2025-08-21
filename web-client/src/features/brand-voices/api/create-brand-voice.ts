import { API_BASE_URL } from "@/lib/config";

export type CreateVoiceAnalysisParams = {
  sourceUrl: string;
  writingSample?: string;
};
export type CreateVoiceAnalysisResult = {
  analysisId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
};

export async function createVoiceAnalysis(
  params: CreateVoiceAnalysisParams
): Promise<CreateVoiceAnalysisResult> {
  const url = `${API_BASE_URL}/brand-voices/create`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const data = (await res.json()) as CreateVoiceAnalysisResult;
  return data;
}
