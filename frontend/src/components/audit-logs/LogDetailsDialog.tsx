import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import type { IAuditLog } from '../../types/log.types';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { formatTimestamp } from '../../utils/formatDate.util';

interface LogDetailsDialogProps {
  log: IAuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LogDetailsDialog({ log, open, onOpenChange }: LogDetailsDialogProps) {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Audit Log Details</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Complete details and metadata for this audit trail entry.
          </DialogDescription>
        </DialogHeader>

        {/* Clean key-value grid layout */}
        <div className="grid gap-3 py-4 text-sm max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Log ID</span>
            <span className="col-span-2 font-mono text-xs select-all text-foreground break-all">{log._id}</span>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actor</span>
            <span className="col-span-2 font-medium text-foreground">{log.actor}</span>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</span>
            <span className="col-span-2 text-foreground">{log.role}</span>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</span>
            <span className="col-span-2 font-mono text-xs text-foreground bg-muted/40 px-1.5 py-0.5 rounded w-fit">{log.action}</span>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resource</span>
            <span className="col-span-2 font-mono text-xs text-foreground break-all">{log.resource}</span>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resource Type</span>
            <span className="col-span-2 text-foreground">{log.resourceType}</span>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Severity</span>
            <div className="col-span-2">
              <SeverityBadge severity={log.severity} />
            </div>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
            <div className="col-span-2">
              <StatusBadge status={log.status} />
            </div>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">IP Address</span>
            <span className="col-span-2 font-mono text-xs text-foreground">{log.ipAddress}</span>
          </div>
          <div className="grid grid-cols-3 items-center border-b border-border/40 pb-2">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Region</span>
            <span className="col-span-2 text-foreground">{log.region}</span>
          </div>
          <div className="grid grid-cols-3 items-center pb-1">
            <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timestamp</span>
            <span className="col-span-2 text-foreground">{formatTimestamp(log.timestamp)}</span>
          </div>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
