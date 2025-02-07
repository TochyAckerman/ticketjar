export const EVENT_CATEGORIES = [
  'Music',
  'Conference',
  'Sports',
  'Art',
  'Workshop',
  'Webinar'
] as const;

export const EVENT_STATUSES = [
  'Draft',
  'Published',
  'Cancelled'
] as const;

export const TICKET_STATUSES = [
  'Valid',
  'Used',
  'Transferred',
  'Cancelled'
] as const;

export const STATUS_COLORS = {
  Valid: 'bg-green-100 text-green-800',
  Used: 'bg-gray-100 text-gray-800',
  Transferred: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800',
  Draft: 'bg-yellow-100 text-yellow-800',
  Published: 'bg-green-100 text-green-800'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  CUSTOMER: 'customer'
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CONCERTS: '/concerts',
  WEBINARS: '/webinars',
  ART: '/art',
  MY_TICKETS: '/my-tickets',
  EVENTS: '/events',
  CREATE_EVENT: '/events/create',
  DISCOVER: '/discover'
} as const;

export const API_ENDPOINTS = {
  EVENTS: '/events',
  TICKETS: '/tickets',
  PROFILES: '/profiles',
  PURCHASES: '/purchases',
  TRANSFERS: '/transfers'
} as const;

export const DEFAULT_PAGE_SIZE = 12;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const TOAST_DURATION = 5000; // 5 seconds 