import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  email: string;
}

const EmailVerification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resendVerificationCode } = useAuth();
  const { email } = (location.state as LocationState) || {};

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleResendLink = async () => {
    try {
      await resendVerificationCode(email);
      // Show success message
      alert('Verification link has been resent to your email');
    } catch (error) {
      // Show error message
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to resend verification link');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Check your email
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              A verification link has been sent to
            </p>
            <p className="mt-2 text-lg font-medium text-green-600">
              {email}
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Click the link in your email to verify your account.
            </p>
            <button
              onClick={handleResendLink}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Resend verification link
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Already verified? {' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 