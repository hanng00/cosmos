"use client";

import { authenticatedFetch } from "@/lib/apiClient";
import { fetchAuthSession } from "aws-amplify/auth";

export type Me = {
  userId: string;
  email: string | null;
};

export async function getMe(): Promise<Me | null> {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) return null;
  const res = await authenticatedFetch("/me");
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as Me;
}


