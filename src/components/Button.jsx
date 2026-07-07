import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white border border-primary-700/60 shadow-[0_1px_2px_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(79,70,229,0.1)] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    secondary: 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-250/70 shadow-2xs focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-250 shadow-2xs focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    ghost: 'bg-transparent hover:bg-gray-100/80 text-gray-600 hover:text-gray-900 border border-transparent focus-visible:ring-2 focus-visible:ring-gray-200',
    danger: 'bg-rose-650 hover:bg-rose-700 text-white border border-rose-700/60 shadow-2xs focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2',
    purple: 'bg-violet-600 hover:bg-violet-700 text-white border border-violet-700/60 shadow-[0_1px_2px_0_rgba(0,0,0,0.08)] focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
    text: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline px-0 py-0 border-0 shadow-none focus-visible:ring-0 active:scale-100'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4.5 py-2.5 gap-2.5'
  };

  // If text variant, remove active scaling to feel like native link
  const tapScale = (disabled || isLoading || variant === 'text') ? 1 : 0.98;

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: tapScale }}
      className={cn(
        baseStyles,
        variants[variant],
        variant !== 'text' && sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />
      ) : (
        leftIcon && <span className="inline-flex items-center justify-center shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex items-center justify-center shrink-0">{rightIcon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
