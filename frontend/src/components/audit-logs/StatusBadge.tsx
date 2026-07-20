import React from 'react';
import { Badge } from '../ui/badge';
import { STATUS_COLOR_MAP } from '../../constants/log.constants';
import type { IAuditLog } from '../../types/log.types';

interface StatusBadgeProps {
  status: IAuditLog['status'];
}

export const StatusBadge = React.memo(function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = STATUS_COLOR_MAP[status] || 'bg-secondary text-secondary-foreground';

  return (
    <Badge variant="outline" className={`font-semibold px-2.5 py-0.5 rounded-full ${colorClass}`}>
      {status}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';
