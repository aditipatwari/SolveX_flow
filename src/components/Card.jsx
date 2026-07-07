import React from 'react';
import { cn } from '../utils/cn';

export const Card = React.forwardRef(({
  className,
  hoverable = false,
  glass = false,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white border border-gray-100 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_0_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden',
        hoverable && 'hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.06)] hover:border-gray-200 hover:-translate-y-[1px]',
        glass && 'glass bg-white/75 border-white/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }) => (
  <div
    className={cn(
      'px-6 py-5 border-b border-gray-100/80 flex items-center justify-between gap-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={cn(
      'text-base font-semibold text-gray-900 leading-none tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = ({ className, children, ...props }) => (
  <p
    className={cn(
      'text-xs text-gray-500 mt-1.5 leading-relaxed font-normal',
      className
    )}
    {...props}
  >
    {children}
  </p>
);
CardDescription.displayName = 'CardDescription';

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('px-6 py-5', className)} {...props}>
    {children}
  </div>
);
CardContent.displayName = 'CardContent';

export const CardFooter = ({ className, children, ...props }) => (
  <div
    className={cn(
      'px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-end gap-2.5',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
CardFooter.displayName = 'CardFooter';

export default Card;
