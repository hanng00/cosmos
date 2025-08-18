"use client";

import { authenticatedFetch } from "@/lib/apiClient";

export type Me = {
  userId: string;
  email: string | null;
};

export async function getMe(): Promise<Me | null> {
  const res = await authenticatedFetch("/me");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as Me;
}


