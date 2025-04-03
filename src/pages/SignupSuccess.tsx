import React from 'react';
import { Link } from 'react-router-dom';

const SignupSuccess = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h1>
      
      <p className="text-gray-600 mb-6">
        Thank you for registering with FarmConnect. Please check your email to confirm your account.
      </p>
      
      <div className="space-y-4">
        <Link
          to="/login"
          className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
        >
          Go to Login
        </Link>
        
        <Link
          to="/"
          className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default SignupSuccess; 