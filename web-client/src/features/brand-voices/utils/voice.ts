"use client";

import { type BrandVoice as ApiBrandVoice } from "../api";

export function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x) => typeof x === "string");
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

type LooseVoice = Partial<{
  name: unknown;
  brandName: unknown;
  purpose: unknown;
  audience: unknown;
  tone: unknown;
  emotion: unknown;
  character: unknown;
  syntax: unknown;
  language: unknown;
}>;

export function normalizeVoice(v: unknown): ApiBrandVoice {
  const value = (v ?? {}) as LooseVoice;
  return {
    name: typeof value.name === "string" && value.name.length > 0 ? value.name : (typeof value.brandName === "string" ? value.brandName : ""),
    purpose: typeof value.purpose === "string" ? value.purpose : "",
    audience: typeof value.audience === "string" ? value.audience : "",
    tone: toArray(value.tone),
    emotion: toArray(value.emotion),
    character: toArray(value.character),
    syntax: toArray(value.syntax),
    language: toArray(value.language),
  };
}

export function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err)
    return String((err as { message?: unknown }).message);
  return "Something went wrong. Please try again.";
}


