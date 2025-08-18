"use client";

import { motion } from "framer-motion";
import { hoverScaleVariants } from "@/lib/animations";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
}

export default function StepCard({ stepNumber, title, description }: StepCardProps) {
  return (
    <motion.div 
      className="text-center group cursor-default"
      initial="rest"
      whileHover="hover"
      variants={hoverScaleVariants}
    >
      <motion.div 
        className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-semibold text-xl mb-6 mx-auto group-hover:bg-primary/20 transition-colors"
        whileHover={{ 
          scale: 1.1,
          backgroundColor: "rgba(var(--primary), 0.15)"
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {stepNumber}
      </motion.div>
      <h3 className="text-xl font-medium text-primary mb-4">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
} 