import { Request, Response } from 'express';
import OpenSearchService from '../services/opensearchService';

class DashboardController {
  private openSearchService: OpenSearchService;
  
  constructor() {
    this.openSearchService = new OpenSearchService();
  }
  
  /**
   * Fetch a message by ID
   */
  public async fetchMessageById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ message: 'Message ID is required' });
        return;
      }
      
      const message = await this.openSearchService.getMessageById(id);
      res.status(200).json(message);
    } catch (error) {
      console.error('Error in fetchMessageById:', error);
      res.status(404).json({ 
        message: 'Message not found',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
 * Fetch dashboard data with optional date range and direction filtering
 */
public async fetchDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const fromDate = req.query.fromDate as string;
      const toDate = req.query.toDate as string;
      const direction = req.query.direction as string;
      
      // If dates are provided, validate the format (YYYY-MM-DD)
      if (fromDate && toDate) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fromDate) || !dateRegex.test(toDate)) {
          res.status(400).json({ 
            message: 'Invalid date format. Use YYYY-MM-DD format.'
          });
          return;
        }
        
        // Validate that the start date is not after the end date
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        if (startDate > endDate) {
          res.status(400).json({
            message: 'Start date cannot be after end date'
          });
          return;
        }
      }
      
      // Log request details
      console.log(`Fetching dashboard data${fromDate ? ` from ${fromDate} to ${toDate}` : ''}${direction ? ` with direction '${direction}'` : ''}`);
      
      // Pass parameters to the service method
      const data = await this.openSearchService.getMessagesInDateRange(fromDate, toDate, direction);
      
      res.status(200).json(data);
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      res.status(500).json({ 
        message: 'Error fetching dashboard data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Fetch chart data
   */
  public async fetchChartData(req: Request, res: Response): Promise<void> {
    try {
      const timeframe = (req.query.timeframe as 'daily' | 'weekly' | 'monthly') || 'daily';
      const direction = req.query.direction as 'inward' | 'outward' | undefined;
      
      const chartData = await this.openSearchService.getMessageChartData(timeframe, direction);
      res.status(200).json(chartData);
    } catch (error) {
      console.error('Error in fetchChartData:', error);
      res.status(500).json({ 
        message: 'Error fetching chart data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Fetch messages for the current day
   */
  public async fetchDailyMessages(req: Request, res: Response): Promise<void> {
    try {
      const direction = req.query.direction as 'inward' | 'outward' | undefined;
      const messages = await this.openSearchService.getDailyMessages(direction);
      
      const today = new Date().toISOString().split('T')[0];
      
      res.status(200).json({
        messages: messages,
        total: messages.length,
        period: 'day',
        date: today
      });
    } catch (error) {
      console.error('Error in fetchDailyMessages:', error);
      res.status(500).json({ 
        message: 'Error fetching daily messages',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Fetch messages for the current week
   */
  public async fetchWeeklyMessages(req: Request, res: Response): Promise<void> {
    try {
      const direction = req.query.direction as 'inward' | 'outward' | undefined;
      const messages = await this.openSearchService.getWeeklyMessages(direction);

      
      // Get date range for the week
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      
      res.status(200).json({
        messages: messages,
        total: messages.length,
        period: 'week',
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error in fetchWeeklyMessages:', error);
      res.status(500).json({ 
        message: 'Error fetching weekly messages',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Fetch messages for the current month
   */
  public async fetchMonthlyMessages(req: Request, res: Response): Promise<void> {
    try {
      const direction = req.query.direction as 'inward' | 'outward' | undefined;
      const messages = await this.openSearchService.getMonthlyMessages(direction);
      
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      res.status(200).json({
        messages: messages,
        total: messages.length,
        period: 'month',
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
        monthName: today.toLocaleString('default', { month: 'long' })
      });
    } catch (error) {
      console.error('Error in fetchMonthlyMessages:', error);
      res.status(500).json({ 
        message: 'Error fetching monthly messages',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Fetch chart data for daily view
   */
  public async fetchDailyChartData(req: Request, res: Response): Promise<void> {
    try {
      const direction = req.query.direction as 'inward' | 'outward' | undefined;
      const chartData = await this.openSearchService.getDailyChartData(direction);
      res.status(200).json(chartData);
    } catch (error) {
      console.error('Error in fetchDailyChartData:', error);
      res.status(500).json({ 
        message: 'Error fetching daily chart data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Fetch chart data for weekly view
   */
  public async fetchWeeklyChartData(req: Request, res: Response): Promise<void> {
    try {
      const direction = req.query.direction as 'inward' | 'outward' | undefined;
      const chartData = await this.openSearchService.getWeeklyChartData(direction);
      res.status(200).json(chartData);
    } catch (error) {
      console.error('Error in fetchWeeklyChartData:', error);
      res.status(500).json({ 
        message: 'Error fetching weekly chart data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Fetch chart data for monthly view
   */
  public async fetchMonthlyChartData(req: Request, res: Response): Promise<void> {
    try {
      const direction = req.query.direction as 'inward' | 'outward' | undefined;
      const chartData = await this.openSearchService.getMonthlyChartData(direction);
      res.status(200).json(chartData);
    } catch (error) {
      console.error('Error in fetchMonthlyChartData:', error);
      res.status(500).json({ 
        message: 'Error fetching monthly chart data',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
 * Fetch top message types for the specified time period
 */
public async fetchTopMessageTypes(req: Request, res: Response): Promise<void> {
    try {
      const timeFilter = (req.query.timeFilter as 'daily' | 'weekly' | 'monthly') || 'daily';
      const direction = req.query.direction as 'inward' | 'outward' | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 7;
      const includeStats = req.query.includeStats === 'true';
      
      console.log(`Fetching top ${limit} message types for ${timeFilter} period${direction ? ` (${direction})` : ''}, includeStats=${includeStats}`);
      
      let result;
      if (includeStats) {
        result = await this.openSearchService.getTopMessageTypesWithStats(timeFilter, direction, limit);
      } else {
        result = await this.openSearchService.getTopMessageTypes(timeFilter, direction, limit);
      }
      
      // Get time period information for context
      const timeInfo = await this.getTimePeriodInfo(timeFilter);
      
      res.status(200).json({
        timeFilter,
        direction: direction || 'all',
        ...timeInfo,
        messageTypes: result
      });
    } catch (error) {
      console.error('Error in fetchTopMessageTypes:', error);
      res.status(500).json({ 
        message: 'Error fetching top message types',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Get time period information based on the time filter
   */
  private async getTimePeriodInfo(timeFilter: 'daily' | 'weekly' | 'monthly') {
    const today = new Date();
    
    if (timeFilter === 'daily') {
      return {
        period: 'day',
        date: today.toISOString().split('T')[0]
      };
    } else if (timeFilter === 'weekly') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 2); // Monday
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
      
      return {
        period: 'week',
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0]
      };
    } else {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setUTCHours(23, 59, 59, 999);
      
      return {
        period: 'month',
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
        monthName: today.toLocaleString('default', { month: 'long' })
      };
    }
  }

  /**
 * Get recent messages for the dashboard
 */
public async getRecentMessages(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const direction = req.query.direction ? String(req.query.direction) : 'All';
      const period = req.query.period ? String(req.query.period) : 'Monthly';
      
      const recentMessages = await this.openSearchService.getRecentMessages(limit, direction, period);
      
      res.status(200).json({
        recentMessages
      });
    } catch (error) {
      console.error('Error in getRecentMessages:', error);
      res.status(500).json({ 
        message: 'Error fetching recent messages',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Force refresh of cached data
   */
  public refreshCache(req: Request, res: Response): void {
    try {
      this.openSearchService.invalidateCache();
      res.status(200).json({ message: 'Cache invalidated successfully' });
    } catch (error) {
      console.error('Error in refreshCache:', error);
      res.status(500).json({ 
        message: 'Error invalidating cache',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
 * Fetch error statistics based on time period and direction
 */
public async fetchErrorStatistics(req: Request, res: Response): Promise<void> {
    try {
      const timeFilter = (req.query.timeFilter as 'Daily' | 'Weekly' | 'Monthly' | 'All') || 'all';
      const direction = (req.query.direction as 'Inward' | 'Outward' | 'All') || 'All';
      
      console.log(`Fetching error statistics for ${timeFilter} period and ${direction} direction`);
      
      const errorStats = await this.openSearchService.getErrorStatistics(timeFilter, direction);
      
      res.status(200).json({
        ...errorStats,
      });
    } catch (error) {
      console.error('Error in fetchErrorStatistics:', error);
      res.status(500).json({ 
        message: 'Error fetching error statistics',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

export default DashboardController;