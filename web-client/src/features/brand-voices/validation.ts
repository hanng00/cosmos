"use client";

import { z } from "zod";
import { type BrandVoice } from "./api";

export const brandVoiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  purpose: z.string().optional().default(""),
  audience: z.string().optional().default(""),
  tone: z.array(z.string()).default([]),
  emotion: z.array(z.string()).default([]),
  character: z.array(z.string()).default([]),
  syntax: z.array(z.string()).default([]),
  language: z.array(z.string()).default([]),
});

export function validateBrandVoice(voice: BrandVoice): { ok: true } | { ok: false; message: string } {
  const result = brandVoiceSchema.safeParse(voice);
  if (result.success) return { ok: true };
  const message = result.error.errors.map(e => e.message).join(", ");
  return { ok: false, message };
}


