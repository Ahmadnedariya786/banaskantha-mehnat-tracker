import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LiquidButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  active?: boolean;
  children?: React.ReactNode;
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant = 'primary', size = 'md', active, children, ...props }, ref) => {
    
    const baseClasses = cn(
      "relative overflow-hidden flex items-center justify-center font-medium rounded-full",
      "backdrop-blur-md",
      // Specular sheen (top highlight) ~12%
      "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/[0.12] before:to-transparent before:pointer-events-none",
      // Inset ring + depth shadow (no CSS border)
      "shadow-[inset_0_0_0_1px_rgb(var(--brd)/0.15),inset_0_-2px_10px_rgba(255,255,255,0.1),0_8px_32px_rgb(var(--shadow-color)/var(--shadow-alpha))]",
      " duration-300"
    );

    const sizeClasses = {
      sm: "h-8 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      icon: "h-11 w-11 p-0",
    };

    // Glow and fill colors based on variant
    const variantGlow = {
      primary: "from-blue-500/90 to-blue-600/80 shadow-blue-500/60",
      neutral: "from-white/40 to-slate-200/20 shadow-slate-400/40",
      success: "from-emerald-500/90 to-emerald-600/80 shadow-emerald-500/60",
      warning: "from-amber-400/90 to-amber-500/80 shadow-amber-500/60",
      danger: "from-red-500/90 to-red-600/80 shadow-red-500/60",
    };

    // Variant-specific ring colors (via box-shadow override where needed)
    const variantBorders = {
      primary: "",
      neutral: "",
      success: "",
      warning: "",
      danger: "",
    };

    const bgBase = active 
      ? `bg-gradient-to-t ${variantGlow[variant]}`
      : "bg-card/50";

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantBorders[variant],
          bgBase,
          active && `shadow-lg ${variantGlow[variant].split(' ')[2]}`, // add the shadow glow
          className
        )}
        {...props}
      >
        {/* Hover Liquid Fill Effect */}
        <div className={cn(
          "absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t pointer-events-none",
          variantGlow[variant]
        )} />
        
        <span className="relative z-10 flex items-center justify-center gap-2 w-full min-w-0 text-center">
          {children}
        </span>
      </motion.button>
    );
  }
);

LiquidButton.displayName = 'LiquidButton';
