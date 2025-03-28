import { Client } from '@opensearch-project/opensearch';
import config from './index';

// Create a properly formatted URL
const getOpenSearchUrl = () => {
  // Check if host already includes a protocol
  const hostHasProtocol = config.opensearch.host.includes('://');
  
  // Get base URL (with protocol if needed)
  const baseUrl = hostHasProtocol 
    ? config.opensearch.host 
    : `https://${config.opensearch.host}`;
    
  // Parse the URL to check if it already has a port
  try {
    const url = new URL(baseUrl);
    // If URL already has a port, return as is, otherwise append the port
    return url.port 
      ? baseUrl 
      : `${baseUrl}:${config.opensearch.port}`;
  } catch (error) {
    // If URL parsing fails, just use a simple concatenation with the port
    return `https://${config.opensearch.host}:${config.opensearch.port}`;
  }
};

const client = new Client({
  node: getOpenSearchUrl(),
  auth: {
    username: config.opensearch.username,
    password: config.opensearch.password,
  },
  ssl: {
    rejectUnauthorized: false // For development environments
  }
});

console.log(`Connecting to OpenSearch at: ${getOpenSearchUrl()}`);

export default client;