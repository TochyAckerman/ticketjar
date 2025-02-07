import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiHome, HiCalendar, HiCog, HiUser, HiMenu, HiX, HiLogout, HiTicket, HiUsers } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import LogoImage from '../../assets/Logo.png';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: HiHome },
    { path: '/events', label: 'Events', icon: HiCalendar },
    { path: '/settings', label: 'Settings', icon: HiCog },
    { path: '/profile', label: 'Profile', icon: HiUser },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { state: { message: "You've been logged out successfully" } });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow z-40 ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-24">
            {/* Right side - Event Manager Name */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Event Manager</p>
                <p className="text-base font-medium text-gray-900">{user?.email}</p>
              </div>
              <img
                className="h-10 w-10 rounded-full bg-gray-200"
                src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=0D9488&color=fff`}
                alt={user?.email || 'Profile'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Fixed Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-50`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-24 flex items-center justify-center px-4 border-b">
              <Link to="/dashboard" className="flex items-center">
                <img
                  src={LogoImage}
                  alt="TicketJar"
                  width={100}
                  height={100}
                  className="hover:opacity-80 transition-opacity object-contain"
                />
              </Link>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Logout Button at Bottom */}
            <div className="px-4 py-4 border-t mt-auto">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
              >
                <HiLogout className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 pt-24">
          {/* Mobile Header */}
          <div className="lg:hidden h-16 bg-white shadow-sm flex items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600"
            >
              <HiMenu className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;