"use client";

import { z } from "zod";

export const BrandVoiceSchema = z.object({
  name: z.string().min(1),
  purpose: z.string().min(1),
  audience: z.string().min(1),
  tone: z.array(z.string()).min(1),
  emotion: z.array(z.string()).min(1),
  character: z.array(z.string()).min(1),
  syntax: z.array(z.string()).min(1),
  language: z.array(z.string()).min(1),
});
