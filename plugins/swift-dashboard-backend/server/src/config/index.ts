import dotenv from 'dotenv';

dotenv.config();

const config = {
  app: {
    port: process.env.APP_PORT || 3000,
  },
  opensearch: {
    // Make sure host doesn't include the port
    host: process.env.OPENSEARCH_HOST || 'localhost',
    port: process.env.OPENSEARCH_PORT || 9200,
    username: process.env.OPENSEARCH_USERNAME || 'admin',
    password: process.env.OPENSEARCH_PASSWORD || 'admin',
  },
};

export default config;