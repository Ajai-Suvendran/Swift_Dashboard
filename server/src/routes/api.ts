import { Router } from 'express';
import DashboardController from '../controllers/dashboardController';

const router = Router();
const dashboardController = new DashboardController();

// Dashboard data
router.get('/messages-list', dashboardController.fetchDashboardData.bind(dashboardController));

// Message specific endpoints
router.get('/message/:id', dashboardController.fetchMessageById.bind(dashboardController));

// Chart data endpoints
router.get('/chart', dashboardController.fetchChartData.bind(dashboardController));

// Time-specific message endpoints
router.get('/messages/daily', dashboardController.fetchDailyMessages.bind(dashboardController));
router.get('/messages/weekly', dashboardController.fetchWeeklyMessages.bind(dashboardController));
router.get('/messages/monthly', dashboardController.fetchMonthlyMessages.bind(dashboardController));

// Time-specific chart data endpoints
router.get('/chart/daily', dashboardController.fetchDailyChartData.bind(dashboardController));
router.get('/chart/weekly', dashboardController.fetchWeeklyChartData.bind(dashboardController));
router.get('/chart/monthly', dashboardController.fetchMonthlyChartData.bind(dashboardController));

// Add to your routes file
router.get('/stats/top-message-types', dashboardController.fetchTopMessageTypes.bind(dashboardController));

router.get('/messages/recent', dashboardController.getRecentMessages.bind(dashboardController));

// Add new route for error statistics
router.get('/error-statistics', dashboardController.fetchErrorStatistics.bind(dashboardController));

// Cache management
router.post('/cache/refresh', dashboardController.refreshCache.bind(dashboardController));

export default router;