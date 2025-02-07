import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import EventForm from '../components/EventForm';
import Modal from '../components/ui/Modal';
import { HiPlus, HiTicket, HiCurrencyDollar, HiUserGroup, HiCalendar, HiClock, HiArchive } from 'react-icons/hi';

type TabType = 'active' | 'inactive' | 'closed';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect customers to their profile page
  if (!user || user.role !== 'organizer') {
    return <Navigate to="/profile" replace />;
  }

  const handleCreateEvent = async (eventData: any) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement API call to create event
      console.log('Creating event:', eventData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setCreateModalOpen(false);
      // TODO: Show success message and refresh events list
    } catch (error) {
      console.error('Failed to create event:', error);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'active', label: 'Active Events', icon: HiCalendar, emptyMessage: 'No active events', description: 'Get started by creating a new event' },
    { id: 'inactive', label: 'Inactive Events', icon: HiClock, emptyMessage: 'No inactive events', description: 'Events that are drafted or paused will appear here' },
    { id: 'closed', label: 'Closed Events', icon: HiArchive, emptyMessage: 'No closed events', description: 'Past events that have ended will appear here' },
  ] as const;

  const renderEmptyState = (tab: typeof tabs[number]) => {
    return (
      <div className="text-center py-8">
        <div className="p-3 rounded-full bg-gray-100 bg-opacity-50 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <tab.icon className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">{tab.emptyMessage}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {tab.description}
        </p>
        <div className="mt-6">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <HiPlus className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = (tab: TabType) => {
    const currentTab = tabs.find(t => t.id === tab);
    if (!currentTab) return null;
    
    // For now, always show empty state since we don't have data
    return renderEmptyState(currentTab);
  };

  return (
    <DashboardLayout>
      {/* Header Section with Welcome Text and CTA */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hello, {user.preferred_name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to your event management dashboard
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Create Event
        </button>
      </div>

      {/* Analytics Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Tickets Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 bg-opacity-50">
              <HiTicket className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Tickets Sold</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="ml-2 text-sm text-gray-500">tickets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 bg-opacity-50">
              <HiCurrencyDollar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">$0</p>
                <p className="ml-2 text-sm text-gray-500">USD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 bg-opacity-50">
              <HiUserGroup className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Demographics</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="ml-2 text-sm text-gray-500">unique attendees</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section with Tabs */}
      <div className="bg-white rounded-lg shadow">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200
                  ${activeTab === id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent(activeTab)}
        </div>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !isSubmitting && setCreateModalOpen(false)}
        title="Create New Event"
        size="lg"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => !isSubmitting && setCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard; 