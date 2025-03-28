import { Request, Response } from 'express';
import OpenSearchService from '../services/opensearchService';

class DashboardController {
  private openSearchService: OpenSearchService;

  constructor() {
    this.openSearchService = new OpenSearchService();
  }

  /**
   * Fetch all messages for the dashboard
   */
  public async fetchDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const messages = await this.openSearchService.getDashboardData();
      
      // Return the data in the format expected by client
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      res.status(500).json({ 
        message: 'Error fetching dashboard data', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }

  /**
   * Fetch a single message by ID
   */
  public async fetchMessageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const message = await this.openSearchService.getMessageById(id);
      
      res.status(200).json(message);
    } catch (error) {
      console.error('Error in fetchMessageById:', error);
      res.status(500).json({ 
        message: 'Error fetching message data', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }

  /**
   * Fetch recent activity for the dashboard
   */
  public async fetchRecentActivity(req: Request, res: Response): Promise<void> {
    try {
      const activities = await this.openSearchService.getRecentActivity();
      
      res.status(200).json(activities);
    } catch (error) {
      console.error('Error in fetchRecentActivity:', error);
      res.status(500).json({ 
        message: 'Error fetching recent activity', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }
}

export default DashboardController;