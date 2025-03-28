import React, { useState, useEffect } from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ToggleBar from './ToggleBar';
  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface MessageTypeDistributionProps {
  title: string;
}

// Define proper types for your filter options
type PeriodType = 'Daily' | 'Weekly' | 'Monthly';
type DirectionType = 'All' | 'Inward' | 'Outward';

// Type for the mock data structure
type MockDataType = {
  [key in PeriodType]: {
    [key in DirectionType]: number[];
  };
};

const MessageTypeDistribution: React.FC<MessageTypeDistributionProps> = ({ title }) => {
  const [period, setPeriod] = useState<PeriodType>('Weekly');
  const [direction, setDirection] = useState<DirectionType>('All');
  const [chartData, setChartData] = useState<any>(null);

  // Mock data with proper typing
  const mockData: MockDataType = {
    Daily: {
      All: [450, 320, 280, 190, 200, 150, 100],
      Inward: [250, 180, 150, 100, 120, 80, 60],
      Outward: [200, 140, 130, 90, 80, 70, 40]
    },
    Weekly: {
      All: [1800, 1250, 1100, 950, 800, 600, 450],
      Inward: [1000, 750, 600, 500, 400, 350, 250],
      Outward: [800, 500, 500, 450, 400, 250, 200]
    },
    Monthly: {
      All: [5400, 4800, 3900, 3300, 2700, 2100, 1800],
      Inward: [3000, 2800, 2200, 1800, 1500, 1200, 1000],
      Outward: [2400, 2000, 1700, 1500, 1200, 900, 800]
    }
  };

  // Handle period toggle with proper typing
  const handlePeriodToggle = (option: PeriodType) => {
    setPeriod(option);
  };

  // Handle direction toggle with proper typing
  const handleDirectionToggle = (option: DirectionType) => {
    setDirection(option);
  };

  // Update chart data when period or direction changes
  useEffect(() => {
    setChartData({
      labels: ['MT103', 'MT202', 'MT940', 'MT900', 'MT910', 'MT700', 'MT760'],
      datasets: [
        {
          label: 'Messages',
          data: mockData[period][direction],
          backgroundColor: ['#000000', '#52524f', '#041345', '#89cafa', '#ff2129', '#f55302', '#ebd321'],
          borderRadius: 6, // Add rounded corners to bars
          borderSkipped: false, // Ensure all sides get the radius applied
          borderWidth: 0,
        },
      ],
    });
  }, [period, direction]);

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.7, // Controls the width of the bar (0 to 1)
    categoryPercentage: 0.7,
    scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false, // Hides the x-axis line
          },
        },
        y: {
          grid: {
            display: false,
          },
          border: {
            display: false, // Hides the y-axis line
          },
        },
      },
  };

  return (
    <div className="chart-component">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div>
        <div className="chart-container type-distribution">
            {chartData && <Bar data={chartData} options={options} />}
        </div>
        <div className="toggle-footer-bar type-distribution">
                <ToggleBar
                    options={['Daily', 'Weekly', 'Monthly']}
                    activeOption={period}
                    onToggle={handlePeriodToggle as (option: string) => void}
                />
                <ToggleBar
                    options={['All', 'Inward', 'Outward']}
                    activeOption={direction}
                    onToggle={handleDirectionToggle as (option: string) => void}
                />
        </div>
      </div>
    </div>
  );
};

export default MessageTypeDistribution;