-- Migration: Update Currency to Indian Rupees
-- This migration adds currency information to the database

-- Add a currency column to the products table (default INR)
ALTER TABLE products 
ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR';

-- Add a currency column to the market_prices table
ALTER TABLE market_prices
ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR';

-- Add a currency column to the price_history table
ALTER TABLE price_history
ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR';

-- Add a currency column to the orders table
ALTER TABLE orders
ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR';

-- Add a currency column to the order_items table
ALTER TABLE order_items
ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR';

-- Create a function to convert prices from USD to INR
CREATE OR REPLACE FUNCTION convert_usd_to_inr() 
RETURNS TRIGGER AS $$
DECLARE
  exchange_rate DECIMAL := 83.0; -- 1 USD = 83 INR (example rate)
BEGIN
  -- If the product is in USD, convert it to INR
  IF OLD.currency = 'USD' THEN
    NEW.price := OLD.price * exchange_rate;
    NEW.currency := 'INR';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to convert existing USD prices to INR when updated
CREATE TRIGGER convert_product_prices_to_inr
BEFORE UPDATE ON products
FOR EACH ROW
WHEN (OLD.currency = 'USD')
EXECUTE FUNCTION convert_usd_to_inr();

-- Create a trigger to convert existing USD prices to INR in price_history when updated
CREATE TRIGGER convert_price_history_to_inr
BEFORE UPDATE ON price_history
FOR EACH ROW
WHEN (OLD.currency = 'USD')
EXECUTE FUNCTION convert_usd_to_inr();

-- Update existing data to INR (assuming they were in USD)
-- This could be a one-time conversion at a fixed exchange rate
UPDATE products
SET price = price * 83.0, -- 1 USD = 83 INR
    currency = 'INR'
WHERE currency = 'USD' OR currency IS NULL;

UPDATE price_history
SET price = price * 83.0, -- 1 USD = 83 INR
    currency = 'INR'
WHERE currency = 'USD' OR currency IS NULL;

UPDATE market_prices
SET average_price = average_price * 83.0, -- 1 USD = 83 INR
    currency = 'INR'
WHERE currency = 'USD' OR currency IS NULL;

UPDATE order_items
SET price_per_unit = price_per_unit * 83.0, -- 1 USD = 83 INR
    currency = 'INR'
WHERE currency = 'USD' OR currency IS NULL;

UPDATE orders
SET total_amount = total_amount * 83.0, -- 1 USD = 83 INR
    currency = 'INR'
WHERE currency = 'USD' OR currency IS NULL;

-- Add a comment to products table about currency
COMMENT ON COLUMN products.price IS 'Price in Indian Rupees (INR)';
COMMENT ON COLUMN products.currency IS 'Currency code (default: INR)';

-- Add a comment to price_history table about currency
COMMENT ON COLUMN price_history.price IS 'Price in Indian Rupees (INR)';
COMMENT ON COLUMN price_history.currency IS 'Currency code (default: INR)';

-- Add a comment to market_prices table about currency
COMMENT ON COLUMN market_prices.average_price IS 'Price in Indian Rupees (INR)';
COMMENT ON COLUMN market_prices.currency IS 'Currency code (default: INR)';

-- Add a comment to orders table about currency
COMMENT ON COLUMN orders.total_amount IS 'Total amount in Indian Rupees (INR)';
COMMENT ON COLUMN orders.currency IS 'Currency code (default: INR)';

-- Add a comment to order_items table about currency
COMMENT ON COLUMN order_items.price_per_unit IS 'Price per unit in Indian Rupees (INR)';
COMMENT ON COLUMN order_items.currency IS 'Currency code (default: INR)'; 