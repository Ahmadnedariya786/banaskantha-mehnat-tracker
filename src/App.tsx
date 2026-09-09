import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';

import { Layout } from './components/layout/Layout';

// Pages
import { Onboarding } from './pages/Onboarding';
import { NewReport } from './pages/NewReport';
import { PastReports } from './pages/PastReports';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { Gallery } from './pages/Gallery';

function App() {
  const { hasCompletedOnboarding, loadData } = useAppStore();
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Gallery available for demo */}
        <Route path="/gallery" element={<Gallery />} />
        
        {/* Main App Routes */}
        {hasCompletedOnboarding ? (
          <Route element={<Layout />}>
            <Route path="/" element={<NewReport />} />
            <Route path="/past-reports" element={<PastReports />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Onboarding />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
