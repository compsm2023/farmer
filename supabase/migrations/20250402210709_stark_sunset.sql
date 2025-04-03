/*
  # Authentication and User Management Tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `location` (text)
      - `user_type` (text) - either 'farmer' or 'consumer'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `farmer_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `quantity` (numeric)
      - `category` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `price_history`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `price` (numeric)
      - `date` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    full_name text,
    phone text,
    location text,
    user_type text CHECK (user_type IN ('farmer', 'consumer')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Create products table
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id uuid REFERENCES public.profiles NOT NULL,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    quantity numeric NOT NULL,
    category text NOT NULL,
    image_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create price history table
CREATE TABLE public.price_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products NOT NULL,
    price numeric NOT NULL,
    date timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view products"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Farmers can insert their own products"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (farmer_id IN (
        SELECT id FROM public.profiles 
        WHERE user_id = auth.uid() AND user_type = 'farmer'
    ));

CREATE POLICY "Farmers can update their own products"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (farmer_id IN (
        SELECT id FROM public.profiles 
        WHERE user_id = auth.uid() AND user_type = 'farmer'
    ));

CREATE POLICY "Anyone can view price history"
    ON public.price_history
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a sample farmer profile first
INSERT INTO public.profiles (id, user_id, full_name, phone, location, user_type)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'Sample Farmer',
    '+91-1234567890',
    'Maharashtra, India',
    'farmer'
);

-- Insert sample products using the sample farmer's profile ID
INSERT INTO public.products (id, farmer_id, name, description, price, quantity, category, image_url)
VALUES 
    ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Tomatoes', 'Fresh organic tomatoes', 40.00, 100, 'vegetables', 'https://images.unsplash.com/photo-1546470427-1ec6b777bb5e'),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Apples', 'Crisp red apples', 80.00, 150, 'fruits', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'),
    ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Potatoes', 'Fresh potatoes', 30.00, 200, 'vegetables', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655');

-- Insert sample price history
INSERT INTO public.price_history (product_id, price, date)
SELECT 
    '22222222-2222-2222-2222-222222222222',
    35 + (random() * 10)::numeric(10,2),
    generate_series(
        current_date - interval '30 days',
        current_date,
        interval '1 day'
    );