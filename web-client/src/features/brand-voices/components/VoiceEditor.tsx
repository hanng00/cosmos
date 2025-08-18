"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import TagsInput from "@/components/ui/TagsInput";
import { type BrandVoice as ApiBrandVoice } from "../api";

interface VoiceEditorProps {
  voice: ApiBrandVoice;
  onChange: (v: ApiBrandVoice) => void;
}

export function VoiceEditor({ voice, onChange }: VoiceEditorProps) {
  return (
    <div className="grid gap-3">
      <Field label="Name" value={voice.name} onChange={(v) => onChange({ ...voice, name: v })} />
      <Field label="Purpose" value={voice.purpose} onChange={(v) => onChange({ ...voice, purpose: v })} />
      <Field label="Audience" value={voice.audience} onChange={(v) => onChange({ ...voice, audience: v })} />
      <TagsField label="Tone" values={voice.tone} onChange={(arr) => onChange({ ...voice, tone: arr })} />
      <TagsField label="Emotion" values={voice.emotion} onChange={(arr) => onChange({ ...voice, emotion: arr })} />
      <TagsField label="Character" values={voice.character} onChange={(arr) => onChange({ ...voice, character: arr })} />
      <TagsField label="Syntax" values={voice.syntax} onChange={(arr) => onChange({ ...voice, syntax: arr })} />
      <TagsField label="Language" values={voice.language} onChange={(arr) => onChange({ ...voice, language: arr })} />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TagsField({ label, values, onChange }: { label: string; values: string[]; onChange: (arr: string[]) => void }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <TagsInput value={values} onChange={onChange} placeholder="Type and press Enter" />
    </div>
  );
}


