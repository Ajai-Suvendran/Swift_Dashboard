import { PluginInitializerContext } from '../../../src/core/server';
import { SwiftDashboardPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as an entry point for the plugin
export function plugin(initializerContext: PluginInitializerContext) {
  return new SwiftDashboardPlugin(initializerContext);
}