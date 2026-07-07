import React from 'react';
import { cn } from '../utils/cn';

const variantStyles = {
  primary: {
    solid: 'bg-primary-600 border-primary-600 text-white',
    subtle: 'bg-primary-50 border-primary-100/80 text-primary-700',
    outline: 'bg-transparent border-primary-200 text-primary-700',
    dot: 'bg-primary-500'
  },
  neutral: {
    solid: 'bg-gray-800 border-gray-800 text-white',
    subtle: 'bg-gray-100 border-gray-250/60 text-gray-700',
    outline: 'bg-transparent border-gray-200 text-gray-600',
    dot: 'bg-gray-400'
  },
  success: {
    solid: 'bg-emerald-600 border-emerald-600 text-white',
    subtle: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    outline: 'bg-transparent border-emerald-250 text-emerald-700',
    dot: 'bg-emerald-500'
  },
  warning: {
    solid: 'bg-amber-600 border-amber-600 text-white',
    subtle: 'bg-amber-50 border-amber-100 text-amber-800',
    outline: 'bg-transparent border-amber-250 text-amber-700',
    dot: 'bg-amber-500'
  },
  danger: {
    solid: 'bg-rose-600 border-rose-600 text-white',
    subtle: 'bg-rose-50 border-rose-100 text-rose-800',
    outline: 'bg-transparent border-rose-250 text-rose-700',
    dot: 'bg-rose-500'
  },
  info: {
    solid: 'bg-sky-600 border-sky-600 text-white',
    subtle: 'bg-sky-50 border-sky-100 text-sky-800',
    outline: 'bg-transparent border-sky-200 text-sky-700',
    dot: 'bg-sky-500'
  },
  purple: {
    solid: 'bg-violet-600 border-violet-600 text-white',
    subtle: 'bg-violet-50 border-violet-100 text-violet-800',
    outline: 'bg-transparent border-violet-250 text-violet-700',
    dot: 'bg-violet-500'
  }
};

const sizes = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1 rounded-md font-medium border shadow-2xs',
  md: 'text-xs px-2 py-0.5 gap-1.5 rounded-md font-medium border shadow-2xs'
};

export const Badge = ({
  children,
  variant = 'neutral',
  styleType = 'subtle',
  size = 'sm',
  showDot = false,
  dotPulse = false,
  className,
  ...props
}) => {
  const selectedVariant = variantStyles[variant] || variantStyles.neutral;
  const configStyles = selectedVariant[styleType] || selectedVariant.subtle;
  const sizeStyle = sizes[size] || sizes.sm;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 select-none',
        sizeStyle,
        configStyles,
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full shrink-0',
            selectedVariant.dot,
            dotPulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
