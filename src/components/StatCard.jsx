import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from './Card';
import { cn } from '../utils/cn';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconClassName,
  change,
  changeType = 'neutral', // 'positive' | 'negative' | 'neutral'
  timeframe = 'vs last month',
  className,
  ...props
}) => {
  return (
    <Card className={cn('overflow-hidden hoverable', className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          {Icon && (
            <div className={cn(
              'p-2 rounded-lg bg-gray-50 text-gray-600',
              iconClassName
            )}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {value}
          </h3>
          
          <div className="flex items-center gap-1.5 mt-2">
            {changeType === 'positive' && (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <TrendingUp className="h-3 w-3 mr-1" />
                {change}
              </span>
            )}
            {changeType === 'negative' && (
              <span className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                <TrendingDown className="h-3 w-3 mr-1" />
                {change}
              </span>
            )}
            {changeType === 'neutral' && (
              <span className="inline-flex items-center text-xs font-semibold text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">
                <Minus className="h-3 w-3 mr-1" />
                {change || '0%'}
              </span>
            )}
            <span className="text-xs text-gray-400 font-medium">
              {timeframe}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
