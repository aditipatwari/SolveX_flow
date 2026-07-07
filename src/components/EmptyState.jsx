import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './Button';

export const EmptyState = ({
  title = 'No data available',
  description = 'There are no items to display at the moment. Try adjusting your filters or creating a new entry.',
  icon: Icon = Sparkles,
  actionLabel,
  onActionClick,
  actionIcon,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-gray-200 rounded-xl bg-white shadow-2xs max-w-lg mx-auto',
        className
      )}
      {...props}
    >
      {/* Decorative Grid Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/80 to-white/95 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl border border-primary-100 shadow-3xs mb-4">
          <Icon className="h-6 w-6 shrink-0" />
        </div>

        <h3 className="text-base font-semibold text-gray-900 leading-6 tracking-tight">
          {title}
        </h3>
        
        <p className="text-xs text-gray-500 mt-2 max-w-sm leading-relaxed font-normal">
          {description}
        </p>

        {actionLabel && (
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={onActionClick}
              leftIcon={actionIcon}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
