import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import { CoreStart } from '../../../../../src/core/public';
import { AppPluginStartDependencies } from '../../../public/types';
import Header from './Header';
import OverviewPage from './OverviewPage';
import MessagesPage from './MessagesPage';

interface AppProps {
  coreStart: CoreStart;
  plugins: AppPluginStartDependencies;
}

const App: React.FC<AppProps> = ({ coreStart, plugins }) => {
  // You can now access OpenSearch Dashboards services like:
  // coreStart.http - for API requests
  // coreStart.notifications - for showing toasts
  // plugins.data - for data queries

  return (
    <>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/" element={<OverviewPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;