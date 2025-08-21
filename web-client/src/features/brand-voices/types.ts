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

export type BrandVoiceAnalysis = {
  analysisId: string;
  sourceUrl: string;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  voice?: BrandVoice;
  createdAt: string;
  updatedAt: string;
};
