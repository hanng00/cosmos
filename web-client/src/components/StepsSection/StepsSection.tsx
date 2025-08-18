"use client";

import { motion } from "framer-motion";
import StepCard from "./StepCard";
import {
  fadeInUpVariants,
  createStaggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/use-animation";
import { headerImageUrl } from "@/data/images";

const steps = [
  {
    number: 1,
    title: "Share your URL",
    description:
      "Simply paste your website URL. Our system analyzes your content, brand, and messaging automatically.",
  },
  {
    number: 2,
    title: "We create clips",
    description:
      "Our system generates multiple social media clips optimized for different platforms and audiences.",
  },
  {
    number: 3,
    title: "Review and refine",
    description:
      "Preview your clips before publishing. Make adjustments, swap content, or regenerate with simple prompts.",
  },
  {
    number: 4,
    title: "Publish and grow",
    description:
      "Export in any format. Your clips are ready to boost engagement across all social platforms.",
  },
];

export default function StepsSection() {
  const headerAnimation = useScrollAnimation(fadeInUpVariants);
  const gridAnimation = useScrollAnimation(
    createStaggerContainerVariants({ stagger: 0.15 })
  );

  return (
    <section className="py-24 px-4 bg-muted/70">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          ref={headerAnimation.ref}
          initial="hidden"
          animate={headerAnimation.animate}
          variants={headerAnimation.variants}
        >
          <div className="inline-block bg-cover text-background px-6 py-3 rounded-full text-sm font-medium mb-6">
            Cosmos
          </div>
          <h2 className="text-4xl sm:text-5xl font-light text-primary mb-4">
            4 steps to launch
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          ref={gridAnimation.ref}
          initial="hidden"
          animate={gridAnimation.animate}
          variants={gridAnimation.variants}
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={staggerItemVariants}>
              <StepCard
                stepNumber={step.number}
                title={step.title}
                description={step.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
