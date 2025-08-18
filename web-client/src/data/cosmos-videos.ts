import { CosmosVideo } from '@/types/cosmos';

export const cosmosVideos: CosmosVideo[] = [
  {
    id: 'solar-panels-1',
    url: "https://videos.pexels.com/video-files/8855202/8855202-uhd_1440_2560_30fps.mp4",
    // url: 'https://videos.pexels.com/video-files/32156428/13711041_1440_2560_50fps.mp4', // To be populated with actual video URL
    prompt: 'Create a 30-second Instagram Reel showcasing our solar panel installation process with upbeat music and text overlay highlighting cost savings',
    title: 'Solar Installation Cosmos',
    description: 'Transform a technical installation process into engaging social content',
    brand: 'SunPower Solutions',
    platform: 'instagram',
    duration: 30,
    tags: ['product', 'process', 'sustainability']
  },
  {
    id: 'restaurant-menu',
    url: 'https://videos.pexels.com/video-files/27440759/12145374_360_640_30fps.mp4', // To be populated with actual video URL
    prompt: 'Generate a TikTok-style video featuring our signature dishes with trending audio and quick cuts to drive foot traffic',
    title: 'Restaurant Menu Highlight',
    description: 'Turn a static menu into mouth-watering social media content',
    brand: 'Bella Vista Bistro',
    platform: 'tiktok',
    duration: 15,
    tags: ['food', 'restaurant', 'trending']
  },
  {
    id: 'law-firm-testimonial',
    url: 'https://videos.pexels.com/video-files/32138878/13703142_360_640_25fps.mp4', // To be populated with actual video URL
    prompt: 'Create a professional LinkedIn video combining client testimonials with our expertise highlights to build trust and credibility',
    title: 'Legal Services Trust Builder',
    description: 'Professional testimonial content that builds credibility',
    brand: 'Johnson & Associates Law',
    platform: 'linkedin',
    duration: 45,
    tags: ['testimonial', 'professional', 'trust']
  },
  {
    id: 'fitness-transformation',
    url: 'https://videos.pexels.com/video-files/30706004/13137660_360_640_30fps.mp4', // To be populated with actual video URL
    prompt: 'Make an inspiring before/after transformation video with motivational text and energetic music for Instagram Stories',
    title: 'Fitness Transformation Story',
    description: 'Motivational content that drives gym memberships',
    brand: 'FitLife Gym',
    platform: 'instagram',
    duration: 20,
    tags: ['transformation', 'fitness', 'motivation']
  },
  {
    id: 'tech-startup-explainer',
    url: 'https://videos.pexels.com/video-files/32262626/13759401_360_640_60fps.mp4', // To be populated with actual video URL
    prompt: 'Explain our SaaS platform benefits in a clear, animated explainer video perfect for Twitter and LinkedIn sharing',
    title: 'SaaS Platform Explainer',
    description: 'Complex software made simple and shareable',
    brand: 'CloudFlow Technologies',
    platform: 'twitter',
    duration: 60,
    tags: ['explainer', 'saas', 'technology']
  },
  {
    id: 'real-estate-tour',
    url: 'https://videos.pexels.com/video-files/32480587/13850615_360_640_30fps.mp4', // To be populated with actual video URL
    prompt: 'Create a dynamic property tour video with smooth transitions and key selling points highlighted for YouTube Shorts',
    title: 'Property Virtual Tour',
    description: 'Static listings transformed into engaging virtual tours',
    brand: 'Premier Realty Group',
    platform: 'youtube',
    duration: 40,
    tags: ['real-estate', 'tour', 'property']
  }
];

// Helper function to get videos by platform
export const getVideosByPlatform = (platform: CosmosVideo['platform']) => {
  return cosmosVideos.filter(video => video.platform === platform);
};

// Helper function to get videos by tag
export const getVideosByTag = (tag: string) => {
  return cosmosVideos.filter(video => video.tags?.includes(tag));
}; 