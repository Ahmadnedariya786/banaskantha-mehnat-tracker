import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../i18n';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { Shield, Users, Activity, Database, Lock } from 'lucide-react';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="space-y-6 pb-12">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-gujarati flex items-center gap-2">
          <Shield className="text-acc" />
          {t('admin.dashboard_title' as any)}
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard hoverEffect className="p-4 flex flex-col items-center justify-center text-center gap-3 aspect-square cursor-pointer">
          <Users size={32} className="text-sub" />
          <span className="font-gujarati font-medium text-sm">{t('admin.manage_users' as any)}</span>
        </GlassCard>

        <GlassCard hoverEffect className="p-4 flex flex-col items-center justify-center text-center gap-3 aspect-square cursor-pointer">
          <Activity size={32} className="text-sub" />
          <span className="font-gujarati font-medium text-sm">{t('admin.system_logs' as any)}</span>
        </GlassCard>

        <GlassCard hoverEffect className="p-4 flex flex-col items-center justify-center text-center gap-3 aspect-square cursor-pointer">
          <Database size={32} className="text-sub" />
          <span className="font-gujarati font-medium text-sm">{t('settings.data_backup' as any)}</span>
        </GlassCard>
      </div>
    </div>
  );
};
