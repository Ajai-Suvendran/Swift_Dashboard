import axios from 'axios';

const API_BASE_URL = '/api/swift-dashboard';

export interface MessageData2 {
    id: string;
    mtMessageType: string;
    mxMessageType: string;
    currency: string;
    date: string;
    direction: string;
    amount: string;
    status: string;
    originalMessage: string;
    translatedMessage: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  status: string;
  time: string;
}

const apiService = {
  getAllMessages: async (): Promise<MessageData2[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data`);
      return response.data.messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  getMessageById: async (id: string): Promise<MessageData2> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching message with ID ${id}:`, error);
      throw error;
    }
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recent-activity`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
};

export default apiService;