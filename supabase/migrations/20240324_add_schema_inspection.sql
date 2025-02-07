-- Create functions for schema inspection
BEGIN;

-- Function to get table column information
CREATE OR REPLACE FUNCTION get_table_info(table_name text)
RETURNS TABLE (
    column_name text,
    data_type text,
    is_nullable boolean,
    column_default text,
    is_identity boolean,
    is_generated boolean,
    is_updatable boolean
) SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::boolean = 'YES',
        c.column_default::text,
        c.is_identity::boolean = 'YES',
        c.is_generated::text <> 'NEVER',
        c.is_updatable::boolean = 'YES'
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name = $1
    ORDER BY c.ordinal_position;
END;
$$;

-- Function to get foreign key constraints
CREATE OR REPLACE FUNCTION get_foreign_keys(table_name text)
RETURNS TABLE (
    constraint_name text,
    column_name text,
    foreign_table_name text,
    foreign_column_name text
) SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.constraint_name::text,
        kcu.column_name::text,
        ccu.table_name::text AS foreign_table_name,
        ccu.column_name::text AS foreign_column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name = $1;
END;
$$;

-- Function to get check constraints
CREATE OR REPLACE FUNCTION get_check_constraints(table_name text)
RETURNS TABLE (
    constraint_name text,
    check_clause text
) SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.constraint_name::text,
        pgc.consrc::text AS check_clause
    FROM information_schema.table_constraints tc
    JOIN pg_constraint pgc
        ON tc.constraint_name = pgc.conname
    WHERE tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
    AND tc.table_name = $1;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_table_info(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_foreign_keys(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_check_constraints(text) TO authenticated;

COMMIT; 