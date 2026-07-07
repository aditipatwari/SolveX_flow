import React from 'react';
import { cn } from '../utils/cn';

export const LoadingSkeleton = ({
  variant = 'line', // 'line' | 'title' | 'circle' | 'avatar' | 'rect'
  className,
  count = 1,
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full h-10 w-10 bg-gray-200/80';
      case 'avatar':
        return 'rounded-lg h-9 w-9 bg-gray-200/80';
      case 'title':
        return 'h-5 w-2/3 bg-gray-200/85 rounded-md';
      case 'rect':
        return 'h-32 w-full bg-gray-200/70 rounded-xl';
      case 'line':
      default:
        return 'h-3.5 w-full bg-gray-200/70 rounded-md';
    }
  };

  const skeletons = Array.from({ length: count });

  if (count > 1) {
    return (
      <div className="flex flex-col gap-2.5 w-full animate-pulse">
        {skeletons.map((_, idx) => (
          <div
            key={idx}
            className={cn(getStyles(), className)}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('animate-pulse', getStyles(), className)}
      {...props}
    />
  );
};

export default LoadingSkeleton;
