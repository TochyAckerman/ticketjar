-- Insert new events into the existing events table
INSERT INTO public.events (
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
    organizer_id
) VALUES 
-- Concert Events
(
    'Lagos Music Festival 2025',
    'Experience the biggest music festival in Lagos featuring top African artists and unforgettable performances.',
    'concert',
    'Published',
    '2025-12-20',
    '18:00',
    'Eko Hotels & Suites',
    50000.00,
    2000,
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
),
(
    'Jazz Night Under the Stars',
    'An evening of smooth jazz featuring Nigeria''s finest jazz musicians.',
    'concert',
    'Published',
    '2025-11-15',
    '19:30',
    'Terra Kulture Amphitheatre',
    15000.00,
    300,
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629',
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
),

-- Art Events
(
    'Contemporary African Art Exhibition',
    'Discover amazing works from emerging African artists showcasing contemporary art pieces.',
    'art',
    'Published',
    '2025-10-25',
    '10:00',
    'National Art Gallery',
    5000.00,
    200,
    'https://images.unsplash.com/photo-1594794312433-05a69a98b7a0',
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
),
(
    'Lagos Art & Culture Festival',
    'A celebration of Nigerian art, culture, and creativity featuring exhibitions and live performances.',
    'art',
    'Published',
    '2025-11-30',
    '11:00',
    'Freedom Park',
    7500.00,
    500,
    'https://images.unsplash.com/photo-1561839561-b13bcfe95249',
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
),

-- Webinar Events
(
    'Digital Marketing Masterclass',
    'Learn advanced digital marketing strategies from industry experts. Topics include SEO, social media marketing, and content strategy.',
    'webinar',
    'Published',
    '2025-09-28',
    '14:00',
    'Zoom Virtual Conference',
    15000.00,
    100,
    'https://images.unsplash.com/photo-1591115765373-5207764f72e4',
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
),
(
    'Entrepreneurship Workshop Series',
    'Join successful entrepreneurs as they share insights on building and scaling businesses in the digital age.',
    'webinar',
    'Published',
    '2025-10-05',
    '15:00',
    'Google Meet',
    20000.00,
    50,
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
),

-- Sports Events
(
    'Lagos Marathon 2025',
    'Join thousands of runners in Lagos'' biggest marathon event of the year.',
    'sports',
    'Published',
    '2025-12-10',
    '06:00',
    'Teslim Balogun Stadium',
    10000.00,
    5000,
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5',
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
),

-- Workshop Events
(
    'Creative Writing Workshop',
    'Develop your writing skills with guidance from published authors and creative writing experts.',
    'workshop',
    'Published',
    '2025-10-15',
    '13:00',
    'Lagos Business School',
    25000.00,
    30,
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
);

-- Verify the newly inserted data
SELECT title, category, date, venue FROM public.events WHERE date >= '2025-01-01' ORDER BY date; 