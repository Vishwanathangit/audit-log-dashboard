import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import type { IAuditLog } from '../../types/log.types';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { formatTimestamp } from '../../utils/formatDate.util';

interface LogDetailsDialogProps {
  log: IAuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogDetailsDialog({ log, isOpen, onClose }: LogDetailsDialogProps) {
  if (!log) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>Detailed context for selected log entry.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4 text-sm">
          <div className="grid grid-cols-3 font-semibold border-b pb-1">
            <span className="col-span-1 text-muted-foreground">Field</span>
            <span className="col-span-2 text-foreground">Value</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="col-span-1 text-muted-foreground">ID</span>
            <span className="col-span-2 font-mono break-all text-xs">{log._id}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="col-span-1 text-muted-foreground">Actor</span>
            <span className="col-span-2 font-medium">{log.actor} ({log.role})</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="col-span-1 text-muted-foreground">Action</span>
            <span className="col-span-2">{log.action}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="col-span-1 text-muted-foreground">Resource</span>
            <span className="col-span-2 font-mono text-xs">{log.resource} ({log.resourceType})</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="col-span-1 text-muted-foreground">Severity</span>
            <span className="col-span-2">
              <SeverityBadge severity={log.severity} />
            </span>
          </div>
          <div className="grid grid-cols-3">
            <span className="col-span-1 text-muted-foreground">Status</span>
            <span className="col-span-2">
              <StatusBadge status={log.status} />
            </span>
          </div>
          <div className="grid grid-cols-3">
            <span className="col-span-1 text-muted-foreground">IP / Region</span>
            <span className="col-span-2">{log.ipAddress} ({log.region})</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="col-span-1 text-muted-foreground">Timestamp</span>
            <span className="col-span-2">{formatTimestamp(log.timestamp)}</span>
          </div>
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
