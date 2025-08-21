import { API_BASE_URL } from "@/lib/config";
import { BrandVoiceAnalysis } from "../types";

export async function getVoiceAnalysis(
  analysisId: string
): Promise<BrandVoiceAnalysis> {
  const url = `${API_BASE_URL}/brand-voices/${analysisId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as BrandVoiceAnalysis;
}
