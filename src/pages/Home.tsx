import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingCart, TrendingUp, Tractor, Users, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const Home = () => {
  const { user, profile } = useAuth();
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          Fresh From Farm to Table
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Connect directly with local farmers and get fresh produce at the best prices.
          Support sustainable agriculture and eat healthier.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/marketplace"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Browse Marketplace
          </Link>
          {!user && (
            <Link
              to="/signup"
              className="inline-block bg-white text-green-600 border border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Join FarmConnect
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Sprout className="h-12 w-12 text-green-600 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold">Fresh Produce</h3>
          <p className="mt-2 text-gray-600">
            Get fresh, seasonal produce directly from local farmers
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <ShoppingCart className="h-12 w-12 text-green-600 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold">Direct Purchase</h3>
          <p className="mt-2 text-gray-600">
            Skip the middleman and support local agriculture
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <TrendingUp className="h-12 w-12 text-green-600 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold">Price Predictions</h3>
          <p className="mt-2 text-gray-600">
            AI-powered insights for better buying decisions
          </p>
        </div>
      </div>

      {/* Farmer Join Section */}
      {!user || (user && profile?.user_type !== 'farmer') ? (
        <div className="mt-16 bg-green-600 text-white rounded-xl overflow-hidden">
          <div className="md:flex items-center">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Are You a Farmer?</h2>
              <p className="mb-6">
                Join our platform to sell your produce directly to consumers. 
                Set your own prices, manage your inventory, and grow your business.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <ChevronRight className="h-5 w-5 mr-2" />
                  <span>No middlemen, higher profits</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-5 w-5 mr-2" />
                  <span>Direct connection with consumers</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-5 w-5 mr-2" />
                  <span>Easy inventory management</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-5 w-5 mr-2" />
                  <span>Price prediction tools</span>
                </li>
              </ul>
              <Link
                to="/signup"
                className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join as a Farmer
              </Link>
            </div>
            <div className="md:w-1/2 bg-green-700">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                alt="Farmer"
                className="w-full h-full object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Featured Products */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-2">Featured Products</h2>
        <p className="text-center text-gray-600 mb-8">Discover fresh and seasonal products from local farmers</p>
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sample products - will be replaced with dynamic data */}
          {[
            {
              id: 1,
              name: 'Fresh Tomatoes',
              price: 3.99,
              image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=400&h=300'
            },
            {
              id: 2,
              name: 'Organic Lettuce',
              price: 2.49,
              image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=400&h=300'
            },
            {
              id: 3,
              name: 'Farm Eggs',
              price: 4.99,
              image: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&w=400&h=300'
            },
            {
              id: 4,
              name: 'Honey',
              price: 7.99,
              image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=400&h=300'
            }
          ].map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-green-600 font-medium mt-1">${product.price.toFixed(2)}/unit</p>
                <Link
                  to="/marketplace"
                  className="mt-3 inline-block text-sm text-green-600 hover:text-green-800"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/marketplace"
            className="inline-block bg-white border border-green-600 text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">What People Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-sm text-gray-600">Consumer</p>
              </div>
            </div>
            <p className="text-gray-700">
              "I've been buying directly from farmers and the quality is amazing. My family loves the fresh produce!"
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <Tractor className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">David Wilson</h4>
                <p className="text-sm text-gray-600">Farmer</p>
              </div>
            </div>
            <p className="text-gray-700">
              "This platform has helped me reach more customers and sell my organic vegetables at fair prices."
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">Michael Brown</h4>
                <p className="text-sm text-gray-600">Consumer</p>
              </div>
            </div>
            <p className="text-gray-700">
              "The price prediction feature helps me plan my grocery shopping and save money while supporting local farmers."
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our growing community of farmers and consumers and experience the benefits of direct farm-to-table connections.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/marketplace"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Explore Marketplace
          </Link>
          {!user && (
            <Link
              to="/signup"
              className="bg-white text-green-600 border border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;