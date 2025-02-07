-- Drop existing table if it exists
DROP TABLE IF EXISTS public.events;

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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_status ON public.events(status);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Allow anyone to read published events
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

-- Insert mock events
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
    '00000000-0000-0000-0000-000000000000', -- Replace with actual organizer ID
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
    '00000000-0000-0000-0000-000000000000', -- Replace with actual organizer ID
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
    '00000000-0000-0000-0000-000000000000', -- Replace with actual organizer ID
    NOW(),
    NOW()
);

-- Grant necessary permissions
GRANT ALL ON public.events TO authenticated;
GRANT SELECT ON public.events TO anon; 