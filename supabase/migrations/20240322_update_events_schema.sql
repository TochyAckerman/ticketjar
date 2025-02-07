-- Update events table schema
BEGIN;

-- Add category constraint
ALTER TABLE public.events
DROP CONSTRAINT IF EXISTS events_category_check;

ALTER TABLE public.events
ADD CONSTRAINT events_category_check 
CHECK (category IN ('concert', 'conference', 'art', 'sports', 'workshop', 'webinar', 'other'));

-- Update status constraint
ALTER TABLE public.events
DROP CONSTRAINT IF EXISTS events_status_check;

ALTER TABLE public.events
ADD CONSTRAINT events_status_check 
CHECK (status IN ('Draft', 'Published', 'Cancelled'));

-- Update organizer_role constraint
ALTER TABLE public.events
DROP CONSTRAINT IF EXISTS events_organizer_role_check;

ALTER TABLE public.events
ADD CONSTRAINT events_organizer_role_check 
CHECK (organizer_role IN ('customer', 'organizer'));

-- Add date constraint if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.constraint_column_usage 
        WHERE table_name = 'events' 
        AND constraint_name = 'events_date_check'
    ) THEN
        ALTER TABLE public.events
        ADD CONSTRAINT events_date_check 
        CHECK (date >= CURRENT_DATE);
    END IF;
END $$;

-- Add numeric constraints
ALTER TABLE public.events
DROP CONSTRAINT IF EXISTS events_ticket_price_check;

ALTER TABLE public.events
ADD CONSTRAINT events_ticket_price_check 
CHECK (ticket_price >= 0);

ALTER TABLE public.events
DROP CONSTRAINT IF EXISTS events_capacity_check;

ALTER TABLE public.events
ADD CONSTRAINT events_capacity_check 
CHECK (capacity > 0);

-- Update RLS policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON events;
CREATE POLICY "Enable insert for authenticated users only" 
ON events FOR INSERT 
TO authenticated 
WITH CHECK (
    auth.uid() = organizer_id 
    AND organizer_role = 'organizer'
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);

-- Add trigger to validate organizer role before insert
CREATE OR REPLACE FUNCTION validate_event_organizer()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the user has the organizer role in their profile
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = NEW.organizer_id 
        AND role = 'organizer'
    ) THEN
        RAISE EXCEPTION 'Only users with organizer role can create events';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_event_organizer_trigger ON events;
CREATE TRIGGER validate_event_organizer_trigger
    BEFORE INSERT ON events
    FOR EACH ROW
    EXECUTE FUNCTION validate_event_organizer();

COMMIT; 