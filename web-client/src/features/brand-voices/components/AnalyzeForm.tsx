"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AnalyzeFormProps {
  websiteUrl: string;
  onWebsiteUrlChange: (v: string) => void;
  writingSample: string;
  onWritingSampleChange: (v: string) => void;
  onAnalyze: (args: { sourceUrl: string; writingSample?: string }) => void;
  isAnalyzing: boolean;
  isPolling: boolean;
}

export function AnalyzeForm({ websiteUrl, onWebsiteUrlChange, writingSample, onWritingSampleChange, onAnalyze, isAnalyzing, isPolling }: AnalyzeFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <label htmlFor="brand-voice-url" className="text-sm font-medium">Website URL</label>
        <Input
          id="brand-voice-url"
          type="url"
          placeholder="https://example.com"
          value={websiteUrl}
          onChange={(e) => onWebsiteUrlChange(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="brand-voice-text" className="text-sm font-medium">Sample of your writing (optional)</label>
        <Textarea
          id="brand-voice-text"
          placeholder="Paste a paragraph of your writing to improve accuracy"
          value={writingSample}
          onChange={(e) => onWritingSampleChange(e.target.value)}
          rows={6}
        />
      </div>
      {isPolling && (
        <div className="py-6 text-center text-sm text-muted-foreground">Analyzing your brand voice…</div>
      )}
    </div>
  );
}


