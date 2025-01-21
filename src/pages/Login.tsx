import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
          alt="People networking"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-red-600/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-5xl font-bold text-white text-center">
            Gather. Innovate.<br />& Share Ideas
          </h2>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-red-600 font-bold">TicketJar</Link>
            <div className="text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="text-green-900 font-medium">Register</Link>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-gray-600 text-lg">Welcome back!</h2>
            <h1 className="text-3xl font-bold text-gray-900">Log in</h1>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-900 focus:outline-none focus:ring-1 focus:ring-green-900 text-sm"
                placeholder="Enter your Email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="block w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-green-900 focus:outline-none focus:ring-1 focus:ring-green-900 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-end">
                <Link to="/reset-password" className="text-sm text-green-900 hover:text-green-800">
                  Reset password
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-green-900 py-2 px-4 text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2 text-sm"
            >
              Log in
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.svgrepo.com/show/475656/apple-color.svg"
                  alt="Apple logo"
                />
                <span>Apple</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;