import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './lib/AuthContext';

// Lazy load components to improve performance
const Marketplace = lazy(() => import('./pages/Marketplace'));
const PricePrediction = lazy(() => import('./pages/PricePrediction'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const SignupSuccess = lazy(() => import('./pages/SignupSuccess'));
const FarmerDashboard = lazy(() => import('./pages/FarmerDashboard'));

// Loading component to show while lazy-loaded components are loading
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-60">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup-success" element={<SignupSuccess />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route 
                  path="/price-prediction" 
                  element={
                    <ProtectedRoute>
                      <PricePrediction />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/farmer-dashboard" 
                  element={
                    <ProtectedRoute userTypeRequired="farmer">
                      <FarmerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/farmers" 
                  element={
                    <ProtectedRoute userTypeRequired="farmer">
                      <FarmerDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;