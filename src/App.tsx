import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailVerification from './pages/EmailVerification';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Concerts from './pages/Concerts';
import Webinars from './pages/Webinars';
import Art from './pages/Art';
import MyTickets from './pages/MyTickets';
import EventManagement from './pages/EventManagement';
import CreateEvent from './pages/CreateEvent';
import Discover from './pages/Discover';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';
import EventList from './components/EventList';
import EventsByCategory from './components/EventsByCategory';
import TestConnection from './pages/TestConnection';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/concerts" element={<Concerts />} />
              <Route path="/webinars" element={<Webinars />} />
              <Route path="/art" element={<Art />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/test-connection" element={<TestConnection />} />
              
              {/* Customer-specific routes */}
              <Route path="/profile" element={
                <ProtectedRoute requiredRole="customer">
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/my-tickets" element={
                <ProtectedRoute requiredRole="customer">
                  <MyTickets />
                </ProtectedRoute>
              } />

              {/* Organizer-specific routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="organizer">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/events/manage" element={
                <ProtectedRoute requiredRole="organizer">
                  <EventManagement />
                </ProtectedRoute>
              } />
              <Route path="/events/create" element={
                <ProtectedRoute requiredRole="organizer">
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/events/category/:category" element={<EventsByCategory />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;