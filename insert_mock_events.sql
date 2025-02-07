-- First, verify if the user exists
DO $$
DECLARE
    user_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    ) INTO user_exists;

    IF NOT user_exists THEN
        RAISE EXCEPTION 'User ID does not exist in auth.users table';
    END IF;
END $$;

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
    organizer_id
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
    'f47ac10b-58cc-4372-a567-0e02b2c3d479'  -- Replace with your actual user ID
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
    'f47ac10b-58cc-4372-a567-0e02b2c3d479'  -- Replace with your actual user ID
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
    'f47ac10b-58cc-4372-a567-0e02b2c3d479'  -- Replace with your actual user ID
); 