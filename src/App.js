import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppContent from './AppContent';
import UserInterface from './components/UserInterface';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect from root to /app */}
        <Route path="/" element={<Navigate to="/app" replace />} />
        
        {/* Define route for the main wallet connection app */}
        <Route path="/app" element={<AppContent />} />
        
        {/* Redirect all other routes to /app */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
