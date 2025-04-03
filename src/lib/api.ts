import { supabase } from './supabase';
import type { Product, Profile } from '../types';

/**
 * API Client for interacting with the database
 */
export const api = {
  // Profile related functions
  profiles: {
    async getCurrentProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { data: null, error: new Error('Not authenticated') };
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      return { data, error };
    },
    
    async updateProfile(profile: Partial<Profile>) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { data: null, error: new Error('Not authenticated') };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('user_id', user.id)
        .select()
        .single();
        
      return { data, error };
    },
  },
  
  // Product related functions
  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles!inner(full_name)')
        .order('created_at', { ascending: false });
        
      return { data, error };
    },
    
    async getByFarmer(farmerId: string) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });
        
      return { data, error };
    },
    
    async getById(id: string) {
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles!inner(full_name, location, phone)')
        .eq('id', id)
        .single();
        
      return { data, error };
    },
    
    async create(product: Omit<Product, 'id' | 'created_at' | 'farmer_id'>) {
      const { data: profileData } = await api.profiles.getCurrentProfile();
      
      if (!profileData) return { data: null, error: new Error('Profile not found') };
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          farmer_id: profileData.id,
        })
        .select()
        .single();
        
      return { data, error };
    },
    
    async update(id: string, updates: Partial<Product>) {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      return { data, error };
    },
    
    async delete(id: string) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      return { error };
    }
  },
  
  // Order related functions
  orders: {
    async createOrder(
      items: Array<{productId: string, quantity: number, price: number, farmerId: string}>,
      shippingDetails: {
        address: string,
        contactNumber: string
      }
    ) {
      const { data: profileData } = await api.profiles.getCurrentProfile();
      
      if (!profileData) return { data: null, error: new Error('Profile not found') };
      
      // Calculate total
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Start a transaction
      const { data, error } = await supabase.rpc('create_order', {
        p_consumer_id: profileData.id,
        p_status: 'pending',
        p_total_amount: totalAmount,
        p_shipping_address: shippingDetails.address,
        p_contact_number: shippingDetails.contactNumber,
        p_items: items.map(item => ({
          product_id: item.productId,
          farmer_id: item.farmerId,
          quantity: item.quantity,
          price_per_unit: item.price,
        }))
      });
      
      return { data, error };
    },
    
    async getMyOrders() {
      const { data: profileData } = await api.profiles.getCurrentProfile();
      
      if (!profileData) return { data: null, error: new Error('Profile not found') };
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(
              name, 
              image_url,
              category
            )
          )
        `)
        .eq('consumer_id', profileData.id)
        .order('created_at', { ascending: false });
        
      return { data, error };
    },
    
    async getOrdersForFarmer() {
      const { data: profileData } = await api.profiles.getCurrentProfile();
      
      if (!profileData) return { data: null, error: new Error('Profile not found') };
      
      // This query gets order items where the current user is the farmer
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          orders(
            id,
            status,
            shipping_address, 
            contact_number,
            created_at,
            profiles(full_name)
          ),
          products(
            name,
            image_url,
            category
          )
        `)
        .eq('farmer_id', profileData.id)
        .order('created_at', { ascending: false });
        
      return { data, error };
    }
  },
  
  // Price prediction related functions
  pricePrediction: {
    async getHistoricalPrices(productName: string, category: string) {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .eq('product_name', productName)
        .eq('category', category)
        .order('recorded_date', { ascending: true });
        
      return { data, error };
    },
    
    async getProductCategories() {
      // Using a different approach for distinct values
      const { data, error } = await supabase
        .from('market_prices')
        .select('category')
        .order('category');
        
      // Process the data to get unique categories
      const uniqueCategories = data ? 
        [...new Set(data.map(item => item.category))] : 
        [];
        
      return { 
        data: uniqueCategories.map(category => ({ category })), 
        error 
      };
    },
    
    async getProductsByCategory(category: string) {
      // Using a different approach for distinct values
      const { data, error } = await supabase
        .from('market_prices')
        .select('product_name')
        .eq('category', category)
        .order('product_name');
        
      // Process the data to get unique product names
      const uniqueProducts = data ? 
        [...new Set(data.map(item => item.product_name))] : 
        [];
        
      return { 
        data: uniqueProducts.map(product_name => ({ product_name })), 
        error 
      };
    }
  },
  
  // Review related functions
  reviews: {
    async getProductReviews(productId: string) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
        
      return { data, error };
    },
    
    async addReview(productId: string, rating: number, comment: string) {
      const { data: profileData } = await api.profiles.getCurrentProfile();
      
      if (!profileData) return { data: null, error: new Error('Profile not found') };
      
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          consumer_id: profileData.id,
          rating,
          comment
        })
        .select();
        
      return { data, error };
    }
  }
}; 