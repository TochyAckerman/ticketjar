import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  date: string;
  time: string;
  venue: string;
  ticket_price: number;
  capacity: number;
  poster_url: string | null;
  organizer_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

const EventsByCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events for the current category
        const { data, error: fetchError } = await supabase
          .from('events')
          .select(`
            *,
            profiles:organizer_id (
              full_name,
              email
            )
          `)
          .eq('category', category)
          .eq('status', 'Published')
          .order('date', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setEvents(data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch events';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time subscription for this category
    const subscription = supabase
      .channel(`events-${category}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `category=eq.${category}`
        },
        async (payload) => {
          console.log('Event update:', payload);
          // Refresh the events list when changes occur
          await fetchEvents();
        }
      )
      .subscribe();

    // Initial fetch
    fetchEvents();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">No events found in {category}</h2>
        <p className="text-gray-600">Check back later for upcoming events in this category.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 capitalize">{category} Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {event.poster_url && (
              <img
                src={event.poster_url}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Time:</span> {event.time}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Venue:</span> {event.venue}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Price:</span> ₦{event.ticket_price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Capacity:</span> {event.capacity} attendees
                </p>
              </div>
              <div className="mt-4">
                <button
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                  onClick={() => {/* TODO: Implement ticket purchase/booking */}}
                >
                  Book Tickets
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsByCategory; 