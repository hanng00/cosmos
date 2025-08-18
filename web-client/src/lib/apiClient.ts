"use client";

import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function authenticatedFetch(input: string, init?: RequestInit) {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  const headers = new Headers(init?.headers || {});
  if (idToken) headers.set("Authorization", `Bearer ${idToken}`);

  const url = input.startsWith("http") ? input : `${API_BASE_URL}${input}`;
  return fetch(url, { ...init, headers });
}


