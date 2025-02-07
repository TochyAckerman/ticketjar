-- Drop dependent objects first
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP POLICY IF EXISTS "Anyone can view published events" ON public.events;
DROP POLICY IF EXISTS "Organizers can manage their own events" ON public.events;

-- Drop the table and all dependent objects
DROP TABLE IF EXISTS public.events CASCADE; 