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

const opensearchUrl = getOpenSearchUrl();
console.log(`Attempting to connect to OpenSearch at: ${opensearchUrl}`);

const client = new Client({
  node: opensearchUrl,
  auth: {
    username: config.opensearch.username,
    password: config.opensearch.password,
  },
  ssl: {
    rejectUnauthorized: false // For development environments
  }
});

// Verify connection to OpenSearch with more detailed error reporting
async function verifyOpenSearchConnection() {
  try {
    console.log('Testing connection to OpenSearch...');
    const response = await client.ping({}, {
      // Set a reasonable timeout
      requestTimeout: 5000
    });
    
    console.log('✅ Successfully connected to OpenSearch');
    
    // Try to get more cluster information
    try {
      const healthResponse = await client.cluster.health({});
      console.log(`Cluster name: ${healthResponse.body.cluster_name}`);
      console.log(`Cluster status: ${healthResponse.body.status}`);
      console.log(`Number of nodes: ${healthResponse.body.number_of_nodes}`);
    } catch (healthErr) {
      console.log('Connected but could not get cluster health information');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to OpenSearch');
    console.error(`Error message: ${error instanceof Error ? error.message : String(error)}`);
    
    // Log more detailed error information
    if (typeof error === 'object' && error !== null && 'meta' in error && 
        error.meta && typeof error.meta === 'object' && 'body' in error.meta) {
      console.error('Error details:', JSON.stringify(error.meta.body, null, 2));
    }
    if (typeof error === 'object' && error !== null && 'name' in error) {
      if (error.name === 'ConnectionError') {
        console.error('This is a network connectivity issue. Please check:');
        console.error('- Is OpenSearch running?');
        console.error('- Is the host and port correct?');
        console.error('- Are there any firewall or network restrictions?');
      } else if (error.name === 'AuthenticationException') {
        console.error('Authentication failed. Please check username and password.');
        console.error('Received an error response from OpenSearch.');
        if (typeof error === 'object' && error !== null && 'statusCode' in error) {
          console.error(`Status code: ${error.statusCode}`);
        }
      }
    }
    
    console.error('OpenSearch configuration used:');
    console.error(`Host: ${config.opensearch.host}`);
    console.error(`Port: ${config.opensearch.port}`);
    console.error(`URL: ${opensearchUrl}`);
    console.error(`Username: ${config.opensearch.username}`);
    console.error('Password: ********');
    
    return false;
  }
}

// Execute connection verification
verifyOpenSearchConnection()
  .then(isConnected => {
    if (!isConnected) {
      console.warn('⚠️ Application will continue but OpenSearch functionality will not work.');
      console.warn('You can continue with a mock backend by setting USE_MOCK_DATA=true in your .env file');
    }
  })
  .catch(err => {
    console.error('Unexpected error during connection verification:', err);
  });

export default client;