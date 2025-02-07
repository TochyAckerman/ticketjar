-- Test event creation
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get a test user ID (replace with an actual user ID from your auth.users table)
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- Attempt to create a test event
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
        organizer_id,
        organizer_name,
        organizer_email,
        organizer_role
    ) VALUES (
        'Test Event',
        'Test Description',
        'concert',
        'Draft',
        CURRENT_DATE + INTERVAL '1 day',
        '14:00',
        'Test Venue',
        100.00,
        50,
        test_user_id,
        'Test Organizer',
        'test@example.com',
        'organizer'
    );

    -- Verify the event was created
    RAISE NOTICE 'Event created successfully';
END $$;

-- Check if the event was created
SELECT * FROM events WHERE title = 'Test Event' ORDER BY created_at DESC LIMIT 1; 