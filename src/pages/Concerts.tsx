import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  ticket_price: number;
  poster_url: string;
  tickets_available: number;
  is_featured: boolean;
  organizer_name: string;
}

const Concerts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        console.log('Fetching concerts with auth status:', !!user);
        
        // Use anon key for public access
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('category', 'concert')
          .eq('status', 'Published')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (error) {
          console.error('Error fetching concerts:', error);
          toast.error('Failed to load concerts');
          return;
        }

        console.log('Fetched concerts:', data);
        setEvents(data || []);
      } catch (err) {
        console.error('Error:', err);
        toast.error('Failed to load concerts');
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, [user]); // Add user to dependency array to refetch if auth status changes

  const handleBuyTickets = (eventId: string) => {
    if (!user) {
      // If user is not logged in, redirect to login with return URL
      navigate(`/login?redirect=/concerts/${eventId}/purchase`);
      return;
    }
    // If user is logged in, go directly to purchase
    navigate(`/concerts/${eventId}/purchase`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Concerts</h1>
        {user?.role === 'organizer' && (
          <button 
            onClick={() => navigate('/events/create')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Create Event
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No upcoming concerts available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="relative h-48">
                <img
                  src={event.poster_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.is_featured && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md text-sm">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <p className="mt-2 text-gray-500 line-clamp-2">{event.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {event.venue}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {event.tickets_available} tickets left
                  </div>
                  <p className="text-lg font-semibold text-green-600">₦{event.ticket_price.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => handleBuyTickets(event.id)}
                  className={`mt-4 w-full px-4 py-2 rounded-md transition-colors ${
                    event.tickets_available === 0 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  disabled={event.tickets_available === 0}
                >
                  {event.tickets_available === 0 ? 'Sold Out' : 'Buy Ticket'}
                </button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Organized by {event.organizer_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Concerts; 