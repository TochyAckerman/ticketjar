-- Add profile-related columns to events table
ALTER TABLE public.events
ADD COLUMN organizer_name VARCHAR(255),
ADD COLUMN organizer_email VARCHAR(255),
ADD COLUMN organizer_role VARCHAR(50) CHECK (organizer_role IN ('customer', 'organizer'));

-- Update existing records to include profile data
UPDATE public.events e
SET 
    organizer_name = p.preferred_name,
    organizer_email = p.email,
    organizer_role = p.role
FROM public.profiles p
WHERE e.organizer_id = p.id;

-- Make the new columns NOT NULL for future inserts
ALTER TABLE public.events
ALTER COLUMN organizer_name SET NOT NULL,
ALTER COLUMN organizer_email SET NOT NULL,
ALTER COLUMN organizer_role SET NOT NULL;

-- Add an index for better query performance
CREATE INDEX idx_events_organizer_email ON public.events(organizer_email);

-- Update RLS policies to include profile fields
CREATE POLICY "Organizers can view their own events by email"
    ON public.events
    FOR SELECT
    USING (organizer_email = auth.jwt()->>'email');

COMMENT ON TABLE public.events IS 'Events table with organizer profile information'; 