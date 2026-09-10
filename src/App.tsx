import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showGreeting, setShowGreeting] = useState(true);
  
  useEffect(() => {
    loadData();
    const t = setTimeout(() => setShowGreeting(false), 2000);
    return () => clearTimeout(t);
  }, [loadData]);

  return (
    <>
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg pointer-events-none"
          >
            <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl">
              <h1 className="text-4xl sm:text-5xl font-bold font-gujarati text-txt mb-2">અસ્સલામુ અલયકુમ</h1>
              <p className="text-sm sm:text-base font-bold tracking-[0.2em] text-sub uppercase font-num">Assalamu Alaykum</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    </>
  );
}
export default App;
