import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';

const alertConfig = {
  info: {
    bg: 'bg-sky-50/40 border-sky-100 text-sky-850',
    icon: Info,
    iconColor: 'text-sky-500'
  },
  success: {
    bg: 'bg-emerald-50/40 border-emerald-100 text-emerald-850',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500'
  },
  warning: {
    bg: 'bg-amber-50/40 border-amber-100 text-amber-850',
    icon: AlertTriangle,
    iconColor: 'text-amber-500'
  },
  danger: {
    bg: 'bg-rose-50/40 border-rose-100 text-rose-850',
    icon: AlertCircle,
    iconColor: 'text-rose-550'
  }
};

export const Alert = ({
  variant = 'info',
  title,
  description,
  onClose,
  action,
  icon: CustomIcon,
  className,
  ...props
}) => {
  const config = alertConfig[variant] || alertConfig.info;
  const Icon = CustomIcon || config.icon;

  return (
    <div
      className={cn(
        'relative flex items-start gap-3.5 p-4 rounded-xl border shadow-3xs',
        config.bg,
        className
      )}
      {...props}
    >
      <div className={cn('shrink-0 mt-0.5', config.iconColor)}>
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div className="flex-1 space-y-1">
        {title && (
          <h4 className="text-xs font-semibold text-gray-900 leading-none">
            {title}
          </h4>
        )}
        {description && (
          <p className="text-xs text-gray-500 leading-relaxed font-normal">
            {description}
          </p>
        )}
        {action && (
          <div className="pt-2">
            {action}
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 text-gray-400 hover:text-gray-600 rounded-md p-1 hover:bg-black/5 transition-all select-none focus:outline-none"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
