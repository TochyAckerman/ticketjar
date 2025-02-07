import { EventCategory } from './event';

export interface EventSearchFilters {
  category?: EventCategory;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    radius?: number; // in kilometers
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  tags?: string[];
}

export interface EventSearchParams extends EventSearchFilters {
  query: string;
  page: number;
  limit: number;
  sortBy: 'date' | 'price' | 'relevance' | 'distance';
  sortOrder: 'asc' | 'desc';
}

export interface EventSearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  date: string;
  time: string;
  venue: string;
  ticket_price: number;
  capacity: number;
  poster_url: string | null;
  organizer_id: string;
  created_at: string;
  updated_at: string;
  distance?: number; // Optional search-specific field
  relevanceScore?: number; // Optional search-specific field
}

export interface EventSearchResponse {
  results: EventSearchResult[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface UserPreferences {
  categories: EventCategory[];
  locations: {
    city: string;
    state: string;
    country: string;
  }[];
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
}

export interface EventRecommendation extends EventSearchResult {
  recommendationReason: string;
  matchScore: number;
} 