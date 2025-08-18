"use client";

import { motion } from "framer-motion";
import StepCard from "./StepCard";
import {
  fadeInUpVariants,
  createStaggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/use-animation";
// import { headerImageUrl } from "@/data/images";

const steps = [
  {
    number: 1,
    title: "Enter your website",
    description:
      "Scan your site and analyze how you write—tone, style, and messaging.",
  },
  {
    number: 2,
    title: "Fine Tune Your Voice",
    description:
      "Edit tone, style, audience, and more until it sounds just right.",
  },
  {
    number: 3,
    title: "Save & Create Content",
    description:
      "Sign up for a free trial and let AI create social posts, emails, blogs, and more.",
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
            How it works
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
