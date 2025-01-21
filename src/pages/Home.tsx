import React from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';

const events = [
  {
    type: 'Festival',
    title: 'California Holiday Festival',
    price: '$0',
    image: 'https://images.unsplash.com/photo-1495464101292-552d0fb4b935?auto=format&fit=crop&w=1200&q=80'
  },
  {
    type: 'Concert',
    title: 'Revival Music Group Concert',
    price: '$49.99',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80'
  },
  {
    type: 'Tech',
    title: 'Annual Tech Conference 2025',
    price: '$0',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
  },
  {
    type: 'Beach',
    title: 'Beach Festival 2025',
    price: '$10',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  }
];

function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-6xl font-bold mb-10">Create your event with easy</h1>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg p-3 flex items-center space-x-4">
            <div className="flex-1 flex items-center space-x-2 px-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="City or zip code"
                className="w-full focus:outline-none text-gray-900 text-sm"
              />
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex-1 flex items-center space-x-2 px-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="All date"
                className="w-full focus:outline-none text-gray-900 text-sm"
              />
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex-1 flex items-center space-x-2 px-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Event, Artist or Venue"
                className="w-full focus:outline-none text-gray-900 text-sm"
              />
            </div>
            <button className="bg-green-900 text-white px-5 py-2 rounded hover:bg-green-800 text-sm">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Event Sections */}
      {['Upcoming events', 'Free events', 'Past events'].map((section, sectionIndex) => (
        <div key={sectionIndex} className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{section}</h2>
            <button className="text-2xl text-gray-400 hover:text-gray-600">
              ›
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            {events.map((event, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm text-gray-500 mb-1">{event.type}</div>
                <h3 className="text-base font-medium text-gray-900 mb-1">{event.title}</h3>
                <div className="text-gray-900">{event.price}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">TicketJar</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="hover:text-white cursor-pointer">Create Events</li>
                <li className="hover:text-white cursor-pointer">Pricing</li>
                <li className="hover:text-white cursor-pointer">Event Marketing Platform</li>
                <li className="hover:text-white cursor-pointer">Mobile App</li>
                <li className="hover:text-white cursor-pointer">Community Guidelines</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Sitemap</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Plan Events</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="hover:text-white cursor-pointer">Sell Tickets Online</li>
                <li className="hover:text-white cursor-pointer">Event Planning</li>
                <li className="hover:text-white cursor-pointer">Event Planning System</li>
                <li className="hover:text-white cursor-pointer">Event Management Software</li>
                <li className="hover:text-white cursor-pointer">Virtual Events Platform</li>
                <li className="hover:text-white cursor-pointer">Event Check-In</li>
                <li className="hover:text-white cursor-pointer">Post your event online</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Find Events</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="hover:text-white cursor-pointer">New Orleans Food & Drink Events</li>
                <li className="hover:text-white cursor-pointer">San Francisco Holiday Events</li>
                <li className="hover:text-white cursor-pointer">Miami Music Events</li>
                <li className="hover:text-white cursor-pointer">Denver Hobby Events</li>
                <li className="hover:text-white cursor-pointer">Atlanta Pop Music Events</li>
                <li className="hover:text-white cursor-pointer">New York Events</li>
                <li className="hover:text-white cursor-pointer">Chicago Events</li>
                <li className="hover:text-white cursor-pointer">Events in Dallas Today</li>
                <li className="hover:text-white cursor-pointer">Los Angeles Events</li>
                <li className="hover:text-white cursor-pointer">Washington Events</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="hover:text-white cursor-pointer">Contact Support</li>
                <li className="hover:text-white cursor-pointer">Contact Sales</li>
                <li className="hover:text-white cursor-pointer">X</li>
                <li className="hover:text-white cursor-pointer">Facebook</li>
                <li className="hover:text-white cursor-pointer">LinkedIn</li>
                <li className="hover:text-white cursor-pointer">Instagram</li>
                <li className="hover:text-white cursor-pointer">TikTok</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-gray-900 text-gray-400 border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center text-xs space-x-2">
            <span>© 2025 TicketJar</span>
            <span>•</span>
            <a href="#" className="hover:text-white">About</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Blog</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Help</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Careers</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Press</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Security</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Developers</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Accessibility</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;