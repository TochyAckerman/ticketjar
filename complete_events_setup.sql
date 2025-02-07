-- Start fresh by dropping existing tables and functions
DROP TABLE IF EXISTS public.events CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Create events table with proper constraints
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('concert', 'conference', 'art', 'sports', 'workshop', 'webinar', 'other')),
    status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Cancelled')),
    date DATE NOT NULL CHECK (date >= CURRENT_DATE),
    time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL CHECK (ticket_price >= 0),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    poster_url TEXT,
    organizer_id UUID NOT NULL REFERENCES auth.users(id),
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    organizer_role VARCHAR(50) NOT NULL CHECK (organizer_role IN ('customer', 'organizer')),
    tickets_sold INTEGER DEFAULT 0 CHECK (tickets_sold >= 0),
    tickets_available INTEGER GENERATED ALWAYS AS (capacity - tickets_sold) STORED,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_organizer_email ON public.events(organizer_email);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Allow anyone to view published events
CREATE POLICY "Anyone can view published events"
    ON public.events
    FOR SELECT
    USING (status = 'Published');

-- Allow organizers to manage their own events
CREATE POLICY "Organizers can manage their own events"
    ON public.events
    FOR ALL
    USING (organizer_id = auth.uid());

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to check ticket availability
CREATE OR REPLACE FUNCTION check_ticket_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tickets_sold > NEW.capacity THEN
        RAISE EXCEPTION 'Cannot sell more tickets than capacity';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ticket availability check
CREATE TRIGGER check_ticket_availability_trigger
    BEFORE INSERT OR UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION check_ticket_availability();

-- Insert mock events for organizer ID: 059d2191-8564-4ec5-a8b9-bcb99513e5a4
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
    tickets_sold,
    is_featured,
    organizer_id,
    organizer_name,
    organizer_email,
    organizer_role,
    created_at,
    updated_at
) VALUES 
(
    'Lagos Music Festival 2024',
    'Experience the biggest music festival in Lagos featuring top African artists, amazing food, and unforgettable performances.',
    'concert',
    'Published',
    '2024-12-15',
    '18:00',
    'Eko Hotels & Suites',
    50000.00,
    2000,
    500,
    true,
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4',
    'Event Organizer',
    'organizer@example.com',
    'organizer',
    NOW(),
    NOW()
),
(
    'Tech Summit Nigeria',
    'Join the largest tech conference in Nigeria with industry leaders, startups, and innovators.',
    'conference',
    'Published',
    '2024-11-20',
    '09:00',
    'Landmark Centre',
    75000.00,
    500,
    100,
    true,
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4',
    'Event Organizer',
    'organizer@example.com',
    'organizer',
    NOW(),
    NOW()
),
(
    'African Art Exhibition',
    'Discover contemporary African art from emerging artists across the continent.',
    'art',
    'Published',
    '2024-10-10',
    '10:00',
    'Terra Kulture',
    15000.00,
    200,
    50,
    false,
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4',
    'Event Organizer',
    'organizer@example.com',
    'organizer',
    NOW(),
    NOW()
),
(
    'Business Workshop',
    'Essential skills for entrepreneurs and business owners in Nigeria.',
    'workshop',
    'Draft',
    '2024-09-25',
    '14:00',
    'Victoria Island Conference Center',
    25000.00,
    100,
    0,
    false,
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4',
    'Event Organizer',
    'organizer@example.com',
    'organizer',
    NOW(),
    NOW()
),
(
    'Digital Marketing Masterclass',
    'Learn practical digital marketing strategies for the Nigerian market.',
    'webinar',
    'Published',
    '2024-08-25',
    '15:00',
    'Online',
    10000.00,
    1000,
    250,
    false,
    '059d2191-8564-4ec5-a8b9-bcb99513e5a4',
    'Event Organizer',
    'organizer@example.com',
    'organizer',
    NOW(),
    NOW()
);

-- Grant necessary permissions
GRANT ALL ON public.events TO authenticated;
GRANT SELECT ON public.events TO anon;

-- Create helpful views
CREATE OR REPLACE VIEW public.upcoming_events AS
SELECT *
FROM public.events
WHERE date > CURRENT_DATE
AND status = 'Published'
ORDER BY date;

CREATE OR REPLACE VIEW public.featured_events AS
SELECT *
FROM public.events
WHERE is_featured = true
AND status = 'Published'
AND date > CURRENT_DATE
ORDER BY date;

-- Create function to get events by category
CREATE OR REPLACE FUNCTION get_events_by_category(category_name VARCHAR)
RETURNS SETOF public.events AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.events
    WHERE category = category_name
    AND status = 'Published'
    AND date > CURRENT_DATE
    ORDER BY date;
END;
$$ language 'plpgsql';

-- Verify the inserts and show available tickets
SELECT 
    id,
    title,
    category,
    status,
    date,
    ticket_price,
    capacity,
    tickets_sold,
    tickets_available,
    is_featured,
    organizer_name,
    organizer_email
FROM public.events
WHERE organizer_id = '059d2191-8564-4ec5-a8b9-bcb99513e5a4'
ORDER BY date; 