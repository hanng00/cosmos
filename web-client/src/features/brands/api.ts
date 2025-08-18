"use client";

import { authenticatedFetch } from "@/lib/apiClient";

export type Brand = {
  brandId: string;
  name: string;
  createdAt?: string;
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


