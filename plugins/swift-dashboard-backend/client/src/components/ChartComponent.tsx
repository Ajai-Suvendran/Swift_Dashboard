import React, { useState, useMemo, ReactElement } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {dummyData} from '../data/weeklytrendData';
import ToggleBar from './ToggleBar';

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface ChartComponentProps {
  type: 'pie' | 'bar' | 'summary';
}

// Create a new component to display counts
const MessageCounts: React.FC<{
    successCount: number;
    failCount: number;
  }> = ({ successCount, failCount }) => {
    const totalCount = successCount + failCount;
    const successPercentage = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
    const failPercentage = totalCount > 0 ? Math.round((failCount / totalCount) * 100) : 0;
    
    return (
      <div className="message-counts">
        <div className="count-item total">
          <div className="count-header">
            <span className="count-name total">Total Messages</span>
          </div>
          <div className="count-value total">{totalCount}</div>
          <div className="count-percentage total">100%</div>
        </div>
        <div className="counts-row">
          <div className="count-item success">
            <div className="count-header">
              <div className="count-indicator success"></div>
              <span className="count-name">Successful</span>
            </div>
            <div className="count-value">{successCount}</div>
            <div className="count-percentage">{successPercentage}%</div>
          </div>
          <div className="count-item fail">
            <div className="count-header">
              <div className="count-indicator fail"></div>
              <span className="count-name">Failure</span>
            </div>
            <div className="count-value">{failCount}</div>
            <div className="count-percentage">{failPercentage}%</div>
          </div>
        </div>
      </div>
    );
};

const ChartComponent = ({type}: ChartComponentProps): ReactElement[] => {
  const [directionFilter, setDirectionFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Weekly');

  // Function to aggregate data based on filters
  const aggregateData = (
    timeFilter: string,
    directionFilter: string
  ): {
    successCount: number;
    failCount: number;
    timeLabels: string[];
    inwardData: number[];
    outwardData: number[];
  } => {
    const month = dummyData[0]; // We're using the first month only
    
    // For Daily view
    if (timeFilter === 'Daily') {
      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      // Showing first week data for simplicity
      const week = month.weeks[0];

      const inwardSuccess = week.days.map(day => day.inward.success);
      const inwardFail = week.days.map(day => day.inward.fail);
      const outwardSuccess = week.days.map(day => day.outward.success);
      const outwardFail = week.days.map(day => day.outward.fail);

      if (directionFilter === 'All') {
        return {
          successCount: week.days.reduce((sum, day) => sum + day.inward.success + day.outward.success, 0),
          failCount: week.days.reduce((sum, day) => sum + day.inward.fail + day.outward.fail, 0),
          timeLabels: dayLabels,
          inwardData: inwardSuccess.map((s, i) => s + inwardFail[i]),
          outwardData: outwardSuccess.map((s, i) => s + outwardFail[i])
        };
      } else if (directionFilter === 'Inward') {
        return {
          successCount: week.days.reduce((sum, day) => sum + day.inward.success, 0),
          failCount: week.days.reduce((sum, day) => sum + day.inward.fail, 0),
          timeLabels: dayLabels,
          inwardData: inwardSuccess.map((s, i) => s + inwardFail[i]),
          outwardData: [0]
        };
      } else {
        return {
          successCount: week.days.reduce((sum, day) => sum + day.outward.success, 0),
          failCount: week.days.reduce((sum, day) => sum + day.outward.fail, 0),
          timeLabels: dayLabels,
          inwardData: [0],
          outwardData: outwardSuccess.map((s, i) => s + outwardFail[i])
        };
      }
    }
    
    // For Weekly view
    else if (timeFilter === 'Weekly') {
      const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      
      // Calculate weekly totals
      const weeklyData = month.weeks.map(week => {
        const inwardSuccess = week.days.reduce((sum, day) => sum + day.inward.success, 0);
        const inwardFail = week.days.reduce((sum, day) => sum + day.inward.fail, 0);
        const outwardSuccess = week.days.reduce((sum, day) => sum + day.outward.success, 0);
        const outwardFail = week.days.reduce((sum, day) => sum + day.outward.fail, 0);
        
        return {
          inward: { success: inwardSuccess, fail: inwardFail },
          outward: { success: outwardSuccess, fail: outwardFail }
        };
      });

      if (directionFilter === 'All') {
        return {
          successCount: weeklyData.reduce((sum, week) => sum + week.inward.success + week.outward.success, 0),
          failCount: weeklyData.reduce((sum, week) => sum + week.inward.fail + week.outward.fail, 0),
          timeLabels: weekLabels,
          inwardData: weeklyData.map(week => week.inward.success + week.inward.fail),
          outwardData: weeklyData.map(week => week.outward.success + week.outward.fail)
        };
      } else if (directionFilter === 'Inward') {
        return {
          successCount: weeklyData.reduce((sum, week) => sum + week.inward.success, 0),
          failCount: weeklyData.reduce((sum, week) => sum + week.inward.fail, 0),
          timeLabels: weekLabels,
          inwardData: weeklyData.map(week => week.inward.success + week.inward.fail),
          outwardData: [0]
        };
      } else {
        return {
          successCount: weeklyData.reduce((sum, week) => sum + week.outward.success, 0),
          failCount: weeklyData.reduce((sum, week) => sum + week.outward.fail, 0),
          timeLabels: weekLabels,
          inwardData: [0],
          outwardData: weeklyData.map(week => week.outward.success + week.outward.fail)
        };
      }
    }
    
    // For Monthly view
    else {
      const monthLabels = ['January', 'February', 'March', 'April'];
      
      // Calculate the total for the month
      const totalInwardSuccess = month.weeks.reduce(
        (sum, week) => sum + week.days.reduce((daySum, day) => daySum + day.inward.success, 0), 0
      );
      const totalInwardFail = month.weeks.reduce(
        (sum, week) => sum + week.days.reduce((daySum, day) => daySum + day.inward.fail, 0), 0
      );
      const totalOutwardSuccess = month.weeks.reduce(
        (sum, week) => sum + week.days.reduce((daySum, day) => daySum + day.outward.success, 0), 0
      );
      const totalOutwardFail = month.weeks.reduce(
        (sum, week) => sum + week.days.reduce((daySum, day) => daySum + day.outward.fail, 0), 0
      );
      
      // Since we only have one month of data, we'll simulate 4 months by scaling
      const monthlyData = [
        {
          inward: { success: totalInwardSuccess, fail: totalInwardFail },
          outward: { success: totalOutwardSuccess, fail: totalOutwardFail }
        },
        {
          inward: { success: Math.round(totalInwardSuccess * 1.1), fail: Math.round(totalInwardFail * 0.9) },
          outward: { success: Math.round(totalOutwardSuccess * 1.2), fail: Math.round(totalOutwardFail * 1.1) }
        },
        {
          inward: { success: Math.round(totalInwardSuccess * 0.9), fail: Math.round(totalInwardFail * 1.2) },
          outward: { success: Math.round(totalOutwardSuccess * 0.8), fail: Math.round(totalOutwardFail * 1.3) }
        },
        {
          inward: { success: Math.round(totalInwardSuccess * 1.3), fail: Math.round(totalInwardFail * 0.8) },
          outward: { success: Math.round(totalOutwardSuccess * 1.1), fail: Math.round(totalOutwardFail * 0.9) }
        }
      ];

      if (directionFilter === 'All') {
        return {
          successCount: monthlyData.reduce((sum, month) => sum + month.inward.success + month.outward.success, 0),
          failCount: monthlyData.reduce((sum, month) => sum + month.inward.fail + month.outward.fail, 0),
          timeLabels: monthLabels,
          inwardData: monthlyData.map(month => month.inward.success + month.inward.fail),
          outwardData: monthlyData.map(month => month.outward.success + month.outward.fail)
        };
      } else if (directionFilter === 'Inward') {
        return {
          successCount: monthlyData.reduce((sum, month) => sum + month.inward.success, 0),
          failCount: monthlyData.reduce((sum, month) => sum + month.inward.fail, 0),
          timeLabels: monthLabels,
          inwardData: monthlyData.map(month => month.inward.success + month.inward.fail),
          outwardData: [0]
        };
      } else {
        return {
          successCount: monthlyData.reduce((sum, month) => sum + month.outward.success, 0),
          failCount: monthlyData.reduce((sum, month) => sum + month.outward.fail, 0),
          timeLabels: monthLabels,
          inwardData: [0],
          outwardData: monthlyData.map(month => month.outward.success + month.outward.fail)
        };
      }
    }
  };

  // Generate chart data based on filters
  const generateData = () => {
    const data = aggregateData(timeFilter, directionFilter);

    if (type === 'pie') {
        return {
          labels: ['Successful', 'Failure      '],
          datasets: [
            {
              label: 'Messages',
              data: [data.successCount, data.failCount],
              backgroundColor: ['#22C55E', '#EF4444'],
            },
          ],
        };
      } else {
      // Bar chart
      const datasets = [];
      
      if (directionFilter === 'All' || directionFilter === 'Inward') {
        datasets.push({
          label: 'Inward',
          data: data.inwardData,
          borderRadius: 3,
          backgroundColor: '#52524f',
        });
      }
      
      if (directionFilter === 'All' || directionFilter === 'Outward') {
        datasets.push({
          label: 'Outward',
          data: data.outwardData,
          borderRadius: 3,
          backgroundColor: '#f55302',
        });
      }
      
      return {
        labels: data.timeLabels,
        datasets: datasets
      };
    }
  };

  const chartData = generateData();
  const aggregatedData = aggregateData(timeFilter, directionFilter);
  const inwardPercentage = aggregatedData.inwardData[0] > 0 ? Math.round((aggregatedData.inwardData[0] / (aggregatedData.inwardData[0] + aggregatedData.outwardData[0])) * 100) : 0
  const outwardPercentage = aggregatedData.outwardData[0] > 0 ? Math.round((aggregatedData.outwardData[0] / (aggregatedData.inwardData[0] + aggregatedData.outwardData[0])) * 100) : 0

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  const pieChart = <div className="chart-component">
  <div className="chart-header">
    <h3>Messages By Completion</h3>
  </div>
  <div>
    <div className="donut-chart-layout">
      <div className="donut-chart-container">
        <Doughnut data={chartData} options={options} />
      </div>
      <MessageCounts 
        successCount={aggregatedData.successCount}
        failCount={aggregatedData.failCount}
      />
    </div>
    <div className="toggle-footer-pie">
      <ToggleBar
        options={['Daily', 'Weekly', 'Monthly']}
        activeOption={timeFilter}
        onToggle={setTimeFilter}
      />
      <ToggleBar
        options={['All', 'Inward', 'Outward']}
        activeOption={directionFilter}
        onToggle={setDirectionFilter}
      />
    </div>
  </div>
</div>;

const barChart = <div className="chart-component">
<div className="chart-header">
  <h3>Messages Trend</h3>
</div>
<div>
  <div className="chart-container">
    <Bar data={chartData} options={options} />
  </div>
  <div className="toggle-footer-bar">
    <ToggleBar
      options={['Daily', 'Weekly', 'Monthly']}
      activeOption={timeFilter}
      onToggle={setTimeFilter}
    />
    <ToggleBar
      options={['All', 'Inward', 'Outward']}
      activeOption={directionFilter}
      onToggle={setDirectionFilter}
    />
  </div>
</div>
</div>;
const summaryChart = <div className="chart-component">
<div className="chart-header">
  <h3>Messages Trend Summary</h3>
</div>
<div className="message-trend-content">
  <div className="message-stat-grid">
    <div className="stat-card total">
      <div className="stat-value">{aggregatedData.inwardData[0] + aggregatedData.outwardData[0]}</div>
      <div className="stat-label">Total Messages</div>
    </div>
    <div className="stat-card inward">
      <div className="stat-value">{aggregatedData.inwardData[0]}</div>
      <div className="stat-label">Inward ({inwardPercentage}%)</div>
    </div>
    <div className="stat-card outward">
      <div className="stat-value">{aggregatedData.outwardData[0]}</div>
      <div className="stat-label">Outward ({outwardPercentage}%)</div>
    </div>
  </div>
</div>
</div>;
  return (
    type === 'pie' ? [pieChart] : [barChart, summaryChart]
  );
};

export default ChartComponent;
