"use client";

import { authenticatedFetch } from "@/lib/apiClient";

export type Brand = {
  brandId: string;
  name: string;
  createdAt?: string;
  voiceSnapshot?: import("@/features/brand-voices/types").BrandVoice;
};

export type PostStatus = "draft" | "generating" | "generated" | "published";

export type PostMetadata = {
  generatedBy?: "llm" | "user";
  model?: string;
  processingTime?: number;
  [key: string]: any;
};

export type Post = {
  postId: string;
  userId: string;
  brandId: string;
  instruction: string;
  title: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  hashtags?: string[];
  status: PostStatus;
  metadata: PostMetadata;
  createdAt: string;
  updatedAt: string;
};

export async function createBrand(): Promise<Brand> {
  const res = await authenticatedFetch("/brands", { method: "POST" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as Brand;
}

export async function listBrands(): Promise<{ items: Brand[] }> {
  const res = await authenticatedFetch("/brands");
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as { items: Brand[] };
}

export async function getBrand(brandId: string): Promise<Brand> {
  const res = await authenticatedFetch(`/brands/${brandId}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as Brand;
}

export async function patchBrand(brandId: string, patch: { name?: string }): Promise<Brand> {
  const res = await authenticatedFetch(`/brands/${brandId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as Brand;
}

export async function listBrandPosts(brandId: string): Promise<{ items: Post[] }> {
  const res = await authenticatedFetch(`/brands/${brandId}/posts`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as { items: Post[] };
}

export async function getBrandPost(brandId: string, postId: string): Promise<Post> {
  const res = await authenticatedFetch(`/brands/${brandId}/posts/${postId}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as Post;
}

export interface CreatePostRequest {
  instruction: string;
}

export async function createBrandPost(brandId: string, request: CreatePostRequest): Promise<Post> {
  const res = await authenticatedFetch(`/brands/${brandId}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as Post;
}

// Re-export brand voice management
export { saveBrandVoice } from "./api/save-brand-voice";


