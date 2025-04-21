import { Request, Response, NextFunction } from 'express';

// This middleware can transform OpenSearch data to match client expectations if needed
export const adaptMessagesForClient = (req: Request, res: Response, next: NextFunction) => {
  // Store the original send method
  const originalSend = res.send;

  // Override the send method to transform the data before sending
  res.send = function(body) {
    // If the response is JSON and contains message data
    if (body && typeof body === 'string') {
      try {
        const data = JSON.parse(body);
        
        // If it's an array of messages, adapt each message
        if (Array.isArray(data)) {
          const adaptedData = data.map(message => adaptMessageFormat(message));
          // Call the original send with the adapted data
          return originalSend.call(this, JSON.stringify(adaptedData));
        } 
        // If it's a single message
        else if (data && typeof data === 'object' && data.id) {
          const adaptedData = adaptMessageFormat(data);
          return originalSend.call(this, JSON.stringify(adaptedData));
        }
      } catch (error) {
        // If it's not parseable JSON, just send as is
        console.error('Error adapting message format:', error);
      }
    }
    
    // Default: call original send
    return originalSend.call(this, body);
  };

  next();
};

// Helper function to adapt a single message
function adaptMessageFormat(message: any) {
  // Example: Client expects 'type' but we have 'mtMessageType'
  // This is where you'd make specific adaptations if needed
  return {
    ...message,
    // Add any specific field transformations here if needed
    // For example: type: message.mtMessageType
  };
}