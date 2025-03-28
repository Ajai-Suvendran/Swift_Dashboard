import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyData } from '../data/dummyData';

interface RecentActivityProps {
  title: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ title }) => {
  
   const navigate = useNavigate();

   const activities = [
    { time: '14:25', type: 'MT103', id: 'MSG001', status: 'Successful' },
    { time: '14:20', type: 'MT202', id: 'MSG002', status: 'Failed' },
    { time: '14:15', type: 'MT940', id: 'MSG009', status: 'Successful' },
    { time: '14:10', type: 'MT700', id: 'MSG003', status: 'Successful' },
    { time: '13:20', type: 'MT760', id: 'MSG004', status: 'Failed' }
  ];

  const handleRowClick = (id: string) => {
    // Find the complete message data from dummyData using the id
    const message = dummyData.find(item => item.id === id);
    
    if (message) {
      // Navigate to messages page with the selected message ID and a flag to show details
      navigate('/messages', { 
        state: { 
          selectedMessageId: id,
          showDetails: true
        } 
      });
    }
  };

  return (
    <div className="summary-component">
      <h3>{title}</h3>
      <div className="recent-activity-table">
        {activities.map((activity, index) => (
          <div key={index} className="recent-activity-row" onClick={() => handleRowClick(activity.id)}>
            <div className="recent-activity-amount">{activity.id}</div>
            <div className="recent-activity-time">{activity.time}</div>
            <div className="recent-activity-type">{activity.type}</div>
            <div className={`recent-activity-status ${activity.status.toLowerCase()}`}>
              {activity.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;