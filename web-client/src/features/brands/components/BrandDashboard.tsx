"use client";

import * as React from "react";
import { type Brand } from "@/features/brands/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  brand: Brand | undefined;
  isLoading?: boolean;
  onRename?: (newName: string) => Promise<void> | void;
};

function SectionHeading(props: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium text-muted-foreground mb-2">
      {props.children}
    </h2>
  );
}

export function BrandDashboard({ brand, isLoading, onRename }: Props) {
  const displayName =
    brand?.name?.trim() || (isLoading ? "Loading…" : "Untitled brand");
  const initials =
    displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "B";

  const voice = brand?.voiceSnapshot;
  const voiceTags: string[] = React.useMemo(() => {
    if (!voice) return [];
    const pools = [
      voice.tone,
      voice.emotion,
      voice.character,
      voice.syntax,
      voice.language,
    ].filter(Boolean) as string[][];
    const flat = pools.flat();
    const seen = new Set<string>();
    return flat
      .filter((t) => {
        const key = t.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 12);
  }, [voice]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 grid place-items-center rounded-full bg-muted text-muted-foreground font-medium">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold truncate">{displayName}</h1>
            <p className="text-xs text-muted-foreground truncate">
              ID: {brand?.brandId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRename && (
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const next = window.prompt("Rename brand", brand?.name ?? "");
                if (!next) return;
                await onRename(next);
              }}
            >
              Edit name
            </Button>
          )}
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <SectionHeading>Brand Styles</SectionHeading>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Logos</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg bg-muted/80 grid place-items-center text-muted-foreground">
                {initials}
              </div>
              <Button size="sm" variant="outline">
                Upload Logo
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionHeading>Brand Voice</SectionHeading>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Voice Attributes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {voiceTags.length > 0 ? (
                voiceTags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No voice saved yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Source Materials intentionally omitted for now */}
        </div>
      </div>

      {/* Lower sections are handled by the page: Posts list, etc. */}
    </div>
  );
}
