import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../utils/cn';

// 1. ProgressBar component
export const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md', // sm, md, lg
  variant = 'primary', // primary, success, warning, danger
  showValue = false,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variants = {
    primary: 'bg-primary-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500'
  };

  return (
    <div className={cn('w-full flex items-center gap-3', className)} {...props}>
      <div className="flex-1 bg-gray-100 border border-gray-250/30 rounded-full overflow-hidden">
        <div
          className={cn('rounded-full transition-all duration-500 ease-out', sizes[size], variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="text-[10px] font-bold text-gray-500 tabular-nums shrink-0">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
ProgressBar.displayName = 'ProgressBar';

// 2. ProgressRing component
export const ProgressRing = ({
  value = 0,
  max = 100,
  radius = 18,
  strokeWidth = 3.5,
  variant = 'primary',
  showValue = true,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variants = {
    primary: 'stroke-primary-600',
    success: 'stroke-emerald-500',
    warning: 'stroke-amber-500',
    danger: 'stroke-rose-500'
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center select-none', className)} {...props}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        {/* Track circle */}
        <circle
          className="stroke-gray-100 fill-transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          className={cn('fill-transparent transition-all duration-500 ease-out', variants[variant])}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {showValue && (
        <div className="absolute text-[10px] font-bold text-gray-650 tabular-nums">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};
ProgressRing.displayName = 'ProgressRing';

// 3. StepsIndicator component
export const StepsIndicator = ({
  steps = [],
  currentStep = 0, // 0-indexed
  className,
  ...props
}) => {
  return (
    <div className={cn('flex items-center w-full justify-between select-none', className)} {...props}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        const label = typeof step === 'string' ? step : step.label;

        return (
          <React.Fragment key={idx}>
            {/* Step node */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center border font-semibold text-xs transition-all duration-300',
                  isCompleted && 'bg-emerald-50 border-emerald-200 text-emerald-600',
                  isActive && 'bg-primary-50 border-primary-300 text-primary-600 ring-2 ring-primary-100',
                  !isCompleted && !isActive && 'bg-white border-gray-200 text-gray-400'
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 stroke-[3px]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold mt-1.5 whitespace-nowrap',
                  isCompleted && 'text-gray-700',
                  isActive && 'text-primary-750 font-bold',
                  !isCompleted && !isActive && 'text-gray-400'
                )}
              >
                {label}
              </span>
            </div>

            {/* Connecting line */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-gray-100 rounded-full overflow-hidden relative -translate-y-2.5">
                <div
                  className={cn(
                    'h-full bg-emerald-400 transition-all duration-500 ease-out',
                    idx < currentStep - 1 && 'w-full',
                    idx === currentStep - 1 && 'w-1/2 animate-pulse bg-primary-400',
                    idx >= currentStep && 'w-0'
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
StepsIndicator.displayName = 'StepsIndicator';

// 4. Spinner component
export const Spinner = ({
  size = 'md', // sm, md, lg
  className,
  ...props
}) => {
  const sizes = {
    sm: 'h-4 w-4 stroke-2',
    md: 'h-6 w-6 stroke-2',
    lg: 'h-8 w-8 stroke-[2.5]'
  };

  return (
    <svg
      className={cn('animate-spin text-primary-600', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-15"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
Spinner.displayName = 'Spinner';
