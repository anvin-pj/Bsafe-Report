import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppContent from './AppContent';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect from root to /app */}
        <Route path="/" element={<Navigate to="/app" replace />} />
        
        {/* Define route for the main wallet connection app */}
        <Route path="/app" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
