import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    location: '',
    user_type: 'consumer' as 'farmer' | 'consumer'
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the URL has a farmer type parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'farmer') {
      setFormData(prev => ({ ...prev, user_type: 'farmer' }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.user_type,
        {
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location
        }
      );
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect based on user type
        if (formData.user_type === 'farmer') {
          navigate('/login?type=farmer');
        } else {
          navigate('/signup-success');
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
      <h1 className="text-2xl font-bold text-center text-green-600 mb-2">Create an Account</h1>
      <p className="text-center text-gray-600 mb-6">
        {formData.user_type === 'farmer' ? 'Farmer Registration' : 'Consumer Registration'}
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Toggle between Farmer and Consumer */}
      <div className="flex mb-6 border rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 ${formData.user_type === 'consumer' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setFormData(prev => ({ ...prev, user_type: 'consumer' }))}
          type="button"
        >
          Consumer
        </button>
        <button
          className={`flex-1 py-2 ${formData.user_type === 'farmer' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setFormData(prev => ({ ...prev, user_type: 'farmer' }))}
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
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : `Create ${formData.user_type === 'farmer' ? 'Farmer' : 'Consumer'} Account`}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={formData.user_type === 'farmer' ? "/login?type=farmer" : "/login"} className="text-green-600 hover:text-green-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup; 