export type EventStatus = 'Draft' | 'Published' | 'Cancelled';

export type EventCategory = 'concert' | 'conference' | 'art' | 'sports' | 'workshop' | 'webinar' | 'other';

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  maxPerCustomer: number;
  availableFrom: string;
  availableUntil: string;
  benefits?: string[];
}

export interface EventImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  date: string;
  time: string;
  venue: string;
  ticket_price: number;
  capacity: number;
  poster_url: string | null;
  organizer_id: string;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  ticket_price: string;
  capacity: string;
  poster_url?: string;
} 