import opensearchClient from '../config/opensearch';

// Define interface to match the actual OpenSearch document structure
interface MessageDocument {
  id: string;
  mtMessageType: string;
  mxMessageType: string;
  direction: string;
  amount: string;
  currency: string;
  date: string;
  status: string;
  originalMessage: string;
  translatedMessage: string;
}

class OpenSearchService {
    private client;
    private index: string = 'swift_messages';
  
    constructor() {
      // Use the pre-configured client from opensearch.ts
      this.client = opensearchClient;
    }

  /**
   * Get dashboard data from OpenSearch
   */
  public async getDashboardData(): Promise<MessageDocument[]> {
    try {
      const response = await this.client.search({
        index: this.index,
        body: {
          sort: [{ date: { order: 'desc' } }],
          query: {
            match_all: {}
          }
        }
      });

      // Map the OpenSearch results to the expected format
      return response.body.hits.hits.map((hit: any) => ({
        id: hit._id,
        mtMessageType: hit._source.mtMessageType || '',
        mxMessageType: hit._source.mxMessageType || '',
        direction: hit._source.direction || '',
        amount: hit._source.amount || '',
        currency: hit._source.currency || '',
        date: hit._source.date || '',
        status: hit._source.status || '',
        originalMessage: hit._source.originalMessage || '',
        translatedMessage: hit._source.translatedMessage || ''
      }));
    } catch (error) {
      console.error('Error fetching data from OpenSearch:', error);
      throw error;
    }
  }

  /**
   * Get a single message by ID
   */
  public async getMessageById(id: string): Promise<MessageDocument> {
    try {
      const response = await this.client.get({
        index: this.index,
        id: id
      });

      if (!response.body.found) {
        throw new Error('Message not found');
      }

      const source = response.body._source || {};
      
      // Format the document to match the expected structure
      return {
        id: response.body._id,
        mtMessageType: source.mtMessageType || '',
        mxMessageType: source.mxMessageType || '',
        direction: source.direction || '',
        amount: source.amount || '',
        currency: source.currency || '',
        date: source.date || '',
        status: source.status || '',
        originalMessage: source.originalMessage || '',
        translatedMessage: source.translatedMessage || ''
      };
    } catch (error) {
      console.error(`Error fetching message with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get recent activity data
   */
  public async getRecentActivity(): Promise<any[]> {
    try {
      const response = await this.client.search({
        index: this.index,
        body: {
          size: 5,
          sort: [{ date: { order: 'desc' } }],
          query: {
            match_all: {}
          }
        }
      });

      // For recent activity, format to match what the client expects
      return response.body.hits.hits.map((hit: any) => {
        const source = hit._source;
        const date = new Date(source.date);
        
        return {
          id: hit._id,
          // Use mtMessageType as the type that the client expects
          type: source.mtMessageType,
          status: source.status,
          // Format time from the date field
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
    } catch (error) {
      console.error('Error fetching recent activity from OpenSearch:', error);
      throw error;
    }
  }
}

export default OpenSearchService;