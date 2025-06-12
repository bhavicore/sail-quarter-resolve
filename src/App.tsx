
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NewComplaint from './pages/NewComplaint';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/new-complaint" element={<NewComplaint />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
