export type GamingActivityId = 'snooker' | 'ps5' | 'racing' | 'arcade';

export interface GamingActivity {
  id: GamingActivityId;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  specs: string[];
  capacity: string;
  pricingHint: string;
  color: {
    accent: string;
    glow: string;
    border: string;
  };
  image?: string;
}

export interface CafeHighlight {
  id: string;
  name: string;
  category: string;
  description: string;
  tag: string;
}

export interface BookingFormData {
  fullName: string;
  contact: string;
  activity: GamingActivityId | 'lounge';
  date: string;
  timeSlot: string;
  partySize: number;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'snooker' | 'ps5' | 'racing' | 'arcade' | 'cafe' | 'lounge';
  caption: string;
  imageUrl?: string;
  author?: string;
  isCustomUpload?: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number; // 1-5
  date: string;
  category: 'snooker' | 'gaming' | 'racing' | 'cafe';
  comment: string;
  highlight: string;
}
