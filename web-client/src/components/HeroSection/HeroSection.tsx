"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CosmosLogo from "@/components/Logo";
import { fadeInUpVariants, createFadeInUpVariants } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/use-animation";
import { headerImageUrl } from "@/data/images";
import styles from "./HeroSection.module.css";

import { useFreeBrandVoiceUserFlow } from "@/features/brand-voices/hooks/useFreeBrandVoiceUserFlow";

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const [submitted] = useState(false);
  // const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const flow = useFreeBrandVoiceUserFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = flow.startFromUrl(url);
    if (!res.ok) setError(res.error);
  };

  // Animation hooks for different elements
  const logoAnimation = useScrollAnimation(fadeInUpVariants);
  const titleAnimation = useScrollAnimation(
    createFadeInUpVariants({ delay: 0.2 })
  );
  const descriptionAnimation = useScrollAnimation(
    createFadeInUpVariants({ delay: 0.4 })
  );
  const formAnimation = useScrollAnimation(
    createFadeInUpVariants({ delay: 0.6 })
  );

  return (
    <section className="relative w-full h-full aspect-[4/3] sm:aspect-[16/9] flex flex-col items-center justify-center px-2 sm:px-6 md:px-12 py-8 sm:py-12">
      {/* Background Image Container */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('${headerImageUrl}')`,
        }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <div className={styles.noiseOverlay + " rounded-3xl"} />
      <div className={styles.orangeOverlay + " rounded-3xl"} />

      <div className="relative z-10 max-w-3xl mx-auto text-left">
        <motion.div
          className="mb-8"
          ref={logoAnimation.ref}
          initial="hidden"
          animate={logoAnimation.animate}
          variants={logoAnimation.variants}
        >
          <CosmosLogo size={48} className="text-white" />
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-5xl lg:text-7xl font-light text-white mb-4 tracking-tight leading-tight"
          ref={titleAnimation.ref}
          initial="hidden"
          animate={titleAnimation.animate}
          variants={titleAnimation.variants}
        >
          Transform websites into social media gold
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg text-white/90 mb-6 sm:mb-10 max-w-2xl leading-relaxed"
          ref={descriptionAnimation.ref}
          initial="hidden"
          animate={descriptionAnimation.animate}
          variants={descriptionAnimation.variants}
        >
          Instantly create beautiful, shareable video clips from any website
          URL.
        </motion.p>

        <motion.form
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl"
          ref={formAnimation.ref}
          initial="hidden"
          animate={formAnimation.animate}
          variants={formAnimation.variants}
          onSubmit={handleSubmit}
        >
          <Input
            id="website-url"
            placeholder="Paste your website URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            variant="blur"
          />
          <Button
            type="submit"
            variant="blur"
            size="lg"
            disabled={false}
          >
            Generate Your Voice
          </Button>
        </motion.form>

        {submitted && (
          <motion.div
            className="mt-6 text-center text-white text-sm font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            🚀 Coming soon: Magic in progress!
          </motion.div>
        )}

        {error && (
          <div className="text-red-400 text-sm mt-2 w-full">{error}</div>
        )}
      </div>
    </section>
  );
}
