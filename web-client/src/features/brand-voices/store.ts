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
  modal: { isOpen: boolean };
  setDraft: (draft?: VoicePayload) => void;
  setPendingToSave: (pending?: VoicePayload) => void;
  openModal: (url?: string) => void;
  closeModal: () => void;
  clearAll: () => void;
};

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      draft: undefined,
      pendingToSave: undefined,
      modal: { isOpen: false },
      setDraft: (draft?: VoicePayload) => set({ draft }),
      setPendingToSave: (pending?: VoicePayload) => set({ pendingToSave: pending }),
      openModal: (url?: string) => set((state) => ({
        draft: url ? { ...(state.draft ?? {}), sourceUrl: url, voice: state.draft?.voice ?? null } : state.draft,
        modal: { isOpen: true },
      })),
      closeModal: () => set((state) => ({ modal: { isOpen: false }, draft: state.draft })),
      clearAll: () => set({ draft: undefined, pendingToSave: undefined }),
    }),
    { name: "cosmos-voice-store" }
  )
);


