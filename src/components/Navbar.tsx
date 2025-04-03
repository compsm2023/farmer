import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBasket, User, Menu, LogOut, Home } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileMenuOpen(false);
      // Redirect to home page after sign out
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBasket className="h-8 w-8" />
            <span className="font-bold text-xl">FarmConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="hover:text-green-200 flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/marketplace" className="hover:text-green-200">Marketplace</Link>
            {profile?.user_type === 'farmer' && (
              <Link to="/farmer-dashboard" className="hover:text-green-200">Farmer Dashboard</Link>
            )}
            <Link to="/price-prediction" className="hover:text-green-200">Price Prediction</Link>
            
            {user ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 hover:text-green-200 focus:outline-none"
                >
                  <span>{profile?.full_name || 'Account'}</span>
                  <User className="h-6 w-6" />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Signed in as<br />
                      <strong className="font-semibold">{profile?.user_type === 'farmer' ? 'Farmer' : 'Consumer'}</strong>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    {profile?.user_type === 'farmer' && (
                      <Link
                        to="/farmer-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Farmer Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="relative group">
                  <Link 
                    to="/login" 
                    className="text-white hover:text-green-200"
                  >
                    Log in
                  </Link>
                  <div className="absolute hidden group-hover:block right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Consumer Login
                    </Link>
                    <Link
                      to="/login?type=farmer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Farmer Login
                    </Link>
                  </div>
                </div>
                <div className="relative group">
                  <Link 
                    to="/signup" 
                    className="bg-white text-green-600 hover:bg-green-100 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Sign up
                  </Link>
                  <div className="absolute hidden group-hover:block right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Consumer Signup
                    </Link>
                    <Link
                      to="/signup?type=farmer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Farmer Signup
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-green-200 hover:bg-green-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="flex items-center px-3 py-2 rounded-md hover:bg-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                <span>Home</span>
              </Link>
              <Link
                to="/marketplace"
                className="block px-3 py-2 rounded-md hover:bg-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              {profile?.user_type === 'farmer' && (
                <Link
                  to="/farmer-dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-green-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Farmer Dashboard
                </Link>
              )}
              <Link
                to="/price-prediction"
                className="block px-3 py-2 rounded-md hover:bg-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Price Prediction
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md hover:bg-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {profile?.user_type === 'farmer' && (
                    <Link
                      to="/farmer-dashboard"
                      className="block px-3 py-2 rounded-md hover:bg-green-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Farmer Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-green-700"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="block px-3 py-2 text-white font-medium">Login as:</div>
                  <Link
                    to="/login"
                    className="block px-6 py-2 rounded-md hover:bg-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Consumer
                  </Link>
                  <Link
                    to="/login?type=farmer"
                    className="block px-6 py-2 rounded-md hover:bg-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Farmer
                  </Link>
                  
                  <div className="block px-3 py-2 mt-2 text-white font-medium">Sign up as:</div>
                  <Link
                    to="/signup"
                    className="block px-6 py-2 rounded-md hover:bg-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Consumer
                  </Link>
                  <Link
                    to="/signup?type=farmer"
                    className="block px-6 py-2 rounded-md hover:bg-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Farmer
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;