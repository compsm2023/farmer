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

CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

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

CREATE POLICY "Farmers can insert price history for their products"
    ON public.price_history
    FOR INSERT
    TO authenticated
    WITH CHECK (product_id IN (
        SELECT p.id FROM public.products p
        JOIN public.profiles pr ON p.farmer_id = pr.id
        WHERE pr.user_id = auth.uid() AND pr.user_type = 'farmer'
    ));