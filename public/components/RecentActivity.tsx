import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecentActivity.module.css';
import axios from 'axios';

interface RecentActivityProps {
  title: string;
  direction: string
  period: string
}

interface RecentMessage {
  id: string;
  time: string;
  mtMessageType: string;
  status: string;
  direction: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ title, direction, period }) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ recentMessages: RecentMessage[] }>('/api/swift-dashboard/messages/recent', {params: { direction, period}});
        setActivities(response.data.recentMessages);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent messages:', err);
        setError('Failed to load recent activity. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMessages();
  }, [direction, period]);

  const handleRowClick = (id: string) => {
    // Navigate to messages page with the selected message ID and a flag to show details
    navigate('/messages', { 
      state: { 
        selectedMessageId: id,
        showDetails: true
      } 
    });
  };

  // Handle button click to view all messages
  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  if (loading) {
    return (
      <div className="summary-component">
        <h3>{title}</h3>
        <div className={styles['loading-indicator']}>
          <div className={styles['spinner']}></div>
          <span className={styles['loading-text']}>Loading recent activity...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="summary-component">
        <div className={styles['error-message']}>
              <span>{error}</span>
              <button onClick={() => {
                window.location.reload();
              }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-component">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className={styles.viewAllButtonContainer}>
          <button 
            className={styles.viewAllButton} 
            onClick={handleViewAllMessages}
          >
            All Messages
          </button>
        </div>
        <div className="chart-info-icon activity" data-tooltip="Shows the most recent messages based on your selected time period and direction filters. Click on a message ID to view its details.">
            <span className="info-icon">i</span>
        </div>
      </div>
      {activities.length === 0 ? (
        <div className={styles['no-data-message']}>
          <span>No recent messages found for selected filters</span>
        </div>
      ) : (
        <div className="recent-activity-table">
          {activities.map((activity, index) => (
            <div key={index} className="recent-activity-row" onClick={() => handleRowClick(activity.id)}>
              <div className="recent-activity-amount">{activity.id}</div>
              <div className="recent-activity-time">{activity.time}</div>
              <div className="recent-activity-type">{activity.mtMessageType}</div>
              <div className={`recent-activity-direction ${activity.direction.toLowerCase()}`}>{activity.direction}</div>
              <div className={`recent-activity-status ${activity.status.toLowerCase()}`}>
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;