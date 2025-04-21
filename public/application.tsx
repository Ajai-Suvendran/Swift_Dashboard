// import React from 'react';
// import ReactDOM from 'react-dom';
// import { AppMountParameters, CoreStart } from '../../../src/core/public';
// import { AppPluginStartDependencies } from './types';
// import { BrowserRouter } from 'react-router-dom';
// import App from '../client/src/components/App';

// export const renderApp = (
//   { element }: AppMountParameters,
//   coreStart: CoreStart,
//   plugins: AppPluginStartDependencies
// ) => {
//   // Create the React element without using JSX for the Router
//   // This avoids the type incompatibility issue
//   const AppElement = React.createElement(
//     App,
//     { coreStart, plugins }
//   );
  
//   // Create the Router element manually
//   const RouterElement = React.createElement(
//     BrowserRouter,
//     null,
//     AppElement
//   );
  
//   // Render the element tree
//   ReactDOM.render(RouterElement, element);

//   return () => ReactDOM.unmountComponentAtNode(element);
// };