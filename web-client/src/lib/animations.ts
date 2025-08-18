import { Variants } from "framer-motion";

// Animation variants following Single Responsibility Principle
export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
    },
  },
};

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Staggered container variants - follows Open/Closed Principle for extensibility
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Hover animation variants
export const hoverScaleVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Animation configuration types - Interface Segregation Principle
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: [number, number, number, number] | "easeIn" | "easeOut" | "easeInOut" | "linear";
  stagger?: number;
}

// Factory functions for creating custom variants - Dependency Inversion Principle
export const createFadeInUpVariants = (config: AnimationConfig = {}): Variants => ({
  hidden: {
    opacity: 0,
    y: config.delay ? 30 : 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: config.duration || 0.6,
      delay: config.delay || 0,
      ease: config.ease || [0.25, 0.46, 0.45, 0.94],
    },
  },
});

export const createStaggerContainerVariants = (config: AnimationConfig = {}): Variants => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: config.stagger || 0.1,
      delayChildren: config.delay || 0.2,
    },
  },
});

// Viewport animation options
export const defaultViewportConfig = {
  once: true,
  margin: "-50px",
  amount: 0.3,
} as const;

// Accessibility-friendly reduced motion variants
export const createAccessibleVariants = (variants: Variants): Variants => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.1 } },
    };
  }
  return variants;
}; 