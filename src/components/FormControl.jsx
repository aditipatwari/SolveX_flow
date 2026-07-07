import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

// 1. Label Component
export const Label = ({ className, error = false, children, ...props }) => (
  <label
    className={cn(
      'block text-xs font-semibold select-none mb-1.5 transition-colors',
      error ? 'text-rose-600' : 'text-gray-700',
      className
    )}
    {...props}
  >
    {children}
  </label>
);
Label.displayName = 'Label';

// 2. Input Component
export const Input = React.forwardRef(({
  className,
  type = 'text',
  error = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <div className="relative w-full flex items-center">
      {leftIcon && (
        <div className="absolute left-3 text-gray-400 pointer-events-none select-none flex items-center justify-center">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'w-full text-xs font-normal bg-white border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-gray-50/50',
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-gray-250 focus:border-primary-500 focus:ring-primary-500/20',
          leftIcon && 'pl-9.5',
          rightIcon && 'pr-9.5',
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 text-gray-400 pointer-events-none select-none flex items-center justify-center">
          {rightIcon}
        </div>
      )}
    </div>
  );
});
Input.displayName = 'Input';

// 3. Select Component
export const Select = React.forwardRef(({
  className,
  error = false,
  disabled = false,
  children,
  ...props
}, ref) => {
  return (
    <div className="relative w-full flex items-center">
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full text-xs font-normal bg-white border rounded-lg pl-3 pr-9 py-2 text-gray-800 appearance-none transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-gray-50/50',
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-gray-250 focus:border-primary-500 focus:ring-primary-500/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 text-gray-400 pointer-events-none select-none flex items-center justify-center">
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
});
Select.displayName = 'Select';

// 4. Textarea Component
export const Textarea = React.forwardRef(({
  className,
  error = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      disabled={disabled}
      className={cn(
        'w-full text-xs font-normal bg-white border rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-gray-50/50 min-h-[80px]',
        error
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-gray-250 focus:border-primary-500 focus:ring-primary-500/20',
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

// 5. Checkbox Component
export const Checkbox = React.forwardRef(({
  className,
  label,
  error = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <label className={cn('inline-flex items-center gap-2 select-none cursor-pointer text-xs font-medium text-gray-700', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className={cn(
          'rounded border-gray-350 text-primary-600 focus:ring-primary-500/20 focus:ring-2 h-3.5 w-3.5 transition-all',
          error && 'border-rose-350'
        )}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
});
Checkbox.displayName = 'Checkbox';

// 6. Radio Component
export const Radio = React.forwardRef(({
  className,
  label,
  error = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <label className={cn('inline-flex items-center gap-2 select-none cursor-pointer text-xs font-medium text-gray-700', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <input
        ref={ref}
        type="radio"
        disabled={disabled}
        className={cn(
          'border-gray-350 text-primary-600 focus:ring-primary-500/20 focus:ring-2 h-3.5 w-3.5 transition-all',
          error && 'border-rose-350'
        )}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
});
Radio.displayName = 'Radio';

// 7. Toggle / Switch Component (Framer Motion powered)
export const Toggle = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className,
  ...props
}) => {
  return (
    <label className={cn('inline-flex items-center gap-2.5 select-none cursor-pointer text-xs font-medium text-gray-700', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-1 shrink-0 select-none cursor-pointer',
          checked ? 'bg-primary-600' : 'bg-gray-200'
        )}
        {...props}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'absolute top-0.5 left-0.5 block h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]'
          )}
          style={{ x: checked ? 16 : 0 }}
        />
      </button>
      {label && <span>{label}</span>}
    </label>
  );
};
Toggle.displayName = 'Toggle';

// 8. FormHelperText Component
export const FormHelperText = ({ className, error = false, children, ...props }) => (
  <p
    className={cn(
      'text-[10px] mt-1.5 font-normal',
      error ? 'text-rose-600 font-medium' : 'text-gray-400',
      className
    )}
    {...props}
  >
    {children}
  </p>
);
FormHelperText.displayName = 'FormHelperText';
