/**
 * Currency Utility Functions
 * Provides helper functions for formatting and converting currency values
 */

/**
 * Format a number as Indian Rupees (₹)
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted string with ₹ symbol
 */
export const formatIndianRupees = (amount: number, options?: {
  decimals?: number;
  showSymbol?: boolean;
}) => {
  const decimals = options?.decimals !== undefined ? options.decimals : 2;
  const showSymbol = options?.showSymbol !== undefined ? options.showSymbol : true;
  
  // Format with Indian number system (lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  const formatted = formatter.format(amount);
  
  // Return with or without the ₹ symbol based on options
  return showSymbol ? formatted : formatted.replace('₹', '').trim();
};

/**
 * Convert USD to INR (for demo purposes)
 * In a real app, this would call an exchange rate API
 * @param usdAmount - Amount in USD
 * @returns Amount in INR
 */
export const usdToInr = (usdAmount: number) => {
  // Using a fixed exchange rate for demonstration
  // In production, use a real-time exchange rate API
  const exchangeRate = 83.0; // 1 USD = 83 INR (example rate)
  return usdAmount * exchangeRate;
};

/**
 * Format a USD amount as Indian Rupees
 * Combines conversion and formatting in one step
 * @param usdAmount - Amount in USD
 * @param options - Formatting options
 * @returns Formatted string in INR
 */
export const formatUsdAsInr = (usdAmount: number, options?: {
  decimals?: number;
  showSymbol?: boolean;
}) => {
  const inrAmount = usdToInr(usdAmount);
  return formatIndianRupees(inrAmount, options);
}; 