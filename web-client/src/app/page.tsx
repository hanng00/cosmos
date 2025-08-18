"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import CosmosCarousel from "@/components/CosmosCarousel";
import StepsSection from "@/components/StepsSection";
import PricingSection from "@/components/PricingSection";
import { cosmosVideos } from "@/data/cosmos-videos";
import { fadeInUpVariants } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/use-animation";
import { MeStatus } from "@/components/MeStatus";
import { NavBar } from "@/components/NavBar";

export default function Home() {
  const cosmosAnimation = useScrollAnimation(fadeInUpVariants);

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <NavBar />
      <div className="p-4 sm:p-8 md:p-12 lg:p-16 w-full">
        <HeroSection />

        {/* Examples Section */}
        <motion.section
          className="pt-14 bg-background"
          ref={cosmosAnimation.ref}
          initial="hidden"
          animate={cosmosAnimation.animate}
          variants={cosmosAnimation.variants}
        >
          <div className="max-w-6xl mx-auto">
            <CosmosCarousel videos={cosmosVideos} />
          </div>
        </motion.section>
      </div>

      <StepsSection />

      <div className="px-4 sm:px-8 md:px-12 lg:px-16 w-full">
        <div className="max-w-6xl mx-auto mt-4 text-right">
          <MeStatus className="text-xs text-muted-foreground" />
        </div>
      </div>

      <PricingSection />

      {/* Footer */}
      <footer className="mt-16 sm:mt-24 py-8 sm:py-12 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <div className="mb-4 sm:mb-8" />
          <p>© {new Date().getFullYear()} Cosmos. All rights reserved.</p>
          <div className="mt-4 sm:mt-8" />
        </div>
      </footer>
    </motion.div>
  );
}
