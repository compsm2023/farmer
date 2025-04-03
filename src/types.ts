export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url: string;
  farmer_id: string;
  category: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  location: string;
  user_type: 'farmer' | 'consumer';
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  price: number;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  location?: string;
  user_type?: 'farmer' | 'consumer';
}