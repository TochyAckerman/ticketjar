import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment variables check:', {
  VITE_SUPABASE_URL: supabaseUrl ? 'Present' : 'Missing',
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Present' : 'Missing',
  fullUrl: supabaseUrl // Log the full URL for verification
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing required Supabase configuration. Please check your environment variables.');
}

// Initialize Supabase client with detailed logging
console.log('Initializing Supabase client with URL:', supabaseUrl);

// Add debug middleware
const debugMiddleware = {
  beforeRequest: (request: any) => {
    console.log('🔄 Supabase Request:', {
      url: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    return request;
  },
  afterResponse: (response: any) => {
    console.log('📥 Supabase Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      error: response.error
    });
    return response;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  // Add debug middleware
  ...debugMiddleware
});

// Log successful initialization
console.log('✅ Supabase client initialized successfully');

// Test the connection and log detailed information about any failures
const testConnection = async () => {
  try {
    console.log('🔍 Testing connection to:', supabaseUrl);
    
    // Test auth endpoint
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    });
    console.log('Auth endpoint test:', {
      status: authResponse.status,
      ok: authResponse.ok,
      statusText: authResponse.statusText
    });

    // Test database endpoint
    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/events?select=count`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    });
    console.log('Database endpoint test:', {
      status: dbResponse.status,
      ok: dbResponse.ok,
      statusText: dbResponse.statusText
    });

  } catch (err) {
    console.error('Connection test failed:', err);
  }
};

// Run the connection test
testConnection();

// Immediate connection test
(async () => {
  try {
    console.log('Testing immediate Supabase connection...');
    const { data, error } = await supabase
      .from('events')
      .select('count');

    if (error) {
      console.error('❌ Supabase connection failed:', error);
    } else {
      console.log('✅ Supabase connection successful, data:', data);
    }
  } catch (err) {
    console.error('❌ Error testing Supabase connection:', err);
  }
})();

// Verify client initialization
console.log('Supabase client initialized');

// Test function to directly insert a record
export const testInsert = async () => {
  const testData = {
    title: 'Test Event',
    description: 'Test Description',
    category: 'concert',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    venue: 'Test Venue',
    ticket_price: 10,
    capacity: 100,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('events')
    .insert([testData])
    .select();

  if (error) {
    console.error('Test insert failed:', error);
    return { success: false, error };
  }

  console.log('Test insert successful:', data);
  return { success: true, data };
};

// Enhanced connection test
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection with URL:', supabaseUrl);
    
    // Test auth connection first
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth connection test failed:', authError);
      return { success: false, error: authError };
    }
    console.log('✅ Auth connection test passed:', authData ? 'Session exists' : 'No session');

    // Test database connection
    const { data: countData, error: countError } = await supabase
      .from('events')
      .select('count');

    if (countError) {
      console.error('❌ Database connection test failed:', countError);
      return { success: false, error: countError };
    }

    console.log('✅ Database connection test passed, count data:', countData);
    return { success: true, data: countData };

  } catch (err) {
    console.error('❌ Unexpected error testing Supabase connection:', err);
    return { success: false, error: err instanceof Error ? err : new Error('Unknown error') };
  }
};

// Function to inspect table schema
export const inspectTableSchema = async (tableName: string) => {
  try {
    console.log(`🔍 Inspecting schema for table: ${tableName}`);
    
    // Get column information
    const { data: columns, error: columnError } = await supabase
      .rpc('get_table_info', { table_name: tableName });

    if (columnError) {
      console.error('❌ Error fetching column information:', columnError);
      return null;
    }

    // Get foreign key constraints
    const { data: foreignKeys, error: fkError } = await supabase
      .rpc('get_foreign_keys', { table_name: tableName });

    if (fkError) {
      console.error('❌ Error fetching foreign key information:', fkError);
    }

    // Get check constraints
    const { data: checkConstraints, error: checkError } = await supabase
      .rpc('get_check_constraints', { table_name: tableName });

    if (checkError) {
      console.error('❌ Error fetching check constraints:', checkError);
    }

    return {
      columns,
      foreignKeys,
      checkConstraints
    };
  } catch (error) {
    console.error('❌ Error inspecting schema:', error);
    return null;
  }
};

// Function to verify database setup
export const verifyDatabaseSetup = async () => {
  try {
    console.log('🔍 Starting database setup verification...');
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection error:', testError);
      return false;
    }

    console.log('✅ Database connection successful');

    // Get events table schema
    const eventsSchema = await inspectTableSchema('events');
    if (eventsSchema) {
      console.log('📋 Events table schema:', eventsSchema);
    }

    // Get profiles table schema
    const profilesSchema = await inspectTableSchema('profiles');
    if (profilesSchema) {
      console.log('📋 Profiles table schema:', profilesSchema);
    }

    return true;
  } catch (err) {
    console.error('❌ Error verifying database setup:', err);
    return false;
  }
};

// Function to verify event creation requirements
export const verifyEventCreationRequirements = async (userId: string) => {
  try {
    console.log('🔍 Verifying event creation requirements...');

    // Check if user exists and has organizer role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Error checking user profile:', profileError);
      return { success: false, error: 'Failed to verify user profile' };
    }

    if (!profile || profile.role !== 'organizer') {
      return { success: false, error: 'User must have organizer role' };
    }

    // Verify events table structure
    const eventsSchema = await inspectTableSchema('events');
    if (!eventsSchema) {
      return { success: false, error: 'Failed to verify events table schema' };
    }

    return { 
      success: true, 
      schema: eventsSchema,
      profile
    };
  } catch (error) {
    console.error('❌ Error verifying requirements:', error);
    return { success: false, error: 'Failed to verify requirements' };
  }
};

// Function to check RLS policies
export const checkRLSPolicies = async (userId: string) => {
  try {
    // Test read permission
    const { data: readTest, error: readError } = await supabase
      .from('events')
      .select('count')
      .eq('organizer_id', userId)
      .limit(1);

    if (readError) {
      console.error('Read permission error:', readError);
      return false;
    }

    // Test write permission with a dummy record
    const testEvent = {
      title: '__test__',
      description: '__test__',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      venue: '__test__',
      ticket_price: 0,
      capacity: 0,
      organizer_id: userId,
      created_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('events')
      .insert([testEvent])
      .select()
      .single();

    if (insertError) {
      console.error('Write permission error:', insertError);
      return false;
    }

    // Clean up test record
    await supabase
      .from('events')
      .delete()
      .eq('title', '__test__')
      .eq('organizer_id', userId);

    console.log('RLS policies verified successfully');
    return true;
  } catch (err) {
    console.error('Error checking RLS policies:', err);
    return false;
  }
};

// Initialize auth state
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Error getting session:', error.message);
    return;
  }
  
  if (session) {
    console.log('Initial session loaded');
  }
}).catch(err => {
  console.error('Failed to initialize auth:', err);
});

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
});

// Function to verify and create user profile
export const verifyAndCreateProfile = async (userId: string, email: string, role: string = 'organizer') => {
  try {
    console.log('🔍 Verifying user profile:', { userId, email });

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('❌ Error fetching profile:', fetchError);
      throw fetchError;
    }

    if (!existingProfile) {
      console.log('📝 Creating new profile for user');
      
      // Create new profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: email,
            role: role,
            preferred_name: email.split('@')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating profile:', insertError);
        throw insertError;
      }

      console.log('✅ Profile created successfully:', newProfile);
      return newProfile;
    }

    console.log('✅ Profile already exists:', existingProfile);
    return existingProfile;
  } catch (err) {
    console.error('❌ Error in profile verification:', err);
    throw err;
  }
};

// Function to test connection and schema
export const testSupabaseSetup = async () => {
  try {
    console.log('🔍 Testing Supabase connection and schema...');

    // Test 1: Basic connection
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Auth connection failed:', sessionError);
      return { success: false, error: sessionError };
    }
    console.log('✅ Auth connection successful');

    // Test 2: Database access
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    if (eventsError) {
      console.error('❌ Database access failed:', eventsError);
      return { success: false, error: eventsError };
    }
    console.log('✅ Database access successful');

    // Test 3: Schema inspection
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_info', { table_name: 'events' });

    if (schemaError) {
      console.error('❌ Schema inspection failed:', schemaError);
      return { success: false, error: schemaError };
    }
    console.log('✅ Schema inspection successful:', schemaData);

    // Test 4: RLS Policies
    const { data: rlsData, error: rlsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (rlsError) {
      console.error('❌ RLS policy check failed:', rlsError);
      return { success: false, error: rlsError };
    }
    console.log('✅ RLS policies working');

    return {
      success: true,
      schema: schemaData,
      auth: sessionData,
      rls: rlsData
    };
  } catch (error) {
    console.error('❌ Setup test failed:', error);
    return { success: false, error };
  }
};

// Function to test event creation
export const testEventCreation = async (userId: string) => {
  try {
    console.log('🔍 Testing event creation capability...');

    // 1. Verify user exists and has organizer role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ Profile check failed:', profileError);
      return { success: false, error: 'Profile check failed' };
    }

    if (profile.role !== 'organizer') {
      console.error('❌ User is not an organizer');
      return { success: false, error: 'User must be an organizer' };
    }

    // 2. Test event creation with minimal data
    const testEvent = {
      title: '__TEST_EVENT__',
      description: 'Test event description',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      venue: 'Test Venue',
      category: 'other',
      organizer_id: userId,
      ticket_price: 0,
      capacity: 1,
      status: 'Draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: null
    };

    console.log('📝 Attempting to create test event:', testEvent);

    const { data: newEvent, error: insertError } = await supabase
      .from('events')
      .insert([testEvent])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Test event creation failed:', insertError);
      return { success: false, error: insertError };
    }

    console.log('✅ Test event created successfully:', newEvent);

    // 3. Clean up test event
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', newEvent.id);

    if (deleteError) {
      console.warn('⚠️ Failed to clean up test event:', deleteError);
    }

    return { success: true, data: newEvent };
  } catch (error) {
    console.error('❌ Unexpected error in test event creation:', error);
    return { success: false, error };
  }
};

// Function to test RLS policies for event creation
export const testRLSPolicies = async (userId: string) => {
  try {
    console.log('🔍 Testing RLS policies for user:', userId);

    // 1. Test read permission
    console.log('1. Testing read permission...');
    const { data: readData, error: readError } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (readError) {
      console.error('❌ Read permission test failed:', readError);
      return { success: false, error: readError, stage: 'read' };
    }
    console.log('✅ Read permission test passed');

    // 2. Test insert permission with minimal data
    console.log('2. Testing insert permission...');
    const testEvent = {
      title: '__RLS_TEST__',
      description: 'RLS test event',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      venue: 'Test Venue',
      ticket_price: 0,
      capacity: 1,
      image_url: null,
      organizer_id: userId,
      status: 'Draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert([testEvent])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert permission test failed:', insertError);
      return { success: false, error: insertError, stage: 'insert' };
    }
    console.log('✅ Insert permission test passed');

    // 3. Test update permission
    if (insertData) {
      console.log('3. Testing update permission...');
      const { error: updateError } = await supabase
        .from('events')
        .update({ description: 'Updated description' })
        .eq('id', insertData.id);

      if (updateError) {
        console.error('❌ Update permission test failed:', updateError);
        return { success: false, error: updateError, stage: 'update' };
      }
      console.log('✅ Update permission test passed');

      // 4. Test delete permission
      console.log('4. Testing delete permission...');
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        console.error('❌ Delete permission test failed:', deleteError);
        return { success: false, error: deleteError, stage: 'delete' };
      }
      console.log('✅ Delete permission test passed');
    }

    return { success: true };
  } catch (error) {
    console.error('❌ RLS policy test failed:', error);
    return { success: false, error, stage: 'unknown' };
  }
};

// Function to verify events table structure
export const verifyEventsTable = async () => {
  try {
    console.log('🔍 Verifying events table structure...');

    // Test 1: Check if table exists and we can query it
    const { data: testData, error: testError } = await supabase
      .from('events')
      .select('count');

    if (testError) {
      console.error('❌ Events table test failed:', testError);
      return { success: false, error: testError };
    }

    // Test 2: Try to insert a test record
    const testEvent = {
      title: '__TEST__',
      description: 'Test event',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      venue: 'Test Venue',
      ticket_price: 0,
      capacity: 1,
      image_url: null,
      status: 'Draft',
      organizer_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert([testEvent])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Test insert failed:', insertError);
      return { success: false, error: insertError };
    }

    // Clean up test record
    if (insertData) {
      await supabase
        .from('events')
        .delete()
        .eq('id', insertData.id);
    }

    console.log('✅ Events table verified successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ Events table verification failed:', error);
    return { success: false, error };
  }
};