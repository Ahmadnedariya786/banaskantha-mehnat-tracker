import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../i18n';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { Shield, Users, Activity, Database, Lock, ChevronLeft, CheckCircle } from 'lucide-react';
import { getLogs, clearLogs, type SystemLog, logActivity } from '../lib/utils';
import { useAppStore } from '../store/appStore';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeScreen, setActiveScreen] = useState<'main' | 'users' | 'logs'>('main');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const { reports, halqas } = useAppStore();

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const salt = 'mehnat2026';
      const encoder = new TextEncoder();
      const data = encoder.encode(salt + username + password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      if (hashHex === '85968d9cbf415a1ebf5b8fd9125ad48db9761bf4d72132c589f9f90c2657eaef') {
        setIsAuthenticated(true);
        setError(false);
      } else {
        setError(true);
        setPassword('');
      }
    } catch (err) {
      setError(true);
    }
    setIsLoading(false);
  };

  const handleBackup = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      reports,
      halqas,
      settings: {}
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logActivity('ડેટા બેકઅપ ડાઉનલોડ');
    showNotification('બેકઅપ ડાઉનલોડ થયું ✅');
  };

  const openLogs = () => {
    setLogs(getLogs());
    setActiveScreen('logs');
  };

  const handleClearLogs = () => {
    clearLogs();
    setLogs([]);
    showNotification('લૉગ્સ સાફ થયા ✅');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <GlassCard className="w-full max-w-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-acc/10 rounded-full flex items-center justify-center mx-auto text-acc mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold font-gujarati">{t('admin.login_title' as any)}</h2>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <input 
                type="text" 
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
                placeholder="Username"
                className="w-full h-12 px-4 rounded-xl glass-panel bg-card outline-none focus:shadow-[inset_0_0_0_2px_rgb(var(--acc))] transition-shadow text-center font-num tracking-wide text-txt"
              />
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder={t('admin.password_placeholder' as any)}
                className="w-full h-12 px-4 rounded-xl glass-panel bg-card outline-none focus:shadow-[inset_0_0_0_2px_rgb(var(--acc))] transition-shadow text-center font-num tracking-widest text-txt"
              />
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-acc text-sm font-gujarati text-center mt-2"
                  >
                    {t('admin.error_incorrect' as any)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <LiquidButton variant="primary" className="w-full" type="submit" disabled={isLoading}>
              <span className="font-gujarati">{t('admin.btn_login' as any)}</span>
            </LiquidButton>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass-pill px-6 py-3 bg-card/95 text-txt font-medium whitespace-nowrap backdrop-blur-md pointer-events-none flex items-center gap-2"
          >
            <CheckCircle size={18} className="text-emerald-500" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {activeScreen === 'main' && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
          <header className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-gujarati flex items-center gap-2">
              <Shield className="text-acc" />
              {t('admin.dashboard_title' as any)}
            </h2>
          </header>

          <div className="grid grid-cols-2 gap-4">
            <GlassCard onClick={() => setActiveScreen('users')} hoverEffect className="relative p-4 flex flex-col items-center justify-center text-center gap-3 aspect-square cursor-pointer">
              <div className="absolute top-3 right-3 w-6 h-6 bg-acc/10 text-acc rounded-full flex items-center justify-center">
                <Lock size={12} />
              </div>
              <Users size={32} className="text-sub" />
              <span className="font-gujarati font-medium text-sm">{t('admin.manage_users' as any)}</span>
            </GlassCard>

            <GlassCard onClick={openLogs} hoverEffect className="p-4 flex flex-col items-center justify-center text-center gap-3 aspect-square cursor-pointer">
              <Activity size={32} className="text-sub" />
              <span className="font-gujarati font-medium text-sm">{t('admin.system_logs' as any)}</span>
            </GlassCard>

            <GlassCard onClick={handleBackup} hoverEffect className="p-4 flex flex-col items-center justify-center text-center gap-3 aspect-square cursor-pointer">
              <Database size={32} className="text-sub" />
              <span className="font-gujarati font-medium text-sm">{t('settings.data_backup' as any)}</span>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {activeScreen === 'users' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <header className="flex items-center gap-4">
            <button onClick={() => setActiveScreen('main')} className="w-10 h-10 flex items-center justify-center rounded-full glass-panel text-sub">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold font-gujarati">{t('admin.manage_users' as any)}</h2>
          </header>
          <GlassCard className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-acc/10 rounded-full flex items-center justify-center mx-auto text-acc">
              <Lock size={32} />
            </div>
            <p className="font-gujarati text-lg font-medium text-txt">લોગિન સિસ્ટમ (S5) આવ્યા પછી સક્રિય થશે</p>
          </GlassCard>
        </motion.div>
      )}

      {activeScreen === 'logs' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveScreen('main')} className="w-10 h-10 flex items-center justify-center rounded-full glass-panel text-sub">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold font-gujarati">{t('admin.system_logs' as any)}</h2>
            </div>
          </header>
          
          <GlassCard className="p-4 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-brd/10">
              <span className="font-gujarati font-medium text-sub">છેલ્લા 50 લૉગ્સ</span>
              <LiquidButton variant="danger" onClick={handleClearLogs} className="py-2 px-4 text-sm font-gujarati">
                લૉગ્સ સાફ કરો
              </LiquidButton>
            </div>
            
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-sub font-gujarati">કોઈ લૉગ્સ નથી</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-card/40 border border-brd/5">
                    <span className="font-gujarati font-medium text-txt">{log.action}</span>
                    <span className="font-num text-xs text-sub">
                      {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

