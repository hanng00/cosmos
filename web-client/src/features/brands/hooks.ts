"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createBrand, listBrands, getBrand, patchBrand, listBrandPosts, type Post } from "./api";

export function useCreateBrand() {
  return useMutation({ mutationFn: createBrand });
}

export function useBrands() {
  return useQuery({ queryKey: ["brands"], queryFn: listBrands });
}

export function useBrand(brandId: string | undefined) {
  return useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => {
      if (!brandId) throw new Error("No brandId");
      return getBrand(brandId);
    },
    enabled: Boolean(brandId),
  });
}

export function useRenameBrand(brandId: string | undefined) {
  return useMutation({
    mutationFn: async (name: string) => {
      if (!brandId) throw new Error("No brandId");
      return patchBrand(brandId, { name });
    },
  });
}

export function useBrandPosts(brandId: string | undefined) {
  return useQuery<{ items: Post[] }>({
    queryKey: ["brand", brandId, "posts"],
    queryFn: () => {
      if (!brandId) throw new Error("No brandId");
      return listBrandPosts(brandId);
    },
    enabled: Boolean(brandId),
  });
}


