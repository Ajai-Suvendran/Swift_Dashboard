import React, { useState, useEffect } from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './MessageTypeDistribution.scss';
import apiService from '../../../services';
  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface MessageTypeDistributionProps {
  title: string;
  period: PeriodType;
  direction: DirectionType;
}

// Define proper types for your filter options
type PeriodType = 'Daily' | 'Weekly' | 'Monthly';
type DirectionType = 'All' | 'Inward' | 'Outward';

// Interface for message type data returned from API
interface MessageTypeData {
  type: string;
  count: number;
  successful?: number;
  failed?: number;
  successRate?: number;
}

// Interface for API response
interface ApiResponse {
  timeFilter: string;
  direction: string;
  period: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  monthName?: string;
  messageTypes: MessageTypeData[];
}

const MessageTypeDistribution: React.FC<MessageTypeDistributionProps> = ({ title, period, direction }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  // Function to map our UI filter to API parameter
  const getApiTimefilter = (periodType: PeriodType): 'daily' | 'weekly' | 'monthly' => {
    switch (periodType.toLowerCase()) {
      case 'daily': return 'daily';
      case 'weekly': return 'weekly';
      default: return 'monthly';
    }
  };

  // Function to map our UI direction to API parameter
  const getApiDirection = (directionType: DirectionType): 'inward' | 'outward' | undefined => {
    if (directionType.toLowerCase() === 'inward') return 'inward';
    if (directionType.toLowerCase() === 'outward') return 'outward';
    return undefined; // For 'All'
  };

  // Generate more descriptive title based on response data
  const getDetailedTitle = (): string => {
    if (!responseData) return '';

    let timeFrame = '';
    if (responseData.period === 'day') {
      timeFrame = `Today (${responseData.date})`;
    } else if (responseData.period === 'week') {
      timeFrame = `Current Week (${responseData.startDate} to ${responseData.endDate})`;
    } else {
      timeFrame = `${responseData.monthName} (${responseData.startDate} to ${responseData.endDate})`;
    }
    
    return `${timeFrame}`;
  };

  const allColor = '#6c6c6b'; // grey
  const inwardColor = '#52524f'; // dark grey
  const outwardColor = '#868686'; // light grey
  let generalColors: string;

  // Generate appropriate color scheme for the chart
  if (direction === 'All') {
    generalColors = allColor;
  } else if (direction === 'Inward') {
    generalColors = inwardColor;
  } else {
    generalColors = outwardColor;
  }

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Convert UI filters to API parameters
        const timeFilter = getApiTimefilter(period);
        const directionParam = getApiDirection(direction);
        
        // Make API request using apiService
        const response = await apiService.getTopMessageTypes(
          timeFilter,
          directionParam,
          7,
          true
        );
        
        // Store response data
        setResponseData(response);
        
        // Transform API data for chart
        const messageTypes = response.messageTypes;
        
        if (messageTypes.length === 0) {
          setChartData(null);
        } else {
          setChartData({
            labels: messageTypes.map(item => item.type),
            datasets: [
              {
                label: direction === 'All' ? 'Messages' : `${direction} Messages`,
                data: messageTypes.map(item => item.count),
                backgroundColor: generalColors,
                borderRadius: 6,
                borderSkipped: false,
                borderWidth: 0,
              },
            ],
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching message type distribution:', err);
        setError('Failed to load message type data. Please try again later.');
        
        // Clear chart data on error
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, direction]);

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.7,
    categoryPercentage: 0.7,
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Count',
          color: '#000000'
        },
        ticks: {
          precision: 0,
          stepSize: 1,
          callback: function(value: any) {
            if (Math.floor(value) === value) {
              return value;
            }
          }
        },
      },
      y: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Message Type',
          color: '#000000'
        }
      },
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            return `Message Type: ${context[0].label}`;
          },
          label: function(context: any) {
            return `Count: ${context.raw}`;
          },
          afterLabel: function(context: any) {
            const index = context.dataIndex;
            const item = responseData?.messageTypes[index];
            if (item && item.successful !== undefined && item.failed !== undefined) {
              return [
                `Success: ${item.successful} (${item.successRate}%)`,
                `Failed: ${item.failed}`
              ];
            }
            return '';
          }
        }
      }
    }
  };

  return (
    <div className="chart-component type-distribution">
      <div className="chart-header type-distribution">
        <h3>{title}</h3>
        <div className="chart-info-icon distribution" data-tooltip="Shows the top 7 most frequent SWIFT MT message types based on your selected time period and direction filters. The horizontal bars represent message volume, with detailed success and failure statistics available on hover.">
          <span className="info-icon">i</span>
        </div>
      </div>
      <div>
        <div className="chart-container type-distribution">
          {loading ? (
            <div className='loading-indicator'>
              <div className='spinner'></div>
              <span>Loading message type data...</span>
            </div>
          ) : error ? (
            <div className='error-message'>
              <span>{error}</span>
              <button onClick={() => {
                window.location.reload();
              }}>Retry</button>
            </div>
          ) : chartData && chartData.labels.length > 0 ? (
            <Bar data={chartData} options={options} />
          ) : (
            <div className='no-data-message'>
              <span>No message types found for selected filters</span>
            </div>
          )}
          <div className="toggle-footer-bar type-distribution">
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTypeDistribution;