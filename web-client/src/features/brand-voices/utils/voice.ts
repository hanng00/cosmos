"use client";

import { type BrandVoice as ApiBrandVoice } from "../api";

export function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x) => typeof x === "string");
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

export function normalizeVoice(v: unknown): ApiBrandVoice {
  const anyValue: any = v as any;
  return {
    name: anyValue?.name ?? anyValue?.brandName ?? "",
    purpose: anyValue?.purpose ?? "",
    audience: anyValue?.audience ?? "",
    tone: toArray(anyValue?.tone),
    emotion: toArray(anyValue?.emotion),
    character: toArray(anyValue?.character),
    syntax: toArray(anyValue?.syntax),
    language: toArray(anyValue?.language),
  } as ApiBrandVoice;
}

export function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err)
    return String((err as { message?: unknown }).message);
  return "Something went wrong. Please try again.";
}


