import React, { useState, useEffect } from 'react';
import { Plus, Trash, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { formatUsdAsInr } from '../lib/currency';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  description: string;
  image_url?: string;
  farmer_id: string;
  created_at: string;
}

const FarmerDashboard = () => {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // For adding new product
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: 0,
    price: 0,
    category: 'vegetable',
    description: '',
    image_url: ''
  });
  
  // For editing product
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  // Load products on mount
  useEffect(() => {
    if (profile?.id) {
      fetchProducts();
    }
  }, [profile]);

  // Fetch farmer's products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', profile?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change for new product
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle input change for editing product
  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  // Add new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate inputs
      if (!newProduct.name || newProduct.price <= 0 || newProduct.quantity <= 0) {
        setError('Please fill all required fields with valid values.');
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          farmer_id: profile?.id,
          name: newProduct.name,
          price: newProduct.price,
          quantity: newProduct.quantity,
          category: newProduct.category,
          description: newProduct.description || '',
          image_url: newProduct.image_url || ''
        })
        .select();
      
      if (error) throw error;
      
      // Reset form and add to products list
      setProducts([data[0], ...products]);
      setNewProduct({
        name: '',
        quantity: 0,
        price: 0,
        category: 'vegetable',
        description: '',
        image_url: ''
      });
      setIsAddingProduct(false);
      setSuccessMessage('Product added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing product
  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProduct({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      description: product.description
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditingProduct({});
  };

  // Save edited product
  const handleSaveEdit = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          price: editingProduct.price,
          quantity: editingProduct.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);
      
      if (error) throw error;
      
      // Update product in local state
      setProducts(products.map(p => p.id === productId ? { ...p, ...editingProduct } : p));
      setEditingProductId(null);
      setEditingProduct({});
      setSuccessMessage('Product updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        setError(null);
        
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        
        if (error) throw error;
        
        // Remove product from local state
        setProducts(products.filter(p => p.id !== productId));
        setSuccessMessage('Product deleted successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user || !profile || profile.user_type !== 'farmer') {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Access Denied</p>
          <p>This page is only available to farmers. Please log in as a farmer to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAddingProduct(!isAddingProduct)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {isAddingProduct ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {isAddingProduct ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Add Product Form */}
      {isAddingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={newProduct.name}
                onChange={handleNewProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="vegetable">Vegetable</option>
                <option value="fruit">Fruit</option>
                <option value="grain">Grain</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price per Unit (₹) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={handleNewProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Available *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={newProduct.quantity}
                onChange={handleNewProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                id="image_url"
                name="image_url"
                type="url"
                value={newProduct.image_url}
                onChange={handleNewProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {isLoading && products.length === 0 ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600">You haven't added any products yet.</p>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProductId === product.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editingProduct.name || ''}
                          onChange={handleEditProductChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProductId === product.id ? (
                        <input
                          type="number"
                          name="quantity"
                          value={editingProduct.quantity || 0}
                          onChange={handleEditProductChange}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                          min="0"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{product.quantity}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProductId === product.id ? (
                        <input
                          type="number"
                          name="price"
                          value={editingProduct.price || 0}
                          onChange={handleEditProductChange}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{formatUsdAsInr(product.price)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingProductId === product.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(product.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStartEdit(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard; 