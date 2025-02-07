import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User extends SupabaseUser {
  role: 'customer' | 'organizer';
  preferred_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ role: 'customer' | 'organizer' }>;
  register: (email: string, password: string, role: 'customer' | 'organizer', preferredName: string) => Promise<{ role: 'customer' | 'organizer' }>;
  logout: () => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, preferred_name')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching initial profile:', error);
            if (mounted) setUser(null);
          } else if (profile && mounted) {
            setUser({
              ...session.user,
              role: profile.role,
              preferred_name: profile.preferred_name
            });
          }
        } else if (mounted) {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth event:', event);
        console.log('Session:', session);

        try {
          if (session?.user) {
            if (event === 'SIGNED_IN') {
              console.log('Sign in detected, checking for profile...');
              
              // Check if profile exists
              const { data: existingProfile, error: profileCheckError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profileCheckError && profileCheckError.code !== 'PGRST116') {
                console.error('Error checking profile:', profileCheckError);
                throw profileCheckError;
              }

              // Create profile if it doesn't exist and we have the necessary metadata
              if (!existingProfile && session.user.user_metadata?.role) {
                console.log('Creating new profile for user:', session.user.id);
                const { error: createError } = await supabase
                  .from('profiles')
                  .insert([{
                    id: session.user.id,
                    email: session.user.email,
                    preferred_name: session.user.user_metadata.preferred_name,
                    role: session.user.user_metadata.role,
                    created_at: new Date().toISOString()
                  }]);

                if (createError) {
                  console.error('Profile creation error:', createError);
                  throw createError;
                }
              }

              // Fetch the latest profile data
              const { data: profile, error: fetchError } = await supabase
                .from('profiles')
                .select('role, preferred_name')
                .eq('id', session.user.id)
                .single();

              if (fetchError) {
                console.error('Error fetching profile:', fetchError);
                throw fetchError;
              }

              if (profile && mounted) {
                console.log('Setting user with profile:', profile);
                setUser({
                  ...session.user,
                  role: profile.role,
                  preferred_name: profile.preferred_name
                });
              }
            }
          } else if (mounted) {
            console.log('No session, clearing user');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          if (mounted) setUser(null);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    );

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = useCallback(async (
    email: string, 
    password: string, 
    role: 'customer' | 'organizer',
    preferredName: string
  ) => {
    try {
      // Check if user exists first
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('An account with this email already exists. Please log in or reset your password.');
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            preferred_name: preferredName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        // Handle rate limiting error specifically
        if (error.message.includes('rate limit')) {
          throw new Error('Too many registration attempts. Please wait a few minutes before trying again.');
        }
        console.error('Sign up error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('Registration failed - no user data');
      }

      // Create profile immediately with proper role and metadata
      const profileData = {
        id: data.user.id,
        email: email,
        role: role,
        preferred_name: preferredName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending_verification'
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([profileData], {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Sign out the user if profile creation fails
        await supabase.auth.signOut();
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      console.log('Registration successful, verification email sent to:', email);
      return { role };
    } catch (error) {
      console.error('Registration error:', error);
      // Clean up any partial registration
      try {
        await supabase.auth.signOut();
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      
      if (error instanceof Error) {
        // Return user-friendly error messages
        if (error.message.includes('rate limit')) {
          throw new Error('Too many registration attempts. Please wait a few minutes before trying again.');
        } else if (error.message.includes('already exists')) {
          throw new Error('An account with this email already exists. Please log in or reset your password.');
        }
        throw error;
      }
      throw new Error('Registration failed. Please try again later.');
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data?.user) throw new Error('Login failed - no user data');

      console.log('Auth successful, fetching user profile...');

      // Fetch the user's profile to get role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, preferred_name')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      if (!profile) {
        console.error('No profile found for user');
        throw new Error('User profile not found');
      }

      console.log('Profile fetched successfully:', profile);

      // Update the user state with role information
      setUser({
        ...data.user,
        role: profile.role,
        preferred_name: profile.preferred_name
      });

      // Enable RLS policies for the user
      const { error: rpcError } = await supabase.rpc('setup_user_role', {
        user_id: data.user.id,
        user_role: profile.role
      });

      if (rpcError) {
        console.error('Error setting up user role:', rpcError);
      }

      console.log('Login completed successfully with role:', profile.role);
      return { role: profile.role };

    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An error occurred during login');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear all local storage items
      localStorage.clear();
      sessionStorage.clear();

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;

      // Clear user state
      setUser(null);
      setLoading(false);

      // Force reload to ensure clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }, []);

  const resendVerificationCode = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to resend verification email');
    }
  }, []);

  const signUp = async (email: string, password: string, role: string = 'customer'): Promise<void> => {
    try {
      console.log('🔐 Starting signup process...');
      
      // Test connection before signup
      const { data: testData, error: testError } = await supabase.auth.getSession();
      console.log('🔌 Connection test:', testError ? 'Failed' : 'Success');
      
      if (testError) {
        console.error('❌ Connection test failed:', testError);
        throw new Error('Unable to connect to authentication service. Please check your internet connection.');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        throw error;
      }

      if (data?.user) {
        console.log('✅ Signup successful:', data.user.email);
        // Set the user role in the database
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            role: role,
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('❌ Profile creation error:', profileError);
          throw profileError;
        }
      }
    } catch (error) {
      console.error('❌ Signup process failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resendVerificationCode,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 