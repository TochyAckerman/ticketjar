-- Link events and profiles tables
BEGIN;

-- First, ensure we have the correct foreign key constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'events_organizer_id_fkey'
    ) THEN
        ALTER TABLE public.events
        ADD CONSTRAINT events_organizer_id_fkey
        FOREIGN KEY (organizer_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Create a trigger function to validate organizer role
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

-- Create trigger to validate organizer role on insert
DROP TRIGGER IF EXISTS validate_event_organizer_trigger ON public.events;
CREATE TRIGGER validate_event_organizer_trigger
    BEFORE INSERT OR UPDATE OF organizer_id
    ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION validate_event_organizer();

-- Update RLS policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.events;
CREATE POLICY "Enable insert for authenticated users only" 
ON public.events 
FOR INSERT 
TO authenticated 
WITH CHECK (
    auth.uid() = organizer_id AND 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'organizer'
    )
);

DROP POLICY IF EXISTS "Enable update for event organizers" ON public.events;
CREATE POLICY "Enable update for event organizers" 
ON public.events 
FOR UPDATE 
TO authenticated 
USING (
    auth.uid() = organizer_id AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'organizer'
    )
);

-- Add index for better performance if not exists
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON public.events(organizer_id);

COMMIT; 