import React from 'react';
import { Badge } from '../ui/badge';
import { SEVERITY_COLOR_MAP } from '../../constants/log.constants';
import type { IAuditLog } from '../../types/log.types';

interface SeverityBadgeProps {
  severity: IAuditLog['severity'];
}

export const SeverityBadge = React.memo(function SeverityBadge({ severity }: SeverityBadgeProps) {
  const colorClass = SEVERITY_COLOR_MAP[severity] || 'bg-secondary text-secondary-foreground';
  
  return (
    <Badge variant="outline" className={`font-semibold capitalize px-2.5 py-0.5 rounded-full ${colorClass}`}>
      {severity.toLowerCase()}
    </Badge>
  );
});

SeverityBadge.displayName = 'SeverityBadge';
