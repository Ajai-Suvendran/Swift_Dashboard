import { RequestHandlerContext, OpenSearchDashboardsRequest } from '../../../../src/core/server';
import { PluginContext } from '../types';
import OpenSearchService from '../services/opensearchService';

export class DashboardController {
  private context: PluginContext;
  private openSearchService: OpenSearchService;
  
  constructor(context: PluginContext) {
    this.context = context;
    this.openSearchService = new OpenSearchService(context);
  }
  
  /**
   * Fetch a message by ID
   */
  public async fetchMessageById(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const id = (request.params as { id: string }).id;
      
      this.context.logger.debug(`Fetching message with ID: ${id}`);
      
      const message = await this.openSearchService.getMessageById(
        context.core.opensearch.client.asCurrentUser,
        id
      );
      
      return message;
    } catch (error) {
      this.context.logger.error(`Error in fetchMessageById: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch dashboard data with optional date range and direction filtering
   */
  public async fetchDashboardData(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const query = request.query as Record<string, string | string[]>;
      const fromDate = query.fromDate as string;
      const toDate = query.toDate as string;
      const direction = query.direction as string;
      const page = query.page ? parseInt(query.page as string, 10) : 1;
      const size = query.size ? parseInt(query.size as string, 10) : 20;
      const sort = query.sort as string || 'timestamp:desc';
      
      // If dates are provided, validate the format (YYYY-MM-DD)
      if (fromDate && toDate) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fromDate) || !dateRegex.test(toDate)) {
          throw new Error('Invalid date format. Use YYYY-MM-DD format.');
        }
        
        // Validate that the start date is not after the end date
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        if (startDate > endDate) {
          throw new Error('Start date cannot be after end date');
        }
      }
      
      this.context.logger.debug(`Fetching dashboard data${fromDate ? ` from ${fromDate} to ${toDate}` : ''}${direction ? ` with direction '${direction}'` : ''}`);
      
      // Pass parameters to the service method
      const data = await this.openSearchService.getMessagesInDateRange(
        context.core.opensearch.client.asCurrentUser,
        fromDate,
        toDate,
        direction
      );
      
      return data;
    } catch (error) {
      this.context.logger.error(`Error in fetchDashboardData: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch chart data
   */
  public async fetchChartData(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const query = request.query as Record<string, string | string[]>;
      const timeframe = (query.timeframe as 'daily' | 'weekly' | 'monthly') || 'daily';
      const direction = query.direction as 'inward' | 'outward' | undefined;
      
      const chartData = await this.openSearchService.getMessageChartData(
        context.core.opensearch.client.asCurrentUser,
        timeframe,
        direction
      );
      
      return chartData;
    } catch (error) {
      this.context.logger.error(`Error in fetchChartData: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch messages for the current day
   */
  public async fetchDailyMessages(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const direction = (request.query as any).direction as 'inward' | 'outward' | undefined;
      
      const messages = await this.openSearchService.getDailyMessages(
        context.core.opensearch.client.asCurrentUser,
        direction
      );
      
      const today = new Date().toISOString().split('T')[0];
      
      return {
        messages: messages,
        total: messages.length,
        period: 'day',
        date: today
      };
    } catch (error) {
      this.context.logger.error(`Error in fetchDailyMessages: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch messages for the current week
   */
  public async fetchWeeklyMessages(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const direction = (request.query as any).direction as 'inward' | 'outward' | undefined;
      
      const messages = await this.openSearchService.getWeeklyMessages(
        context.core.opensearch.client.asCurrentUser,
        direction
      );
      
      // Get date range for the week
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      
      return {
        messages: messages,
        total: messages.length,
        period: 'week',
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0]
      };
    } catch (error) {
      this.context.logger.error(`Error in fetchWeeklyMessages: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch messages for the current month
   */
  public async fetchMonthlyMessages(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const direction = (request.query as any).direction as 'inward' | 'outward' | undefined;
      
      const messages = await this.openSearchService.getMonthlyMessages(
        context.core.opensearch.client.asCurrentUser,
        direction
      );
      
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      return {
        messages: messages,
        total: messages.length,
        period: 'month',
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
        monthName: today.toLocaleString('default', { month: 'long' })
      };
    } catch (error) {
      this.context.logger.error(`Error in fetchMonthlyMessages: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch chart data for daily view
   */
  public async fetchDailyChartData(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const direction = (request.query as any).direction as 'inward' | 'outward' | undefined;
      
      const chartData = await this.openSearchService.getDailyChartData(
        context.core.opensearch.client.asCurrentUser,
        direction
      );
      
      return chartData;
    } catch (error) {
      this.context.logger.error(`Error in fetchDailyChartData: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch chart data for weekly view
   */
  public async fetchWeeklyChartData(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const direction = (request.query as any).direction as 'inward' | 'outward' | undefined;
      
      const chartData = await this.openSearchService.getWeeklyChartData(
        context.core.opensearch.client.asCurrentUser,
        direction
      );
      
      return chartData;
    } catch (error) {
      this.context.logger.error(`Error in fetchWeeklyChartData: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch chart data for monthly view
   */
  public async fetchMonthlyChartData(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const direction = (request.query as any).direction as 'inward' | 'outward' | undefined;
      
      const chartData = await this.openSearchService.getMonthlyChartData(
        context.core.opensearch.client.asCurrentUser,
        direction
      );
      
      return chartData;
    } catch (error) {
      this.context.logger.error(`Error in fetchMonthlyChartData: ${error}`);
      throw error;
    }
  }
  
  /**
   * Fetch top message types for the specified time period
   */
  public async fetchTopMessageTypes(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const query = request.query as any;
      const timeFilter = (query.timeFilter as 'daily' | 'weekly' | 'monthly') || 'daily';
      const direction = query.direction as 'inward' | 'outward' | undefined;
      const limit = query.limit ? parseInt(query.limit as string, 10) : 7;
      const includeStats = query.includeStats === 'true';
      
      this.context.logger.debug(`Fetching top ${limit} message types for ${timeFilter} period${direction ? ` (${direction})` : ''}, includeStats=${includeStats}`);
      
      let result;
      if (includeStats) {
        result = await this.openSearchService.getTopMessageTypesWithStats(
          context.core.opensearch.client.asCurrentUser,
          timeFilter,
          direction,
          limit
        );
      } else {
        result = await this.openSearchService.getTopMessageTypes(
          context.core.opensearch.client.asCurrentUser,
          timeFilter,
          direction,
          limit
        );
      }
      
      // Get time period information for context
      const timeInfo = await this.getTimePeriodInfo(timeFilter);
      
      return {
        timeFilter,
        direction: direction || 'all',
        ...timeInfo,
        messageTypes: result
      };
    } catch (error) {
      this.context.logger.error(`Error in fetchTopMessageTypes: ${error}`);
      throw error;
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
   **/
  public async getRecentMessages(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const query = request.query as any;
      const limit = query.limit ? parseInt(query.limit as string, 10) : 5;
      const direction = query.direction ? String(query.direction) : 'All';
      const period = query.period ? String(query.period) : 'Monthly';
      
      const recentMessages = await this.openSearchService.getRecentMessages(
        context.core.opensearch.client.asCurrentUser,
        limit,
        direction,
        period
      );
      
      return {
        recentMessages
      };
    } catch (error) {
      this.context.logger.error(`Error in getRecentMessages: ${error}`);
      throw error;
    }
  }
  
  /**
  public async refreshCache(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
   */
  public async refreshCache(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      this.openSearchService.invalidateCache();
      return { message: 'Cache invalidated successfully' };
    } catch (error) {
      this.context.logger.error(`Error in refreshCache: ${error}`);
      throw error;
    }
  }
  
  
  public async fetchErrorStatistics(context: RequestHandlerContext, request: OpenSearchDashboardsRequest) {
    try {
      const query = request.query as any;
      const timeFilter = (query.timeFilter as 'Daily' | 'Weekly' | 'Monthly' | 'All') || 'all';
      const direction = (query.direction as 'Inward' | 'Outward' | 'All') || 'All';
      
      this.context.logger.debug(`Fetching error statistics for ${timeFilter} period and ${direction} direction`);
      
      const errorStats = await this.openSearchService.getErrorStatistics(
        context.core.opensearch.client.asCurrentUser,
        timeFilter,
        direction
      );
      
      return errorStats;
    } catch (error) {
      this.context.logger.error(`Error in fetchErrorStatistics: ${error}`);
      throw error;
    }
  }
}