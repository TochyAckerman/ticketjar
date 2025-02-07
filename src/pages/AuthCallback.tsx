import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the access_token and refresh_token from the URL fragment
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const email = hashParams.get('email');

        console.log('Auth callback params:', { 
          type, 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          email 
        });

        if (!accessToken || !refreshToken) {
          throw new Error('No tokens found in URL');
        }

        // Clear any existing session
        await supabase.auth.signOut();

        // Clear browser storage
        localStorage.clear();
        sessionStorage.clear();

        // Small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Clear the URL hash immediately
        window.history.replaceState(null, '', window.location.pathname);

        // Navigate to login with the verified email
        navigate('/login', {
          state: {
            verificationSuccess: true,
            verifiedEmail: email || '',
            message: 'Email verified successfully! Please log in with your password.'
          },
          replace: true
        });

        toast.success('Email verified successfully! Please log in.');

      } catch (err) {
        console.error('Error in email verification:', err);
        setError(err instanceof Error ? err.message : 'Failed to verify email');
        toast.error('Failed to verify email. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    // Check if this is an email verification callback
    if (location.hash.includes('access_token')) {
      handleEmailVerification();
    } else {
      // Not a verification callback, redirect to login
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Verification Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Verifying Email</h2>
          <p className="mt-2 text-gray-600">Please wait while we verify your email...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback; 