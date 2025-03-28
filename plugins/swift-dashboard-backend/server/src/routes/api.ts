import { Router } from 'express';
import DashboardController from '../controllers/dashboardController';
// Import the adapter middleware if needed
// import { adaptMessagesForClient } from '../middleware/clientAdapter';

const router = Router();
const dashboardController = new DashboardController();

// Apply the adapter middleware to specific routes if needed
// router.use('/messages', adaptMessagesForClient);

// Route to get all messages
router.get('/messages', dashboardController.fetchDashboardData.bind(dashboardController));

// Route to get a specific message by ID
router.get('/messages/:id', dashboardController.fetchMessageById.bind(dashboardController));

// Route to get recent activity
router.get('/recent-activity', dashboardController.fetchRecentActivity.bind(dashboardController));

export default router;