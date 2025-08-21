"use client";

import { authenticatedFetch } from "@/lib/apiClient";

export type Brand = {
  brandId: string;
  name: string;
  createdAt?: string;
  voiceSnapshot?: import("@/features/brand-voices/types").BrandVoice;
};

export type Post = {
  postId: string;
  brandId: string;
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  status: "draft" | "generated" | "published";
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

// Re-export brand voice management
export { saveBrandVoice } from "./api/save-brand-voice";


