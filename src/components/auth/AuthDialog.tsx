import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { supabaseService } from '../../services/supabaseService';
import { GlassCard } from '../ui/GlassCard';
import { LiquidButton } from '../ui/LiquidButton';

export const AuthDialog: React.FC = () => {
  const { authDialogOpen, closeAuthDialog, setSession, authPendingAction } = useAppStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const role = await supabaseService.loginCode(code.trim().toUpperCase());
      if (role) {
        setSession(code.trim().toUpperCase(), role);
        showNotification('અનલૉક સફળ ✅');
        closeAuthDialog();
        if (authPendingAction) {
          authPendingAction();
        }
      } else {
        showNotification('અમાન્ય કોડ ❌');
      }
    } catch (err) {
      showNotification('ભૂલ આવી ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] glass-pill px-6 py-3 bg-card/95 text-txt font-medium whitespace-nowrap backdrop-blur-md pointer-events-none"
        >
          {toastMessage}
        </motion.div>
      )}
      {authDialogOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            onClick={closeAuthDialog}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <GlassCard className="w-[92%] max-w-sm rounded-2xl bg-card p-5 relative pointer-events-auto">
              <button 
                onClick={closeAuthDialog}
                className="absolute top-4 right-4 text-sub hover:text-txt transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-acc/10 text-acc flex items-center justify-center mb-4">
                  <Lock size={24} />
                </div>
                <h2 className="text-xl font-bold font-gujarati text-txt text-center">કોડ દાખલ કરો</h2>
                <p className="text-sm text-sub mt-2 text-center font-gujarati">
                  આ ક્રિયા માટે ઍક્સેસ કોડ જરૂરી છે.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="MT-XXXX-XXXX"
                  className="w-full bg-card rounded-md px-4 py-3 outline-none shadow-[inset_0_0_0_1px_rgb(var(--brd)/0.15)] font-num text-center focus:shadow-[inset_0_0_0_2px_rgb(var(--acc))] transition-shadow text-txt tracking-widest placeholder:tracking-normal uppercase"
                  disabled={loading}
                  autoFocus
                />
                
                <LiquidButton 
                  type="submit"
                  className="w-full mt-2" 
                  disabled={!code.trim() || loading}
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'અનલૉક કરો'}
                </LiquidButton>
              </form>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
