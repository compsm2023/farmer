import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userTypeRequired?: 'farmer' | 'consumer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  userTypeRequired 
}) => {
  const { user, profile, isLoading } = useAuth();

  // If still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authentication is required for a specific user type
  if (userTypeRequired && profile?.user_type !== userTypeRequired) {
    // Redirect users to their appropriate areas
    return <Navigate to="/" replace />;
  }

  // If all conditions are met, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 