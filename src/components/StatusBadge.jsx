import React from 'react';
import { Badge } from './Badge';

const statusMap = {
  pending: { variant: 'warning', label: 'Pending', pulse: false },
  'in-progress': { variant: 'primary', label: 'In Progress', pulse: true },
  completed: { variant: 'success', label: 'Completed', pulse: false },
  cancelled: { variant: 'neutral', label: 'Cancelled', pulse: false },
  failed: { variant: 'danger', label: 'Failed', pulse: false },
  warning: { variant: 'warning', label: 'Warning', pulse: false }
};

export const StatusBadge = ({
  status = 'pending',
  customLabel,
  showDot = true,
  className,
  ...props
}) => {
  const normalizedStatus = status.toLowerCase();
  const config = statusMap[normalizedStatus] || statusMap.pending;

  return (
    <Badge
      variant={config.variant}
      showDot={showDot}
      dotPulse={config.pulse}
      className={className}
      {...props}
    >
      {customLabel || config.label}
    </Badge>
  );
};
