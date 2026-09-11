import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LiquidSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const LiquidSwitch: React.FC<LiquidSwitchProps> = ({ checked, onChange, className }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-14 h-8 rounded-full backdrop-blur-md shadow-[inset_0_0_0_1px_rgb(var(--brd)/0.15),inset_0_2px_4px_rgba(0,0,0,0.1)]  duration-300 overflow-hidden",
        checked ? "bg-acc" : "bg-card",
        className
      )}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "absolute top-1 bottom-1 w-6 rounded-full shadow-md flex items-center justify-center backdrop-blur-md bg-card",
          checked ? "left-[calc(100%-1.75rem)]" : "left-1"
        )}
      >
        {/* Specular sheen on knob */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none" />
      </motion.div>
      
      {/* Liquid Fill Overlay on track */}
      {checked && (
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-acc/50 to-transparent pointer-events-none" />
      )}
    </button>
  );
};
