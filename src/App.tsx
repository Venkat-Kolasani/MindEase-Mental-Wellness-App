import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import CheckinPage from './pages/CheckinPage';
import ResponsePage from './pages/ResponsePage';
import TrendsPage from './pages/TrendsPage';
import ToolsPage from './pages/ToolsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/checkin" element={<CheckinPage />} />
              <Route path="/response" element={<ResponsePage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/tools" element={<ToolsPage />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;