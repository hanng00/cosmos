import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { createAccessibleVariants } from "@/lib/animations";
import type { Variants } from "framer-motion";

// Custom hook following Single Responsibility Principle
export function useScrollAnimation(variants: Variants, options?: {
  once?: boolean;
  amount?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.3,
  });

  const accessibleVariants = createAccessibleVariants(variants);

  return {
    ref,
    isInView,
    variants: accessibleVariants,
    animate: isInView ? "visible" : "hidden",
  };
}

// Hook for managing reduced motion preferences
export function useReducedMotion() {
  const ref = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      ref.current = mediaQuery.matches;

      const handleChange = (e: MediaQueryListEvent) => {
        ref.current = e.matches;
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return ref.current;
} 