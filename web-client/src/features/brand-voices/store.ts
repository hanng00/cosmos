"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type BrandVoice } from "./api";

export type VoicePayload = {
  sourceUrl: string;
  voice?: BrandVoice | null;
};

type VoiceState = {
  draft?: VoicePayload;
  pendingToSave?: VoicePayload;
  setDraft: (draft?: VoicePayload) => void;
  setPendingToSave: (pending?: VoicePayload) => void;
  clearAll: () => void;
};

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      draft: undefined,
      pendingToSave: undefined,
      setDraft: (draft?: VoicePayload) => set({ draft }),
      setPendingToSave: (pending?: VoicePayload) => set({ pendingToSave: pending }),
      clearAll: () => set({ draft: undefined, pendingToSave: undefined }),
    }),
    { name: "cosmos-voice-store" }
  )
);


