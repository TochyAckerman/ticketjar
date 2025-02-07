import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EventCategory } from '../types/event';
import { EventSearchFilters, EventSearchParams, EventSearchResult } from '../types/search';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import debounce from 'lodash/debounce';

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

interface EventSearchProps {
  initialFilters?: EventSearchFilters;
  onSearch: (params: EventSearchParams) => Promise<void>;
  results: EventSearchResult[];
  isLoading: boolean;
  totalResults: number;
}

const EventSearch: React.FC<EventSearchProps> = ({
  initialFilters,
  onSearch,
  results,
  isLoading,
  totalResults
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<EventSearchFilters>(initialFilters || {});
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedMarker, setSelectedMarker] = useState<EventSearchResult | null>(null);

  const categories: EventCategory[] = [
    'Music',
    'Conference',
    'Sports',
    'Art',
    'Workshop',
    'Webinar'
  ];

  const debouncedSearch = useCallback(
    debounce((searchParams: EventSearchParams) => {
      onSearch(searchParams);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    const params: EventSearchParams = {
      query,
      page: parseInt(searchParams.get('page') || '1'),
      limit: 12,
      sortBy: (searchParams.get('sortBy') as EventSearchParams['sortBy']) || 'date',
      sortOrder: (searchParams.get('sortOrder') as EventSearchParams['sortOrder']) || 'asc',
      ...filters
    };

    debouncedSearch(params);

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('q', query);
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.startDate) newSearchParams.set('startDate', filters.startDate);
    if (filters.endDate) newSearchParams.set('endDate', filters.endDate);
    if (filters.minPrice) newSearchParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) newSearchParams.set('maxPrice', filters.maxPrice.toString());
    setSearchParams(newSearchParams);
  }, [query, filters, searchParams.get('page'), searchParams.get('sortBy'), searchParams.get('sortOrder')]);

  const handleFilterChange = (key: keyof EventSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMarkerClick = (event: EventSearchResult) => {
    setSelectedMarker(event);
    setMapCenter(event.venue.coordinates);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <div className="lg:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Category</h3>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Date Range</h3>
            <div className="space-y-2">
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Price Range</h3>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Min"
                className="w-1/2 p-2 border rounded-md"
              />
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Max"
                className="w-1/2 p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Location</h3>
            <input
              type="text"
              value={filters.location?.city || ''}
              onChange={(e) => handleFilterChange('location', { ...filters.location, city: e.target.value })}
              placeholder="City"
              className="w-full p-2 border rounded-md mb-2"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                value={filters.location?.state || ''}
                onChange={(e) => handleFilterChange('location', { ...filters.location, state: e.target.value })}
                placeholder="State"
                className="w-1/2 p-2 border rounded-md"
              />
              <input
                type="text"
                value={filters.location?.country || ''}
                onChange={(e) => handleFilterChange('location', { ...filters.location, country: e.target.value })}
                placeholder="Country"
                className="w-1/2 p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Results and Map */}
        <div className="flex-1">
          {showMap && (
            <div className="mb-6">
              <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={12}
                >
                  {results.map(event => (
                    <Marker
                      key={event.id}
                      position={event.venue.coordinates}
                      onClick={() => handleMarkerClick(event)}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
              {selectedMarker && (
                <div className="mt-4 p-4 border rounded-md">
                  <h3 className="font-medium">{selectedMarker.title}</h3>
                  <p className="text-sm text-gray-500">{selectedMarker.venue.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedMarker.venue.address}, {selectedMarker.venue.city}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              {isLoading ? 'Searching...' : `${totalResults} events found`}
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(event => (
              <div
                key={event.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <img
                  src={event.thumbnail}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {event.venue.city}, {event.venue.state}
                  </p>
                  <p className="text-green-600 font-medium">
                    ${event.price.min} - ${event.price.max}
                  </p>
                  {event.distance && (
                    <p className="text-sm text-gray-500 mt-2">
                      {event.distance.toFixed(1)} km away
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSearch; 