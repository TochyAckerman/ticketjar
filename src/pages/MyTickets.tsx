import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Ticket } from '../types/ticket';
import TicketManagement from '../components/TicketManagement';

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      try {
        // TODO: Implement API call to fetch user's tickets
        const response = await fetch('/api/tickets/my-tickets');
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const handleTransferComplete = async () => {
    // Refresh tickets after transfer
    try {
      const response = await fetch('/api/tickets/my-tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError('Failed to refresh tickets');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="mt-2 text-sm text-gray-500">
            View and manage your tickets for upcoming events
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't purchased any tickets yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map(ticket => (
              <TicketManagement
                key={ticket.id}
                ticket={ticket}
                onTransferComplete={handleTransferComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets; 