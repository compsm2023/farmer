import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'farmer' | 'consumer'>('consumer');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the URL has a farmer type parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'farmer') {
      setUserType('farmer');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect based on user type
        if (userType === 'farmer') {
          navigate('/farmer-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-2">Log in to FarmConnect</h1>
      <p className="text-center text-gray-600 mb-6">
        {userType === 'farmer' ? 'Farmer Account Login' : 'Consumer Account Login'}
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Toggle between Farmer and Consumer */}
      <div className="flex mb-6 border rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 ${userType === 'consumer' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setUserType('consumer')}
          type="button"
        >
          Consumer
        </button>
        <button
          className={`flex-1 py-2 ${userType === 'farmer' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setUserType('farmer')}
          type="button"
        >
          Farmer
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            to={userType === 'farmer' ? "/signup?type=farmer" : "/signup"} 
            className="text-green-600 hover:text-green-800"
          >
            Sign up as a {userType}
          </Link>
        </p>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Link
            to={userType === 'farmer' ? "/signup?type=farmer" : "/signup"}
            className="w-full flex justify-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 hover:bg-green-50"
          >
            Create new {userType} account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 