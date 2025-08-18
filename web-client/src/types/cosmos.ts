export interface CosmosVideo {
  id: string;
  url: string; // Video URL - to be populated later
  prompt: string; // The prompt/instruction used to generate this clip
  title: string; // Brief title for the example
  description?: string; // Optional longer description
  brand?: string; // Brand/company name if applicable
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter'; // Target platform
  duration?: number; // Video duration in seconds
  tags?: string[]; // Categories like 'product', 'service', 'testimonial', etc.
}

export interface CosmosCarouselProps {
  videos: CosmosVideo[];
  autoPlay?: boolean;
  showDots?: boolean;
  className?: string;
}

// Project creation progress types
export type ProjectStepStatus = 'pending' | 'in-progress' | 'completed' | 'error';

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  status: ProjectStepStatus;
  icon?: string;
  estimatedDuration?: number; // in seconds
  completedAt?: Date;
}

export interface ProjectProgress {
  projectId: string;
  url: string;
  currentStepIndex: number;
  steps: ProjectStep[];
  startedAt: Date;
  estimatedCompletionAt?: Date;
  status: 'initializing' | 'processing' | 'completed' | 'failed';
} 