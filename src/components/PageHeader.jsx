import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

export const PageHeader = ({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-100 mb-6', className)} {...props}>
      <div className="flex-1 min-w-0">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-xs text-gray-400 mb-2 font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-300" />}
                {crumb.active ? (
                  <span className="text-gray-600 truncate max-w-[120px] md:max-w-[200px]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href || '#'}
                    className="hover:text-gray-600 transition-colors duration-150 truncate max-w-[120px] md:max-w-[200px]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-7">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-gray-500 mt-1 max-w-2xl font-normal">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 mt-4 md:mt-0 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
