import * as React from "react";
import { Button, buttonVariants } from "./button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInUpVariants } from "@/lib/animations";

export const marketingButtonVariants = cva(
  "rounded-md text-sm px-5 py-2.5 shadow-sm transition-all backdrop-blur-md border border-border/50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary/90 text-white hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary/40",
        outline:
          "bg-white/20 text-white hover:bg-white/30 border border-border/50",
        glass:
          "bg-white/10 text-white hover:bg-white/20 border border-border/50",
      },
      size: {
        default: "h-10 px-5 py-2.5 text-sm",
        sm: "h-8 px-4 py-2 text-sm",
        lg: "h-12 px-7 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface MarketingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof marketingButtonVariants> {
  asChild?: boolean;
}

export const MarketingButton = React.forwardRef<HTMLButtonElement, MarketingButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Button
          ref={ref}
          asChild
          className={cn(marketingButtonVariants({ variant, size, className }))}
          {...props}
        />
      );
    }
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
      >
        <Button
          ref={ref}
          className={cn(marketingButtonVariants({ variant, size, className }))}
          {...props}
        />
      </motion.div>
    );
  }
);
MarketingButton.displayName = "MarketingButton"; 