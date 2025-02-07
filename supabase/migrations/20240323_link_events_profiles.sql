-- Link events and profiles tables
BEGIN;

-- First, ensure all organizer fields are populated from profiles
UPDATE public.events e
SET 
    organizer_name = p.preferred_name,
    organizer_email = p.email,
    organizer_role = p.role
FROM public.profiles p
WHERE e.organizer_id = p.id;

-- Create a trigger function to automatically update organizer information
CREATE OR REPLACE FUNCTION sync_event_organizer_info()
RETURNS TRIGGER AS $$
BEGIN
    -- Get organizer info from profiles
    SELECT 
        preferred_name,
        email,
        role
    INTO
        NEW.organizer_name,
        NEW.organizer_email,
        NEW.organizer_role
    FROM profiles
    WHERE id = NEW.organizer_id;

    -- Validate organizer role
    IF NEW.organizer_role != 'organizer' THEN
        RAISE EXCEPTION 'Only users with organizer role can create events';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically sync organizer info on insert or update
DROP TRIGGER IF EXISTS sync_event_organizer_trigger ON public.events;
CREATE TRIGGER sync_event_organizer_trigger
    BEFORE INSERT OR UPDATE OF organizer_id
    ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION sync_event_organizer_info();

-- Add foreign key constraint if not exists
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
        REFERENCES public.profiles(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Update RLS policies to use profile information
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

COMMIT; 