import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/layout/DashboardLayout';
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
  profiles: any;
}

const EventManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    location.state?.message || null
  );

  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    if (!user) {
      console.log('No user found, skipping event fetch');
      return;
    }

    const fetchEvents = async () => {
      try {
        console.log('🔄 Fetching events for user:', user.id);
        setLoading(true);
        const { data: events, error } = await supabase
          .from('events')
          .select(`
            *,
            profiles:organizer_id (
              full_name,
              email
            )
          `)
          .eq('organizer_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching events:', error);
          toast.error('Failed to load events');
          return;
        }

        console.log('✅ Events fetched successfully:', events?.length || 0, 'events found', events);
        setEvents(events || []);
      } catch (error) {
        console.error('❌ Error:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Set up real-time subscription with enhanced logging
    console.log('🔌 Setting up real-time subscription for user:', user.id);
    const subscription = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `organizer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📡 Real-time update received:', {
            eventType: payload.eventType,
            payload: payload
          });
          
          if (payload.eventType === 'INSERT') {
            console.log('➕ New event inserted:', payload.new);
            setEvents(prev => {
              console.log('Current events:', prev);
              const updated = [payload.new as Event, ...prev];
              console.log('Updated events:', updated);
              return updated;
            });
          } else if (payload.eventType === 'UPDATE') {
            console.log('🔄 Event updated:', payload.new);
            setEvents(prev => 
              prev.map(event => 
                event.id === payload.new.id ? payload.new as Event : event
              )
            );
          } else if (payload.eventType === 'DELETE') {
            console.log('❌ Event deleted:', payload.old);
            setEvents(prev => 
              prev.filter(event => event.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    return () => {
      console.log('🔌 Cleaning up real-time subscription');
      subscription.unsubscribe();
    };
  }, [user]);

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('organizer_id', user?.id);

      if (deleteError) {
        console.error('Error deleting event:', deleteError);
        throw deleteError;
      }

      toast.success('Event deleted successfully');
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Failed to delete event:', err);
      toast.error('Failed to delete event');
      setError('Failed to delete event');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Manage Events</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage your events
            </p>
          </div>
          <Link
            to="/events/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Create New Event
          </Link>
        </div>

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {events.map((event) => (
                <li key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium capitalize">{event.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">{formatDate(event.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">{formatTime(event.time)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Venue</p>
                          <p className="font-medium">{event.venue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ticket Price</p>
                          <p className="font-medium">{formatCurrency(event.ticket_price)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-medium">{event.capacity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Organizer</p>
                          <p className="font-medium">{(event.profiles as any)?.full_name || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                    {event.poster_url && (
                      <img 
                        src={event.poster_url} 
                        alt={event.title}
                        className="w-32 h-32 object-cover rounded-lg ml-4 flex-shrink-0"
                      />
                    )}
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EventManagement; 