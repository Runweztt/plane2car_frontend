import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PassengerDashboard from './pages/PassengerDashboard';
import BookingForm from './pages/BookingForm';
import ConciergeDashboard from './pages/ConciergeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['passenger']}>
                  <PassengerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/book" element={
                <ProtectedRoute allowedRoles={['passenger']}>
                  <BookingForm />
                </ProtectedRoute>
              } />

              <Route path="/concierge" element={
                <ProtectedRoute allowedRoles={['concierge']}>
                  <ConciergeDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
