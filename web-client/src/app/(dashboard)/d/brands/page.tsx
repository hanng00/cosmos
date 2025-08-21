"use client";

import Link from "next/link";
import { useBrands, useCreateBrand } from "@/features/brands/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useCallback } from "react";

export default function BrandPage() {
  const { data, isLoading, error } = useBrands();
  const createBrand = useCreateBrand();
  const queryClient = useQueryClient();

  const handleCreate = useCallback(async () => {
    try {
      await createBrand.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
    } catch {
      // Surface error state through render
    }
  }, [createBrand, queryClient]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brands</h1>
        <Button
          variant="outline"
          onClick={handleCreate}
          disabled={createBrand.isPending}
        >
          {createBrand.isPending ? "Creating…" : "Create brand"}
        </Button>
      </div>
      <Separator />

      {error && (
        <div className="text-sm text-red-600">
          Error: {(error as Error).message}
        </div>
      )}

      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.items ?? []).length === 0 ? (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>No brands yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create your first brand to start generating on-brand content.
                </p>
                <Button onClick={handleCreate} disabled={createBrand.isPending}>
                  {createBrand.isPending ? "Creating…" : "Create brand"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            (data?.items ?? []).map((brand) => {
              const displayName = brand.name?.trim() || "Untitled brand";
              const initials =
                displayName
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? "")
                  .join("") || "B";

              return (
                <Link
                  key={brand.brandId}
                  href={`/d/brands/${brand.brandId}`}
                  className="block group"
                >
                  <Card className="transition hover:shadow-md hover:border-primary/30">
                    <CardHeader className="flex-row items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-muted text-muted-foreground grid place-items-center font-medium">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate">
                          {displayName}
                        </CardTitle>
                        <CardDescription className="truncate">
                          ID: {brand.brandId}
                        </CardDescription>
                      </div>
                      <CardAction>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </CardAction>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
