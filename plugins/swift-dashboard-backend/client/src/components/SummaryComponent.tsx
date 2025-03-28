import React from 'react';
import './SummaryComponent.css';

interface SummaryComponentProps {
  title: string;
}

interface ErrorData {
  type: string;
  count: number;
  color: string;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({ title }) => {
  // Mock data for translation errors
  const errorData: ErrorData[] = [
    { type: 'Mandatory field not present', count: 87, color: '#EF4444' },
    { type: 'Message not supported', count: 65, color: '#F59E0B' },
    { type: 'Invalid message', count: 43, color: '#8B5CF6' },
    { type: 'Other errors', count: 28, color: '#6B7280' }
  ];

  const totalErrors = errorData.reduce((sum, error) => sum + error.count, 0);

  return (
    <div className="chart-component summary-component">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      
      <div className="error-summary-content">
        <div className="total-errors">
          <div className="total-count">{totalErrors}</div>
          <div className="total-label">Total Errors</div>
        </div>
        
        <div className="error-breakdown">
          {errorData.map((error, index) => (
            <div key={index} className="error-item">
              <div className="error-bar-container">
                <div 
                  className="error-bar" 
                  style={{
                    width: `${(error.count / totalErrors) * 100}%`,
                    backgroundColor: error.color
                  }}
                />
              </div>
              
              <div className="error-details">
                <div className="error-count" style={{color: error.color}}>
                  {error.count}
                </div>
                <div className="error-type">{error.type}</div>
                <div className="error-percentage">
                  {Math.round((error.count / totalErrors) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryComponent;