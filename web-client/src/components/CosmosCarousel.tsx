"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CosmosCarouselProps } from '@/types/cosmos';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  fadeInUpVariants,
  createStaggerContainerVariants,
  staggerItemVariants 
} from '@/lib/animations';
import { useScrollAnimation } from '@/hooks/use-animation';

export default function CosmosCarousel({ 
  videos, 
  showDots = true, 
  className = "" 
}: CosmosCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  // Animation hooks
  const headerAnimation = useScrollAnimation(fadeInUpVariants);
  const gridAnimation = useScrollAnimation(createStaggerContainerVariants({ stagger: 0.1 }));

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Show 3 videos at once on desktop, 1 on mobile
  const getVisibleVideos = () => {
    const visibleCount = 3;
    const result = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % videos.length;
      result.push({ ...videos[index], displayIndex: i });
    }
    
    return result;
  };

  const visibleVideos = getVisibleVideos();

  return (
    <div className={`relative w-full ${className}`}>
      {/* Navigation Buttons */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        ref={headerAnimation.ref}
        initial="hidden"
        animate={headerAnimation.animate}
        variants={headerAnimation.variants}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-primary">
            See what Cosmos creates
          </h3>
          <p className="text-sm text-muted-foreground">
            Hover to see the prompts used
          </p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/5"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Video Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        ref={gridAnimation.ref}
        initial="hidden"
        animate={gridAnimation.animate}
        variants={gridAnimation.variants}
      >
        <AnimatePresence
          mode='wait'
        >
          {visibleVideos.map((video) => (
            <motion.div
              key={`${video.id}-${video.displayIndex}-${currentIndex}`}
              className="relative group cursor-pointer"
              variants={staggerItemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              layoutId={`video-${video.id}`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              {/* Video Container */}
              <motion.div 
                className="relative aspect-[9/12] bg-muted/20 rounded-2xl overflow-hidden border border-border/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Placeholder for video - will be replaced when URLs are added */}
                {video.url ? (
                  <video
                    className="w-full h-full object-cover"
                    src={video.url}
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/60">
                    <div className="text-center p-4">
                      <motion.div 
                        className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-primary font-semibold">▶</span>
                      </motion.div>
                      <p className="text-sm font-medium text-primary">{video.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{video.brand}</p>
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                  {hoveredVideo === video.id && (
                    <motion.div
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="text-center text-white"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <motion.div 
                          className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium mb-4"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.15 }}
                        >
                          Prompt Used
                        </motion.div>
                        <p className="text-sm leading-relaxed font-medium">
                          &ldquo;{video.prompt}&rdquo;
                        </p>
                        {video.platform && (
                          <motion.div 
                            className="mt-4 flex items-center justify-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                          >
                            <span className="text-xs text-white/70">Platform:</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded capitalize">
                              {video.platform}
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
              </motion.div>

              {/* Video Info */}
              <motion.div 
                className="mt-3 text-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h4 className="text-sm font-medium text-primary">{video.title}</h4>
                {video.brand && (
                  <p className="text-xs text-muted-foreground mt-1">{video.brand}</p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Dots Navigation */}
      {showDots && videos.length > 3 && (
        <motion.div 
          className="flex justify-center mt-8 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {Array.from({ length: Math.ceil(videos.length / 3) }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index * 3)}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / 3) === index
                  ? 'bg-primary'
                  : 'bg-primary/20 hover:bg-primary/40'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
} 