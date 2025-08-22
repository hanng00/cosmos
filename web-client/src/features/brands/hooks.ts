"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrand, listBrands, getBrand, patchBrand, listBrandPosts, getBrandPost, createBrandPost, type Post, type CreatePostRequest } from "./api";

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

export function useBrandPost(brandId: string | undefined, postId: string | undefined) {
  return useQuery({
    queryKey: ["brand", brandId, "post", postId],
    queryFn: () => {
      if (!brandId || !postId) throw new Error("No brandId or postId");
      return getBrandPost(brandId, postId);
    },
    enabled: Boolean(brandId && postId),
    refetchInterval: (query) => {
      // Poll every 2 seconds if post is still generating
      const post = query.state.data as Post | undefined;
      return post?.status === "generating" ? 2000 : false;
    },
    refetchIntervalInBackground: true,
  });
}

export function useCreateBrandPost(brandId: string | undefined) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: CreatePostRequest) => {
      if (!brandId) throw new Error("No brandId");
      return createBrandPost(brandId, request);
    },
    onSuccess: (newPost) => {
      // Add the new post to the cache immediately
      queryClient.setQueryData(
        ["brand", brandId, "post", newPost.postId],
        newPost
      );
      
      // Invalidate and refetch posts list for this brand
      queryClient.invalidateQueries({ queryKey: ["brand", brandId, "posts"] });
    },
  });
}


