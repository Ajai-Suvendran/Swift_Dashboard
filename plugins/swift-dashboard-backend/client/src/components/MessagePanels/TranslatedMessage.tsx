import React from 'react';

// Define props interface
interface TranslatedMessageProps {
  message: string;
}

// Use the interface with the React.FC generic type
const TranslatedMessage: React.FC<TranslatedMessageProps> = ({ message }) => {
  return (
    <div>
      <h3>Translated Message</h3>
      <div className="message-content">
        {message}
      </div>
    </div>
  );
};

export default TranslatedMessage;