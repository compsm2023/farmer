// Data structure for crop pricing
export interface CropPriceData {
  id: string;
  name: string;
  category: 'fruit' | 'vegetable';
  currentPrice: number; // Price in INR
  baseYield: number; // kg per acre
  priceHistory: PricePoint[];
  seasonality: number[]; // 0-10 rating for each month (Jan-Dec)
  yieldImpact: number; // % change in price per % change in yield
  qualityImpact: number; // % change in price per quality level
}

export interface PricePoint {
  date: string;
  price: number; // Price in INR
  yield?: number; // kg per acre
}

// Convert USD to INR
const usdToInr = (usdAmount: number): number => {
  // Exchange rate: 1 USD = 83 INR (example rate)
  const exchangeRate = 83.0;
  return parseFloat((usdAmount * exchangeRate).toFixed(2));
};

// Dummy historical data for the past 12 months
const generatePriceHistory = (baseName: string, basePrice: number, volatility: number): PricePoint[] => {
  const now = new Date();
  const history: PricePoint[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const seasonalFactor = 1 + 0.2 * Math.sin((date.getMonth() + 1) * Math.PI / 6);
    
    // Add small yield variations too
    const yieldVariation = 1 + (Math.random() * 0.3 - 0.15);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: usdToInr(parseFloat((basePrice * randomFactor * seasonalFactor).toFixed(2))),
      yield: Math.round(getBaseYieldForCrop(baseName) * yieldVariation)
    });
  }
  
  return history;
};

// Get base yield for a crop
const getBaseYieldForCrop = (name: string): number => {
  const lookup: Record<string, number> = {
    'Tomatoes': 40000,
    'Potatoes': 25000,
    'Lettuce': 30000,
    'Carrots': 35000,
    'Spinach': 15000,
    'Onions': 45000,
    'Apples': 20000,
    'Oranges': 25000,
    'Strawberries': 15000,
    'Grapes': 12000,
    'Bananas': 35000,
    'Mangoes': 18000
  };
  
  return lookup[name] || 25000;
};

// Dummy dataset for fruits and vegetables
export const cropsData: CropPriceData[] = [
  {
    id: '1',
    name: 'Tomatoes',
    category: 'vegetable',
    currentPrice: usdToInr(2.99),
    baseYield: 40000,
    priceHistory: generatePriceHistory('Tomatoes', 2.99, 0.2),
    seasonality: [3, 3, 4, 5, 7, 9, 10, 9, 7, 5, 4, 3], // Peak in summer
    yieldImpact: -0.8, // Elastic: higher yield decreases price
    qualityImpact: 0.3 // 30% price premium for high quality
  },
  {
    id: '2',
    name: 'Potatoes',
    category: 'vegetable',
    currentPrice: usdToInr(0.99),
    baseYield: 25000,
    priceHistory: generatePriceHistory('Potatoes', 0.99, 0.1),
    seasonality: [8, 7, 6, 5, 4, 4, 5, 6, 7, 8, 9, 9], // More stable, peak in winter
    yieldImpact: -0.4, // Less elastic
    qualityImpact: 0.2
  },
  {
    id: '3',
    name: 'Lettuce',
    category: 'vegetable',
    currentPrice: usdToInr(1.79),
    baseYield: 30000,
    priceHistory: generatePriceHistory('Lettuce', 1.79, 0.25),
    seasonality: [6, 7, 8, 9, 10, 9, 8, 8, 7, 6, 5, 5], // Spring/early summer peak
    yieldImpact: -0.7,
    qualityImpact: 0.4
  },
  {
    id: '4',
    name: 'Carrots',
    category: 'vegetable',
    currentPrice: usdToInr(1.29),
    baseYield: 35000,
    priceHistory: generatePriceHistory('Carrots', 1.29, 0.15),
    seasonality: [7, 8, 8, 7, 6, 5, 4, 5, 6, 7, 8, 8], // Better in cooler weather
    yieldImpact: -0.5,
    qualityImpact: 0.25
  },
  {
    id: '5',
    name: 'Spinach',
    category: 'vegetable',
    currentPrice: usdToInr(2.49),
    baseYield: 15000,
    priceHistory: generatePriceHistory('Spinach', 2.49, 0.2),
    seasonality: [6, 7, 8, 9, 8, 6, 4, 5, 7, 8, 7, 6], // Spring and fall peaks
    yieldImpact: -0.6,
    qualityImpact: 0.35
  },
  {
    id: '6',
    name: 'Onions',
    category: 'vegetable',
    currentPrice: usdToInr(0.89),
    baseYield: 45000,
    priceHistory: generatePriceHistory('Onions', 0.89, 0.1),
    seasonality: [6, 6, 7, 7, 8, 9, 8, 7, 6, 5, 5, 6], // Fairly consistent
    yieldImpact: -0.3,
    qualityImpact: 0.15
  },
  {
    id: '7',
    name: 'Apples',
    category: 'fruit',
    currentPrice: usdToInr(1.99),
    baseYield: 20000,
    priceHistory: generatePriceHistory('Apples', 1.99, 0.15),
    seasonality: [4, 3, 3, 3, 4, 5, 6, 7, 9, 10, 8, 6], // Fall harvest peak
    yieldImpact: -0.6,
    qualityImpact: 0.4
  },
  {
    id: '8',
    name: 'Oranges',
    category: 'fruit',
    currentPrice: usdToInr(1.49),
    baseYield: 25000,
    priceHistory: generatePriceHistory('Oranges', 1.49, 0.2),
    seasonality: [9, 10, 8, 7, 5, 4, 3, 3, 4, 5, 7, 8], // Winter peak
    yieldImpact: -0.5,
    qualityImpact: 0.3
  },
  {
    id: '9',
    name: 'Strawberries',
    category: 'fruit',
    currentPrice: usdToInr(3.99),
    baseYield: 15000,
    priceHistory: generatePriceHistory('Strawberries', 3.99, 0.3),
    seasonality: [3, 3, 4, 6, 9, 10, 8, 6, 4, 3, 3, 3], // Late spring/early summer peak
    yieldImpact: -0.9, // Very elastic
    qualityImpact: 0.5
  },
  {
    id: '10',
    name: 'Grapes',
    category: 'fruit',
    currentPrice: usdToInr(2.99),
    baseYield: 12000,
    priceHistory: generatePriceHistory('Grapes', 2.99, 0.2),
    seasonality: [3, 3, 3, 4, 5, 6, 7, 9, 10, 8, 5, 3], // Late summer/early fall peak
    yieldImpact: -0.7,
    qualityImpact: 0.4
  },
  {
    id: '11',
    name: 'Bananas',
    category: 'fruit',
    currentPrice: usdToInr(0.69),
    baseYield: 35000,
    priceHistory: generatePriceHistory('Bananas', 0.69, 0.1),
    seasonality: [7, 7, 7, 7, 7, 8, 8, 8, 8, 7, 7, 7], // Year-round, slight summer increase
    yieldImpact: -0.4,
    qualityImpact: 0.2
  },
  {
    id: '12',
    name: 'Mangoes',
    category: 'fruit',
    currentPrice: usdToInr(2.49),
    baseYield: 18000,
    priceHistory: generatePriceHistory('Mangoes', 2.49, 0.25),
    seasonality: [3, 3, 4, 5, 7, 9, 10, 8, 6, 4, 3, 3], // Summer peak
    yieldImpact: -0.6,
    qualityImpact: 0.35
  }
];

// Predict future price based on yield, quality, and seasonality
export const predictPrice = (
  crop: CropPriceData, 
  yieldPerAcre: number, 
  quality: number, // 1-5 scale
  month: number // 0-11 for Jan-Dec
): number => {
  // Base price
  const basePrice = crop.currentPrice;
  
  // Yield impact (inverse relationship)
  const yieldDiff = (yieldPerAcre - crop.baseYield) / crop.baseYield;
  const yieldEffect = 1 + (yieldDiff * crop.yieldImpact);
  
  // Quality impact (1-5 scale, 3 is average)
  const qualityEffect = 1 + ((quality - 3) / 2 * crop.qualityImpact);
  
  // Seasonality impact (0-10 scale)
  const seasonalFactor = 0.8 + (crop.seasonality[month] / 10 * 0.4); // 0.8-1.2 range
  
  // Calculate predicted price
  const predictedPrice = basePrice * yieldEffect * qualityEffect * seasonalFactor;
  
  // Ensure price doesn't go below minimum threshold
  return Math.max(predictedPrice, basePrice * 0.5);
};

// Get the next 6 months of predictions
export const getPriceForecast = (
  crop: CropPriceData,
  yieldPerAcre: number,
  quality: number
): PricePoint[] => {
  const forecast: PricePoint[] = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  
  for (let i = 0; i < 6; i++) {
    const forecastMonth = (currentMonth + i) % 12;
    const forecastDate = new Date(now.getFullYear(), currentMonth + i, 1);
    
    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      price: parseFloat(predictPrice(crop, yieldPerAcre, quality, forecastMonth).toFixed(2)),
      yield: yieldPerAcre
    });
  }
  
  return forecast;
}; 