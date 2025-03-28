/**
 * Validates if a message object has all required fields
 */
export function validateMessage(message: any): boolean {
  const requiredFields = [
    'id', 
    'mtMessageType',
    'mxMessageType',
    'direction',
    'amount',
    'currency',
    'date',
    'status', 
    'originalMessage', 
    'translatedMessage'
  ];
  
  return requiredFields.every(field => message[field] !== undefined);
}

/**
 * Sanitizes a message object to ensure all required fields exist
 */
export function sanitizeMessage(message: any): any {
  return {
    id: message.id || '',
    mtMessageType: message.mtMessageType || '',
    mxMessageType: message.mxMessageType || '',
    direction: message.direction || '',
    amount: message.amount || '',
    currency: message.currency || '',
    date: message.date || '',
    status: message.status || '',
    originalMessage: message.originalMessage || '',
    translatedMessage: message.translatedMessage || ''
  };
}