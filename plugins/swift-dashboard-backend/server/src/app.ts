import express from 'express';
import { json, urlencoded } from 'body-parser';
import setupRoutes from './routes';
import errorHandler from './middleware/errorHandler';
import { Client } from '@opensearch-project/opensearch';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenSearch client
const client = new Client({ node: 'http://localhost:9200' });

function connectToOpenSearch() {
  return client;
}

app.use(json());
app.use(urlencoded({ extended: true }));

// Make OpenSearch client available to routes
app.locals.opensearchClient = client;

setupRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;