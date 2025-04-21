// import { CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
// import { 
//   SwiftDashboardPluginSetup, 
//   SwiftDashboardPluginStart,
//   AppPluginStartDependencies
// } from './types';

// export class SwiftDashboardPlugin implements Plugin<SwiftDashboardPluginSetup, SwiftDashboardPluginStart> {
//   public setup(core: CoreSetup): SwiftDashboardPluginSetup {
//     // Register your application with OpenSearch Dashboards
//     core.application.register({
//       id: 'swiftDashboard',
//       title: 'SWIFT Dashboard',
//       category: {
//         id: 'swiftPlugin',
//         label: 'SWIFT Analytics',
//         order: 1000,
//       },
//       order: 1000,
//       async mount(params) {
//         // Load your React application
//         //const { renderApp } = await import('./application');
//         const [coreStart, depsStart] = await core.getStartServices();
//         return renderApp(params, coreStart, depsStart as AppPluginStartDependencies);
//       },
//     });

//     return {};
//   }

//   public start(core: CoreStart): SwiftDashboardPluginStart {
//     return {};
//   }

//   public stop() {}
// }