import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiHome, HiCalendar, HiCog, HiUser, HiMenu, HiX, HiLogout } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import LogoImage from '../../assets/Logo.png';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-24 flex items-center justify-between px-4 border-b">
              <Link to="/dashboard" className="flex items-center">
                <img
                  src={LogoImage}
                  alt="TicketJar"
                  width={100}
                  height={100}
                  className="mr-2 hover:opacity-80 transition-opacity object-contain"
                />
              </Link>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <HiX className="h-6 w-6" />
              </button>
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
        <div className="flex-1 flex flex-col overflow-hidden pl-64">
          {/* Mobile Header */}
          <div className="lg:hidden h-16 bg-white shadow-sm flex items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600"
            >
              <HiMenu className="h-6 w-6" />
            </button>
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-150"
              title="Logout"
            >
              <HiLogout className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
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