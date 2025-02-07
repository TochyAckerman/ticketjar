-- Insert mock events
INSERT INTO events (
  title,
  description,
  category,
  status,
  date,
  time,
  venue,
  ticket_price,
  capacity,
  poster_url,
  organizer_id,
  created_at,
  updated_at
) VALUES 
(
  'Summer Music Festival 2024',
  'A three-day music festival featuring top artists from around the world',
  'concert',
  'Published',
  '2024-07-15',
  '14:00',
  'Central Park Arena',
  150.00,
  5000,
  NULL,
  'your-user-id', -- Replace with your actual user ID
  NOW(),
  NOW()
),
(
  'Tech Conference 2024',
  'Annual technology conference featuring industry leaders and innovators',
  'conference',
  'Published',
  '2024-09-20',
  '09:00',
  'Convention Center',
  299.99,
  2000,
  NULL,
  'your-user-id', -- Replace with your actual user ID
  NOW(),
  NOW()
),
(
  'Art Exhibition: Modern Masters',
  'Showcase of contemporary art from leading modern artists',
  'art',
  'Published',
  '2024-08-10',
  '10:00',
  'Metropolitan Gallery',
  25.00,
  500,
  NULL,
  'your-user-id', -- Replace with your actual user ID
  NOW(),
  NOW()
); 