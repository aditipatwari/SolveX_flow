import React from 'react';
import { cn } from '../utils/cn';

export const Table = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="w-full overflow-x-auto relative rounded-xl border border-gray-100/80 bg-white shadow-2xs">
      <table
        ref={ref}
        className={cn('w-full border-collapse text-left text-sm text-gray-600', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});
Table.displayName = 'Table';

export const TableHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn('border-b border-gray-150/60 bg-gray-50/60 backdrop-blur-xs', className)}
      {...props}
    >
      {children}
    </thead>
  );
});
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn('divide-y divide-gray-100/60', className)}
      {...props}
    >
      {children}
    </tbody>
  );
});
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn('border-t border-gray-150 bg-gray-50/40 font-medium text-gray-900', className)}
      {...props}
    >
      {children}
    </tfoot>
  );
});
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef(({ className, active = false, hoverable = true, children, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn(
        'transition-colors duration-150',
        hoverable && 'hover:bg-gray-50/40',
        active && 'bg-primary-50/20 hover:bg-primary-50/30',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
});
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef(({ className, children, align = 'left', ...props }, ref) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider select-none align-middle',
        alignments[align],
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
});
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef(({ className, children, align = 'left', numeric = false, ...props }, ref) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle text-xs text-gray-600',
        alignments[align],
        numeric && 'font-mono tabular-nums text-gray-700 font-medium',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
});
TableCell.displayName = 'TableCell';

export default Table;
