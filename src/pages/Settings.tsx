import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { t } from '../i18n';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidSwitch } from '../components/ui/LiquidSwitch';
import { Bell, Moon, Globe, Shield, Info, Clock } from 'lucide-react';
import { useThemeStore, type Theme } from '../store/themeStore';
import { supabaseService } from '../services/supabaseService';
import { useAppStore } from '../store/appStore';

export const Settings: React.FC = () => {
  const { sessionCode, requireAuth } = useAppStore();
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    console.log('SETTINGS_MOUNT');
  }, []);

  // Load from DB on mount
  useEffect(() => {
    supabaseService.getSetting('reminderTime').then(val => {
      if (val) setReminderTime(val);
    }).catch(console.error);

    supabaseService.getSetting('reminderEnabled').then(val => {
      if (val !== null) setReminderEnabled(val === 'true');
    }).catch(console.error);
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setReminderTime(newTime);
    requireAuth(async () => {
      try {
        if (!sessionCode) return;
        await supabaseService.setSetting('reminderTime', newTime, sessionCode);
        showNotification('સેટિંગ સેવ થયું ✅');
      } catch (err) {
        console.error(err);
        showNotification('એડમિન ઍક્સેસ જરૂરી છે ❌');
      }
    });
  };

  const handleEnabledChange = (enabled: boolean) => {
    setReminderEnabled(enabled);
    requireAuth(async () => {
      try {
        if (!sessionCode) return;
        await supabaseService.setSetting('reminderEnabled', enabled ? 'true' : 'false', sessionCode);
        showNotification('સેટિંગ સેવ થયું ✅');
      } catch (err) {
        console.error(err);
        showNotification('એડમિન ઍક્સેસ જરૂરી છે ❌');
        setReminderEnabled(!enabled); // revert
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <AnimatePresence>
        {showToast && (
          <div className="fixed inset-x-4 bottom-24 z-[80] flex justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="w-full max-w-md rounded-2xl bg-card/95 backdrop-blur px-4 py-3 flex items-center gap-2 shadow-lg border border-brd/10"
            >
              <span className="flex-1 text-sm text-txt font-gujarati font-medium">{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-gujarati">{t('settings.title' as any)}</h2>
        <div className="text-xs font-gujarati bg-card px-3 py-1.5 rounded-full shadow-sm text-sub flex items-center gap-1.5">
          {useAppStore().sessionRole === 'admin' 
            ? 'એડમિન લૉગિન ✅' 
            : useAppStore().sessionRole === 'team' 
              ? 'ટીમ કોડ સક્રિય ✅' 
              : 'મહેમાન મોડ'}
        </div>
      </header>

      <div className="space-y-4">
        {/* Theme Settings */}
        <GlassCard className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-acc/10 flex items-center justify-center text-acc">
              <Moon size={20} />
            </div>
            <div>
              <div className="font-gujarati font-medium">{t('settings.theme' as any)}</div>
              <div className="text-xs text-sub font-gujarati mt-0.5">{t('settings.theme_desc' as any)}</div>
            </div>
          </div>
          <div className="inline-flex gap-2">
            {(['outdoor', 'dark', 'premium'] as Theme[]).map((tVal) => (
              <button
                key={tVal}
                onClick={() => setTheme(tVal)}
                className={`px-6 py-2.5 font-gujarati text-sm font-medium rounded-full  shadow-[inset_0_0_0_1px_rgb(var(--brd)/0.15)] ${
                  theme === tVal ? 'bg-acc text-white shadow-md' : 'bg-card text-sub hover:bg-black/5'
                }`}
              >
                {tVal === 'outdoor' ? 'આઉટડોર' : tVal === 'dark' ? 'ડાર્ક' : 'પ્રીમિયમ'}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Auth Link */}
        <GlassCard hoverEffect className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => useAppStore.setState({ authDialogOpen: true, authPendingAction: null })}>
          <div className="w-10 h-10 rounded-full bg-acc/10 flex items-center justify-center text-acc text-lg">
            🔑
          </div>
          <div className="font-gujarati font-medium">ટીમ કોડ દાખલ કરો / બદલો</div>
        </GlassCard>

        {/* Reminder Settings */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-acc/10 flex items-center justify-center text-acc">
                <Bell size={20} />
              </div>
              <div>
                <div className="font-gujarati font-medium">{t('settings.reminder' as any)}</div>
                {reminderEnabled && (
                  <button 
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className="text-xs text-acc font-num flex items-center gap-1 mt-0.5 hover:underline"
                  >
                    <Clock size={12} /> {reminderTime}
                  </button>
                )}
              </div>
            </div>
            <LiquidSwitch checked={reminderEnabled} onChange={handleEnabledChange} />
          </div>

          <AnimatePresence>
            {reminderEnabled && showTimePicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-brd/10 flex justify-between items-center">
                  <span className="text-sm text-sub font-gujarati">સમય પસંદ કરો</span>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={handleTimeChange}
                    className="bg-card rounded-md px-3 py-2 outline-none shadow-[inset_0_0_0_1px_rgb(var(--brd)/0.15)] font-num focus:shadow-[inset_0_0_0_2px_rgb(var(--acc))] transition-shadow text-txt"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Language Settings (Mock) */}
        <GlassCard className="p-4 flex items-center justify-between opacity-75">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sub/10 flex items-center justify-center text-sub">
              <Globe size={20} />
            </div>
            <div>
              <div className="font-gujarati font-medium">{t('settings.language' as any)}</div>
              <div className="text-xs text-sub font-gujarati">ગુજરાતી (ફિક્સ)</div>
            </div>
          </div>
        </GlassCard>

        {/* Admin Link */}
        <GlassCard hoverEffect className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin')}>
          <div className="w-10 h-10 rounded-full bg-acc/10 flex items-center justify-center text-acc">
            <Shield size={20} />
          </div>
          <div className="font-gujarati font-medium">{t('nav.admin' as any)}</div>
        </GlassCard>

        {/* Help Link */}
        <GlassCard hoverEffect className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/help')}>
          <div className="w-10 h-10 rounded-full bg-acc/10 flex items-center justify-center text-acc">
            <Info size={20} />
          </div>
          <div className="font-gujarati font-medium">{t('nav.help' as any)}</div>
        </GlassCard>

        {/* About */}
        <GlassCard className="p-4 flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-acc/10 flex items-center justify-center text-acc">
            <Info size={20} />
          </div>
          <div>
            <div className="font-gujarati font-medium">{t('settings.about' as any)}</div>
            <div className="text-xs text-sub font-num">v6.0.0</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
