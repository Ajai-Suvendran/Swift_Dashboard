import {
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
  PluginInitializerContext,
} from '../../../src/core/server';
import { defineRoutes } from './routes';

export class SwiftDashboardPlugin implements Plugin {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup, plugins: object): void {
    this.logger.debug('Swift Dashboard: Setup');
    
    // Register server routes
    const router = core.http.createRouter();
    defineRoutes(router);
  }

  public start(core: CoreStart): void {
    this.logger.debug('Swift Dashboard: Started');
  }

  public stop(): void {
    this.logger.debug('Swift Dashboard: Stopped');
  }
}