import { Router, Application } from 'express';
import apiRoutes from './api';

const router = Router();

const setupRoutes = (app: Application) => {
  app.use('/api', apiRoutes);
};

export default setupRoutes;