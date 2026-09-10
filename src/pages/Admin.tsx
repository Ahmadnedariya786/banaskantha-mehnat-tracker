import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../i18n';
import { GlassCard } from '../components/ui/GlassCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { Shield, Users, Activity, Database, Lock, ChevronLeft, CheckCircle, Key, Trash2, Copy, Share2 } from 'lucide-react';
import { getLogs, clearLogs, type SystemLog, logActivity } from '../lib/utils';
import { useAppStore } from '../store/appStore';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { sessionCode, sessionRole, setSession, reports, halqas } = useAppStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeScreen, setActiveScreen] = useState<'main' | 'users' | 'logs'>('main');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Users screen state
  const [codes, setCodes] = useState<any[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newCodeLabel, setNewCodeLabel] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setIsLoading(true);
    try {
      const code = password.trim();
      const initSuccess = await supabaseService.setAdminCode(null, code);
      if (initSuccess) {
        setSession(code, 'admin');
        showNotification('એડમિન પાસવર્ડ સેટ થયો ✅');
      } else {
        const role = await supabaseService.loginCode(code);
        if (role === 'admin') {
          setSession(code, role);
          setError(false);
        } else {
          setError(true);
          setPassword('');
        }
      }
    } catch (err) {
      setError(true);
    }
    setIsLoading(false);
  };

  const loadCodes = async () => {
    if (sessionRole !== 'admin' || !sessionCode) return;
    try {
      const data = await supabaseService.listCodes(sessionCode);
      setCodes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      if (sessionRole === 'admin' && sessionCode) {
        try {
          const role = await supabaseService.loginCode(sessionCode);
          if (role !== 'admin' && mounted) {
            setSession(null, null);
          }
        } catch {
          if (mounted) setSession(null, null);
        }
      }
    };
    checkAuth();
    return () => { mounted = false; };
  }, [sessionCode, sessionRole, setSession]);

  useEffect(() => {
    if (activeScreen === 'users' && sessionRole === 'admin') {
      loadCodes();
    }
  }, [activeScreen, sessionRole]);

  const handleLogout = () => {
    if (window.confirm('શું તમે ખરેખર લૉગઆઉટ કરવા માંગો છો?')) {
      setSession(null, null);
      navigate('/');
    }
  };

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeLabel.trim() || !sessionCode) return;
    setIsLoading(true);
    try {
      const code = await supabaseService.generateCode(sessionCode, newCodeLabel.trim());
      setGeneratedCode(code);
      setNewCodeLabel('');
      await loadCodes();
    } catch (err) {
      showNotification('ભૂલ આવી ❌');
    }
    setIsLoading(false);
  };

  const handleRevokeCode = async (id: string) => {
    if (!sessionCode) return;
    if (!window.confirm('શું તમે ખરેખર આ કોડ રદ કરવા માંગો છો?')) return;
    try {
      await supabaseService.revokeCode(sessionCode, id);
      showNotification('કોડ રદ કરાયેલ છે');
      loadCodes();
    } catch (err) {
      showNotification('ભૂલ આવી ❌');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('કોપી થઈ ગયું ✅');
  };

  const handleBackup = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      reports,
      halqas,
      settings: {}
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const filename = `backup_${new Date().toISOString().split('T')[0]}.json`;
    (window as any).AndroidPrepareDownload?.(filename, 'application/json');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
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

  if (sessionRole === 'team') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <GlassCard className="w-full max-w-sm p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-acc/10 rounded-full flex items-center justify-center mx-auto text-acc mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold font-gujarati text-txt">ઍક્સેસ નથી</h2>
          <p className="text-sm font-gujarati text-sub mb-6">આ પેજ માત્ર એડમિન માટે છે.</p>
          <LiquidButton onClick={() => window.history.back()} className="w-full" type="button">
            પાછા જાઓ
          </LiquidButton>
        </GlassCard>
      </div>
    );
  }

  if (!sessionRole) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <GlassCard className="w-full max-w-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-acc/10 rounded-full flex items-center justify-center mx-auto text-acc mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold font-gujarati">એડમિન લૉગિન</h2>
            <p className="text-sm font-gujarati text-sub">પ્રથમ વખત લોગિન કરતા હોવ તો નવો પાસવર્ડ સેટ કરો, અન્યથા તમારો એડમિન કોડ દાખલ કરો.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="એડમિન પાસવર્ડ"
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
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold font-gujarati flex items-center gap-2">
                <Shield className="text-acc" />
                {t('admin.dashboard_title' as any)}
              </h2>
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full text-xs font-gujarati font-medium whitespace-nowrap">
                એડમિન લૉગિન ✅
              </span>
            </div>
            <button onClick={handleLogout} className="text-sm font-gujarati bg-card hover:bg-card/80 border border-brd/10 px-3 py-1.5 rounded-full text-txt transition-colors">
              🔒 લૉગઆઉટ
            </button>
          </header>

          <div className="grid grid-cols-2 gap-4">
            <GlassCard onClick={() => setActiveScreen('users')} hoverEffect className="cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[160px] max-h-[220px]">
              <Users size={32} className="text-acc" />
              <span className="font-gujarati font-medium text-sm">🔑 પાસવર્ડ મેનેજ કરો</span>
            </GlassCard>

            <GlassCard onClick={openLogs} hoverEffect className="cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[160px] max-h-[220px]">
              <Activity size={32} className="text-sub" />
              <span className="font-gujarati font-medium text-sm">{t('admin.system_logs' as any)}</span>
            </GlassCard>

            <GlassCard onClick={handleBackup} hoverEffect className="cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[160px] max-h-[220px]">
              <Database size={32} className="text-sub" />
              <span className="font-gujarati font-medium text-sm">{t('settings.data_backup' as any)}</span>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {activeScreen === 'users' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 relative">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveScreen('main')} className="w-10 h-10 flex items-center justify-center rounded-full glass-panel text-sub">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-bold font-gujarati">{t('admin.manage_users' as any)}</h2>
            </div>
            <LiquidButton onClick={() => setShowGenerateModal(true)} size="sm" className="font-gujarati flex gap-2">
              <Key size={16} /> 🔑 નવો પાસવર્ડ
            </LiquidButton>
          </header>
          
          <div className="space-y-4">
            {codes.map(c => (
              <GlassCard key={c.id} className={`p-4 flex items-center justify-between ${c.revoked_at ? 'opacity-50 grayscale' : ''}`}>
                <div>
                  <div className="font-gujarati font-bold text-txt flex items-center gap-2">
                    {c.label}
                    {c.revoked_at && <span className="bg-acc/10 text-acc border border-acc/20 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">રદ થયેલ</span>}
                  </div>
                  <div className="font-num text-sm text-sub mt-1">
                    {c.masked || 'MT-****-****'} 
                    <span className="font-gujarati ml-2 text-xs">({new Date(c.created_at).toLocaleDateString('en-IN')})</span>
                  </div>
                </div>
                {!c.revoked_at ? (
                  <button onClick={() => handleRevokeCode(c.id)} className="w-10 h-10 rounded-full bg-acc/10 text-acc flex items-center justify-center hover:bg-acc hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <div className="text-xs text-acc font-gujarati text-right">
                    {new Date(c.revoked_at).toLocaleDateString('en-IN')}
                  </div>
                )}
              </GlassCard>
            ))}
            {codes.length === 0 && (
              <div className="text-center text-sub py-8 font-gujarati">કોઈ ટીમ કોડ નથી</div>
            )}
          </div>

          <AnimatePresence>
            {showGenerateModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget && !generatedCode) setShowGenerateModal(false); }}>
                <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="w-[92%] max-w-sm rounded-2xl bg-card p-5 text-center shadow-2xl border border-brd/10">
                  {generatedCode ? (
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={32} />
                      </div>
                      <div>
                        <h3 className="font-gujarati font-bold text-lg text-txt">નવો કોડ તૈયાર છે</h3>
                        <p className="text-sub text-sm font-gujarati mt-1">આ કોડ એક જ વાર દેખાશે. યુઝરને મોકલી આપો.</p>
                      </div>
                      <div className="bg-card/50 py-3 px-4 rounded-xl border border-brd/10 font-num text-xl font-bold tracking-widest text-txt">
                        {generatedCode}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <LiquidButton variant="neutral" onClick={() => copyToClipboard(generatedCode)}>
                          <Copy size={18} className="mr-2" /> કૉપિ
                        </LiquidButton>
                        <LiquidButton onClick={() => {
                          const text = `તમારો રિપોર્ટિંગ કોડ: ${generatedCode}`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                        }}>
                          <Share2 size={18} className="mr-2" /> શેર
                        </LiquidButton>
                      </div>
                      <button onClick={() => { setGeneratedCode(null); setShowGenerateModal(false); }} className="text-sm font-gujarati text-sub underline pt-2 inline-block">બંધ કરો</button>
                    </div>
                  ) : (
                    <form onSubmit={handleGenerateCode} className="space-y-4">
                      <h3 className="font-gujarati font-bold text-lg text-txt">નવો પાસવર્ડ બનાવો</h3>
                      <input
                        type="text"
                        value={newCodeLabel}
                        onChange={e => setNewCodeLabel(e.target.value)}
                        placeholder="કોડ કોને આપ્યો? નામ લખો"
                        className="w-full bg-card/50 rounded-xl px-4 py-3 outline-none border border-brd/10 font-gujarati focus:border-acc text-txt"
                        required
                        autoFocus
                      />
                      <div className="flex gap-3 pt-2">
                        <LiquidButton type="button" variant="neutral" className="flex-1" onClick={() => setShowGenerateModal(false)}>
                          રદ કરો
                        </LiquidButton>
                        <LiquidButton type="submit" className="flex-1" disabled={isLoading || !newCodeLabel.trim()}>
                          બનાવો
                        </LiquidButton>
                      </div>
                    </form>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
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
