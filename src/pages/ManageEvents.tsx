import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Event, EventStatus } from '../types/event';

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([
    // Sample data - replace with API call
    {
      id: '1',
      title: 'Summer Music Festival',
      shortDescription: 'A day of amazing music and fun',
      description: 'Join us for the biggest summer music festival featuring top artists from around the world.',
      category: 'Music',
      status: 'Published',
      date: '2024-07-15',
      time: '14:00',
      venue: {
        name: 'Central Park',
        address: '123 Park Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      organizerId: '1',
      images: [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
          alt: 'Festival',
          isPrimary: true
        }
      ],
      ticketTypes: [
        {
          id: '1',
          name: 'General Admission',
          description: 'Standard entry ticket',
          price: 99.99,
          quantity: 1000,
          maxPerCustomer: 4,
          availableFrom: '2024-05-01T00:00:00',
          availableUntil: '2024-07-14T23:59:59'
        }
      ],
      tags: ['music', 'festival', 'summer'],
      createdAt: '2024-01-01T00:00:00',
      updatedAt: '2024-01-01T00:00:00',
      publishedAt: '2024-01-01T00:00:00',
      featured: true
    }
  ]);

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // TODO: Implement API call to delete event
        console.log('Deleting event:', eventId);
        setEvents(prev => prev.filter(event => event.id !== eventId));
      } catch (error) {
        console.error('Failed to delete event:', error);
        // TODO: Show error message to user
      }
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: EventStatus) => {
    try {
      // TODO: Implement API call to update event status
      console.log('Updating event status:', { eventId, newStatus });
      setEvents(prev =>
        prev.map(event =>
          event.id === eventId
            ? { ...event, status: newStatus }
            : event
        )
      );
    } catch (error) {
      console.error('Failed to update event status:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
            <p className="mt-2 text-sm text-gray-500">
              Create, edit, and manage your events
            </p>
          </div>
          <Link
            to="/events/create"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Create New Event
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {events.map(event => (
              <li key={event.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-semibold text-gray-900 truncate">
                        {event.title}
                      </h2>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{event.shortDescription}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate(`/events/${event.id}/edit`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <select
                      value={event.status}
                      onChange={(e) => handleStatusChange(event.id, e.target.value as EventStatus)}
                      className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ticket Types</h3>
                    <ul className="mt-2 space-y-2">
                      {event.ticketTypes.map(ticket => (
                        <li key={ticket.id} className="text-sm text-gray-900">
                          {ticket.name} - ${ticket.price} ({ticket.quantity} available)
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Venue</h3>
                    <p className="mt-2 text-sm text-gray-900">
                      {event.venue.name}
                      <br />
                      {event.venue.city}, {event.venue.state}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Sales</h3>
                    <p className="mt-2 text-sm text-gray-900">
                      {/* TODO: Add sales statistics */}
                      Coming soon
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents; 