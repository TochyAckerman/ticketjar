import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Event } from '../types/event';
import Layout from '../components/layout/Layout';

const CATEGORIES = [
  { id: 'all', name: 'All Events', icon: '🎉' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'arts', name: 'Arts & Theater', icon: '🎭' },
  { id: 'food', name: 'Food & Drink', icon: '🍷' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'other', name: 'Other', icon: '✨' }
];

const Discover = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  useEffect(() => {
    fetchEvents();

    const subscription = supabase
      .channel('public-events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `status=eq.Published`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents(prev => [...prev, payload.new as Event]);
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => prev.map(event => 
              event.id === payload.new.id ? payload.new as Event : event
            ));
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => prev.filter(event => event.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'Published')
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;

      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.venue.name && event.venue.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.venue.city && event.venue.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const selectedCategoryInfo = CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
          <p className="mt-2 text-gray-600">Find and book tickets for amazing events near you</p>
        </div>

        {/* Category Navigation - Desktop */}
        <div className="hidden md:block mb-8">
          <nav className="flex space-x-4 overflow-x-auto pb-2">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Category Dropdown - Mobile */}
        <div className="md:hidden mb-8 relative">
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span className="flex items-center justify-between">
              <span>
                <span className="mr-2">{selectedCategoryInfo?.icon}</span>
                {selectedCategoryInfo?.name}
              </span>
              <svg
                className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                  showCategoryMenu ? 'rotate-180' : ''
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
          {showCategoryMenu && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowCategoryMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    selectedCategory === category.id
                      ? 'bg-green-50 text-green-800'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

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
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                  {event.images && event.images[0] ? (
                    <img
                      src={event.images[0].url}
                      alt={event.images[0].alt}
                      className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{event.description}</p>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {event.venue.name}
                      {event.venue.city && `, ${event.venue.city}`}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        From ${Math.min(...event.ticketTypes.map(t => t.price))}
                      </span>
                      <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                        Book Now →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Discover;