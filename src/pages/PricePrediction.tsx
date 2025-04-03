import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { cropsData, CropPriceData, getPriceForecast, PricePoint } from '../lib/predictionData';
import { useAuth } from '../lib/AuthContext';
import { formatUsdAsInr } from '../lib/currency';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define custom chart data type
type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    borderDash?: number[];
    yAxisID?: string;
    hidden?: boolean;
  }[];
};

const PricePrediction = () => {
  const { user, profile } = useAuth();
  const isFarmer = profile?.user_type === 'farmer';
  const [selectedCrop, setSelectedCrop] = useState<CropPriceData>(cropsData[0]);
  const [selectedCategory, setSelectedCategory] = useState<'fruit' | 'vegetable' | 'all'>('all');
  const [yieldValue, setYieldValue] = useState<number>(selectedCrop.baseYield);
  const [quality, setQuality] = useState<number>(3);
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [comparePrices, setComparePrices] = useState<boolean>(false);

  // Filter crops by category
  const filteredCrops = selectedCategory === 'all' 
    ? cropsData 
    : cropsData.filter(crop => crop.category === selectedCategory);

  // Update chart when parameters change
  useEffect(() => {
    updateChart();
  }, [selectedCrop, yieldValue, quality, comparePrices]);

  const updateChart = () => {
    // Combine historical data with predictions
    const historicalData = [...selectedCrop.priceHistory];
    const forecastData = getPriceForecast(selectedCrop, yieldValue, quality);
    
    // Prepare label dates for x-axis
    const labels = [...historicalData.map(point => formatDate(point.date)), 
                    ...forecastData.map(point => formatDate(point.date))];
    
    // Historical price data
    const historicalPrices = historicalData.map(point => point.price);
    const historicalYields = historicalData.map(point => point.yield || 0);
    
    // Forecast price data
    const forecastPrices = forecastData.map(point => point.price);
    
    // Prepare baseline forecast (with default yield) for comparison
    const baselineForecast = getPriceForecast(selectedCrop, selectedCrop.baseYield, 3);
    const baselinePrices = baselineForecast.map(point => point.price);
    
    const datasets: {
      label: string;
      data: (number | null)[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      borderDash?: number[];
      yAxisID?: string;
      hidden?: boolean;
    }[] = [
      {
        label: 'Historical Price',
        data: [...historicalPrices, ...Array(forecastData.length).fill(null)],
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 2
      },
      {
        label: 'Predicted Price',
        data: [...Array(historicalData.length).fill(null), ...forecastPrices],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        borderWidth: 2
      }
    ];
    
    // Add comparison dataset if enabled
    if (comparePrices) {
      datasets.push({
        label: 'Baseline Prediction',
        data: [...Array(historicalData.length).fill(null), ...baselinePrices],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderDash: [2, 2],
        borderWidth: 2
      });
    }
    
    // If we're showing yield data for farmers
    if (isFarmer) {
      datasets.push({
        label: 'Historical Yield (kg/acre)',
        data: [...historicalYields, ...Array(forecastData.length).fill(null)],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        yAxisID: 'y1',
        borderWidth: 1,
        hidden: !comparePrices // Only show yield when comparing
      });
    }
    
    setChartData({
      labels,
      datasets
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Handle crop selection
  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const crop = cropsData.find(c => c.id === e.target.value);
    if (crop) {
      setSelectedCrop(crop);
      setYieldValue(crop.baseYield); // Reset yield to base value for new crop
    }
  };

  // Calculate price impact
  const calculatePriceImpact = () => {
    const lastHistorical = selectedCrop.priceHistory[selectedCrop.priceHistory.length - 1].price;
    const firstForecast = getPriceForecast(selectedCrop, yieldValue, quality)[0].price;
    const difference = ((firstForecast - lastHistorical) / lastHistorical * 100).toFixed(1);
    
    return difference;
  };

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Price Forecast for ${selectedCrop.name}`,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Yield')) {
                label += `${context.parsed.y.toFixed(0)} kg/acre`;
              } else {
                label += `${formatUsdAsInr(context.parsed.y)}`;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Price (₹)'
        },
        min: 0,
        // Set a reasonable max based on the data
        max: Math.max(...selectedCrop.priceHistory.map(p => p.price), 
                     ...getPriceForecast(selectedCrop, yieldValue, quality).map(p => p.price)) * 1.5
      },
      y1: {
        type: 'linear' as const,
        display: isFarmer && comparePrices,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Yield (kg/acre)'
        },
        min: 0
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Price Prediction Tool</h1>
        <p className="mt-2 text-gray-600">
          Forecast future prices based on yield, quality, and seasonal factors
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Crop Selection</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 rounded-md ${selectedCategory === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${selectedCategory === 'vegetable' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  onClick={() => setSelectedCategory('vegetable')}
                >
                  Vegetables
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${selectedCategory === 'fruit' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  onClick={() => setSelectedCategory('fruit')}
                >
                  Fruits
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-1">
                Select Crop
              </label>
              <select
                id="crop"
                value={selectedCrop.id}
                onChange={handleCropChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {filteredCrops.map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} (Current: {formatUsdAsInr(crop.currentPrice)})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="compare"
                checked={comparePrices}
                onChange={() => setComparePrices(!comparePrices)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="compare" className="ml-2 block text-sm text-gray-700">
                Compare with baseline prediction
              </label>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Yield & Quality</h2>
            
            <div className="mb-4">
              <label htmlFor="yield" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Yield (kg/acre)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  id="yield"
                  min={selectedCrop.baseYield * 0.5}
                  max={selectedCrop.baseYield * 1.5}
                  step={100}
                  value={yieldValue}
                  onChange={(e) => setYieldValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium w-24 text-right">{yieldValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>Low Yield</span>
                <span>{selectedCrop.baseYield.toLocaleString()}</span>
                <span>High Yield</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
                Product Quality
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  id="quality"
                  min={1}
                  max={5}
                  step={1}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium w-24 text-right">
                  {quality === 1 ? 'Poor' : 
                   quality === 2 ? 'Below Average' : 
                   quality === 3 ? 'Average' : 
                   quality === 4 ? 'Good' : 'Excellent'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>Poor</span>
                <span>Average</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Price Impact Summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Price Impact Analysis</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Predicted price change:</p>
                  <p className={`text-lg font-semibold ${
                    parseFloat(calculatePriceImpact()) > 0 
                      ? 'text-green-600' 
                      : parseFloat(calculatePriceImpact()) < 0 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                  }`}>
                    {calculatePriceImpact()}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current market price:</p>
                  <p className="text-lg font-semibold">{formatUsdAsInr(selectedCrop.currentPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next month's prediction:</p>
                  <p className="text-lg font-semibold">{formatUsdAsInr(getPriceForecast(selectedCrop, yieldValue, quality)[0].price)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-96">
          {chartData && <Line options={chartOptions} data={chartData} />}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <strong>Note:</strong> Price predictions are based on historical trends, seasonality, yield variations, and quality factors. 
            Actual market prices may vary due to unforeseen circumstances.
          </p>
        </div>
      </div>

      {/* Additional Insights for Farmers */}
      {isFarmer && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Farmer Insights</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Yield Impact</h3>
              <p className="text-sm text-gray-600 mb-2">
                For {selectedCrop.name}, a 10% increase in yield typically results in:
              </p>
              <p className="text-xl font-semibold text-red-600">
                {(selectedCrop.yieldImpact * 10).toFixed(1)}% price change
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Quality Premium</h3>
              <p className="text-sm text-gray-600 mb-2">
                Premium for excellent quality vs. average:
              </p>
              <p className="text-xl font-semibold text-green-600">
                +{(selectedCrop.qualityImpact * 100).toFixed(0)}%
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Best Planting Time</h3>
              <p className="text-sm text-gray-600 mb-2">
                To hit peak season prices, consider planting for:
              </p>
              {(() => {
                // Find month with highest seasonality
                const maxSeasonIndex = selectedCrop.seasonality.indexOf(
                  Math.max(...selectedCrop.seasonality)
                );
                const seasonMonths = [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ];
                return (
                  <p className="text-xl font-semibold text-green-600">
                    {seasonMonths[maxSeasonIndex]} harvest
                  </p>
                );
              })()}
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Optimization strategy:</strong> Consider balancing between yield quantity and quality 
              to maximize your returns. For {selectedCrop.name}, the data suggests that 
              {Math.abs(selectedCrop.yieldImpact) > selectedCrop.qualityImpact ? 
                ' focusing on optimal yield management rather than pursuing maximum yields' : 
                ' focusing on quality improvements rather than maximum yield'} 
              may result in better financial outcomes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricePrediction;