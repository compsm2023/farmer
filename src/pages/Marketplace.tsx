import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Product } from '../types';
import { formatUsdAsInr } from '../lib/currency';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data - will be replaced with actual data from Supabase
  const products: Product[] = [
    {
      id: '1',
      name: 'Fresh Tomatoes',
      description: 'Locally grown organic tomatoes',
      price: 2.99,
      quantity: 100,
      image_url: 'https://images.unsplash.com/photo-1546470427-1ec6b777bb5e?auto=format&fit=crop&w=400&h=300',
      farmer_id: '1',
      category: 'vegetables',
      created_at: new Date().toISOString(),
    },
    // Add more sample products...
  ];

  const categories = [
    'all',
    'vegetables',
    'fruits',
    'dairy',
    'grains',
    'herbs',
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-green-600 font-medium">
                  {formatUsdAsInr(product.price)}/kg
                </span>
                <button className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;