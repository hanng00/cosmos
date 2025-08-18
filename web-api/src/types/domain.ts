export interface Brand {
  brandId: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandSummary {
  brandId: string;
  name: string;
  createdAt: string;
}

export type JobStatus =
  | "queued"
  | "scraped"
  | "summarized"
  | "first_frame"
  | "completed"
  | "failed";

export interface Job {
  jobId: string;
  brandId: string;
  userId: string;
  sourceUrl: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BrandVoice {
  name: string;
  purpose: string;
  audience: string;
  tone: string[];
  emotion: string[];
  character: string[];
  syntax: string[];
  language: string[];
}

export interface FreeBrandVoice {
  freeVoiceId: string;
  email: string | null;
  voice: BrandVoice;
  createdAt: string;
  updatedAt: string;
}


