import React from 'react';
import ChartComponent from './ChartComponent';
import SummaryComponent from './SummaryComponent';
import MessageTypeDistribution from './MessageTypeDistribution';
import RecentActivity from './RecentActivity';
import useWindowSize from '../hooks/useWindowSize';

const OverviewPage: React.FC = () => {
  const { width, height } = useWindowSize();

  const messageCompletion = ChartComponent({ type: "pie"})[0];
  const translationErrors = ChartComponent({ type: "bar"});
  const messageTrend = translationErrors[0];
  const summary = translationErrors[1];

  return (
    <div className="overview-page">
      <div className="dashboard-row">
        <div className="dashboard-column completion">
          {messageCompletion}
        </div>
        <div className="dashboard-column completion">
          <SummaryComponent title="Translation Errors" />
        </div>
        <div className="dashboard-column trend">
          {messageTrend}
        </div>
      </div>
      
      <div className="dashboard-row">
        <div className="dashboard-column">
          <MessageTypeDistribution title="Message Type Distribution" />
        </div>
        <div className="dashboard-column">
          <RecentActivity title="Recent Activity" />
        </div>
        <div className="dashboard-column">
          {summary}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;