export interface Brand {
  brandId: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Optional snapshot of the saved Brand Voice for quick reads
  voiceSnapshot?: BrandVoice;
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

export type PostStatus = "draft" | "generating" | "generated" | "published";

export interface Post {
  postId: string;
  userId: string;
  brandId: string;
  instruction: string; // User's original instruction
  title: string; // LLM-generated
  content: string; // LLM-generated main content
  excerpt?: string; // LLM-generated
  thumbnailUrl?: string; // LLM-generated or extracted
  hashtags?: string[]; // LLM-generated
  status: PostStatus;
  metadata: PostMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface PostMetadata {
  generatedBy?: "llm" | "user";
  model?: string;
  processingTime?: number;
  [key: string]: any; // Additional metadata based on channel/format
}


