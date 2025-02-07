import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  // Redirect organizers to their dashboard
  if (!user || user.role === 'organizer') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/discover"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Discover Events
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* User Info Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-sm text-gray-900">{user.preferredName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          {/* My Tickets Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">My Tickets</h3>
              <Link
                to="/my-tickets"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                View All
              </Link>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {/* Sample ticket items - replace with actual ticket data */}
                  <li className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Summer Music Festival</p>
                        <p className="text-sm text-gray-500">July 15, 2024 at 18:00</p>
                      </div>
                      <Link
                        to="/tickets/1"
                        className="text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        View Ticket
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates about your tickets and events</p>
                </div>
                <button
                  type="button"
                  className="bg-green-100 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-green-600 shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 