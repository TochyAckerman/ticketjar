import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="bg-white">
      {/* Message Toast */}
      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-50 text-green-800 rounded-lg p-4 shadow-lg border border-green-200">
            {message}
          </div>
        </div>
      )}

      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Concert crowd"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Gateway to Amazing Events
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Discover and book tickets for the most exciting concerts, insightful webinars, and inspiring art events.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link
              to="/concerts"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Browse Concerts
            </Link>
            <Link
              to="/webinars"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50"
            >
              Explore Webinars
            </Link>
          </div>
        </div>
      </div>

      {/* Category section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          What are you interested in?
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/concerts"
            className="relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
          >
            <img
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Concerts"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white">Concerts</h3>
              <p className="text-gray-200">Live music experiences</p>
            </div>
          </Link>

          <Link
            to="/webinars"
            className="relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
          >
            <img
              src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Webinars"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white">Webinars</h3>
              <p className="text-gray-200">Online learning and networking</p>
            </div>
          </Link>

          <Link
            to="/art"
            className="relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
          >
            <img
              src="https://images.unsplash.com/photo-1594794312433-05a69a98b7a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Art Events"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white">Art Events</h3>
              <p className="text-gray-200">Exhibitions and workshops</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;