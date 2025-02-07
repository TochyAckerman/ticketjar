-- Verify and create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT,
    preferred_name TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Verify and create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Cancelled')),
    date DATE NOT NULL CHECK (date >= CURRENT_DATE),
    time TIME NOT NULL,
    venue TEXT NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL CHECK (ticket_price >= 0),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    poster_url TEXT,
    organizer_id UUID REFERENCES auth.users(id) NOT NULL,
    organizer_name TEXT,
    organizer_email TEXT,
    organizer_role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tickets_available INTEGER GENERATED ALWAYS AS (capacity) STORED
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON events;
DROP POLICY IF EXISTS "Enable update for event organizers" ON events;
DROP POLICY IF EXISTS "Enable delete for event organizers" ON events;

-- Create RLS policies for events
CREATE POLICY "Enable read access for all users" 
ON events FOR SELECT 
TO public 
USING (status = 'Published');

CREATE POLICY "Enable insert for authenticated users only" 
ON events FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Enable update for event organizers" 
ON events FOR UPDATE 
TO authenticated 
USING (auth.uid() = organizer_id)
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Enable delete for event organizers" 
ON events FOR DELETE 
TO authenticated 
USING (auth.uid() = organizer_id);

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

CREATE POLICY "Enable read access for all users"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable update for users based on id"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create or replace function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify setup by checking table existence and policies
SELECT 
    table_name,
    has_table_privilege(current_user, table_name::regclass, 'INSERT') as can_insert,
    has_table_privilege(current_user, table_name::regclass, 'SELECT') as can_select,
    has_table_privilege(current_user, table_name::regclass, 'UPDATE') as can_update,
    has_table_privilege(current_user, table_name::regclass, 'DELETE') as can_delete
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('events', 'profiles'); 