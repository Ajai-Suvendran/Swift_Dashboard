import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import OverviewPage from './OverviewPage';
import MessagesPage from './MessagesPage';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/" element={<OverviewPage />} />
      </Routes>
    </Router>
  );
};

export default App;