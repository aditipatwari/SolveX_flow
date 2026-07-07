import React from 'react';
import { cn } from '../utils/cn';

export const Timeline = ({ className, children, ...props }) => {
  return (
    <div className={cn('relative space-y-6', className)} {...props}>
      {children}
    </div>
  );
};
Timeline.displayName = 'Timeline';

export const TimelineItem = ({
  title,
  time,
  icon: Icon,
  badge,
  children,
  active = false,
  isLast = false,
  className,
  ...props
}) => {
  return (
    <div className={cn('relative pl-7 text-xs', className)} {...props}>
      {/* Vertical line connector */}
      {!isLast && (
        <span
          className={cn(
            'absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-100 rounded-full',
            active && 'bg-primary-100'
          )}
        />
      )}

      {/* Bullet / Dot node */}
      <span
        className={cn(
          'absolute left-0 top-0.5 h-6 w-6 rounded-full flex items-center justify-center border transition-all duration-350 select-none',
          active
            ? 'bg-primary-50 border-primary-300 text-primary-600 ring-2 ring-primary-100'
            : 'bg-white border-gray-200 text-gray-400'
        )}
      >
        {Icon ? (
          <Icon className="h-3 w-3 shrink-0" />
        ) : (
          <span className={cn('h-1.5 w-1.5 rounded-full transition-colors', active ? 'bg-primary-600' : 'bg-gray-300')} />
        )}
      </span>

      {/* Event Details */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-800 leading-none">{title}</span>
          {badge && <span className="inline-flex shrink-0">{badge}</span>}
          {time && <span className="text-[10px] text-gray-400 font-medium tabular-nums ml-auto shrink-0">{time}</span>}
        </div>
        {children && (
          <div className="text-[11px] text-gray-500 leading-relaxed font-normal pt-0.5">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
TimelineItem.displayName = 'TimelineItem';

export default Timeline;
