"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createBrand, listBrands } from "./api";

export function useCreateBrand() {
  return useMutation({ mutationFn: createBrand });
}

export function useBrands() {
  return useQuery({ queryKey: ["brands"], queryFn: listBrands });
}


