import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <nav className="bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <Link to="/" className="text-red-600 font-bold">
                  TicketJar
                </Link>
                <div className="hidden md:flex md:items-center md:ml-10 space-x-8">
                  <Link to="/concerts" className="text-gray-500 hover:text-gray-900">Concerts</Link>
                  <Link to="/webinars" className="text-gray-500 hover:text-gray-900">Webinars</Link>
                  <Link to="/art" className="text-gray-500 hover:text-gray-900">Art</Link>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-gray-500 hover:text-gray-900">Log in</Link>
                <Link to="/register" className="bg-green-900 text-white px-4 py-1.5 rounded hover:bg-green-800">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;