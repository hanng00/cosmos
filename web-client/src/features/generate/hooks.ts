"use client";

import { useMutation } from "@tanstack/react-query";
import { generateUnderBrand } from "./api";
import { createBrand } from "../brands/api";

type StartGenerationArgs = {
  sourceUrl: string;
  brandId?: string;
};

export function useStartGeneration() {
  return useMutation({
    mutationFn: async ({ sourceUrl, brandId }: StartGenerationArgs) => {
      const brand = brandId ? { brandId } : await createBrand();
      return generateUnderBrand({ brandId: brand.brandId, sourceUrl });
    },
  });
}


