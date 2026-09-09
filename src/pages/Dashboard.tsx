import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { t } from '../i18n';
import { GlassCard } from '../components/ui/GlassCard';
import { Target, TrendingUp, Users } from 'lucide-react';
import { useAppStore } from '../store/appStore';

// Progress Ring Component
const ProgressRing: React.FC<{ progress: number, size?: number, strokeWidth?: number, color?: string, label?: string, subLabel?: string }> = ({ 
  progress, size = 120, strokeWidth = 12, color = 'var(--tw-colors-primary)', label, subLabel 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          className="text-sub"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute top-0 left-0 flex items-center justify-center pointer-events-none" style={{ width: size, height: size }}>
        <span className="font-num text-2xl font-bold text-txt">{Math.round(progress)}%</span>
      </div>
      {label && <span className="mt-4 font-gujarati font-medium text-sm text-center line-clamp-2 text-txt">{label}</span>}
      {subLabel && <span className="font-num text-xs text-sub">{subLabel}</span>}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { reports } = useAppStore();
  
  const totalStudents = useMemo(() => {
    return reports.reduce((sum, r) => sum + ((r.stats?.std_10 || 0) + (r.stats?.std_11 || 0) + (r.stats?.std_12 || 0) + (r.stats?.college || 0)), 0);
  }, [reports]);

  const ACTIVITY_KEYS = [
    { key: 'activity.namaz', value: 85 },
    { key: 'activity.mashwara_pabandi', value: 70 },
    { key: 'activity.taleem', value: 65 },
    { key: 'activity.gasht', value: 50 },
    { key: 'activity.panchkosa', value: 45 },
    { key: 'activity.shabguzari', value: 40 },
    { key: 'activity.mulaqat_percent', value: 60 },
    { key: 'activity.school_namaz', value: 30 },
    { key: 'activity.jamaat_3', value: 15 },
    { key: 'activity.jamaat_10', value: 5 },
    { key: 'activity.jamaat_40', value: 2 },
    { key: 'activity.jamaat_4m', value: 0 },
    { key: 'activity.mashwara_when_where', value: 90 }, // mock completion
  ];

  return (
    <div className="space-y-6 pb-12 relative">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-gujarati">{t('nav.dashboard')}</h2>
      </header>

      {/* Hero Stat */}
      <GlassCard 
        className="shadow-xl text-white p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgb(var(--grad-a)), rgb(var(--grad-b)))' }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-card rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="font-gujarati text-sub font-medium mb-1 text-white/80">{t('stat.students_count')}</h3>
            <div className="text-5xl font-num font-bold text-white">{totalStudents.toLocaleString('en-IN')}</div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2 font-num">
              <TrendingUp size={16} /> +0% 
              <span className="font-gujarati text-white/70 ml-1">ગયા માસ કરતા</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_0_0_1px_rgb(255_255_255/0.15)] overflow-hidden">
            <Users size={32} className="text-white" />
          </div>
        </div>
      </GlassCard>

      <div className="lg:flex lg:gap-6 lg:items-start w-full">
        <div className="lg:flex-1 space-y-6 w-full">
          {/* Progress Rings */}
          <section className="space-y-3">
            <h3 className="font-bold font-gujarati text-lg pl-1 flex items-center gap-2 text-txt">
              <Target size={20} className="text-acc" />
              {t('dashboard.vs_target' as any)}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <GlassCard className="p-4 flex justify-center py-6 bg-card">
                <ProgressRing 
                  progress={85} 
                  color="#3b82f6" 
                  label={t('activity.namaz')} 
                  subLabel="85/100" 
                />
              </GlassCard>
              <GlassCard className="p-4 flex justify-center py-6 bg-card">
                <ProgressRing 
                  progress={60} 
                  color="#f59e0b" 
                  label={t('activity.mulaqat_percent')} 
                  subLabel="60%" 
                />
              </GlassCard>
            </div>
          </section>
        </div>

        <div className="lg:flex-1 space-y-6 mt-6 lg:mt-0 w-full">
          {/* Activity Bar Chart Mockup (All 13 rows) */}
          <section className="space-y-3">
        <h3 className="font-bold font-gujarati text-lg pl-1 text-txt">
          પ્રવૃત્તિ સારાંશ (બધા હલકા)
        </h3>
        <GlassCard className="p-6 bg-card">
          <div className="space-y-5">
            {ACTIVITY_KEYS.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-gujarati font-medium text-sm text-txt line-clamp-1 pr-2">{t(item.key as any)}</span>
                  <span className="font-num font-bold text-sm text-sub shrink-0">{item.value}%</span>
                </div>
                <div className="h-2.5 w-full bg-card rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
          </section>
        </div>
      </div>
    </div>
  );
};
