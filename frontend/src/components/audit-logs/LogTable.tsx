import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import type { IAuditLog } from '../../types/log.types';
import { useLogStore } from '../../store/logStore';
import { formatTimestamp } from '../../utils/formatDate.util';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import LogTableSkeleton from './LogTableSkeleton';
import LogDetailsDialog from './LogDetailsDialog';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const LogTable = React.memo(function LogTable() {
  // Subscribe strictly to data, loading, sort state, and sort actions
  const logs = useLogStore((state) => state.logs);
  const isLoading = useLogStore((state) => state.isLoading);
  const sortBy = useLogStore((state) => state.sortBy);
  const sortOrder = useLogStore((state) => state.sortOrder);
  const setSort = useLogStore((state) => state.setSort);
  const page = useLogStore((state) => state.page);
  const limit = useLogStore((state) => state.limit);

  // Local state to control the details modal view
  const [selectedLog, setSelectedLog] = React.useState<IAuditLog | null>(null);

  // Sorting helper
  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      setSort(columnId, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(columnId, 'desc');
    }
  };

  const getSortIcon = (columnId: string) => {
    if (sortBy !== columnId) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/60 shrink-0" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary shrink-0" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary shrink-0" />
    );
  };

  // Define Columns
  const columns = React.useMemo<ColumnDef<IAuditLog>[]>(() => [
    {
      id: 'sno',
      header: () => <span className="font-semibold text-foreground text-center block w-12">S.No</span>,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-center block w-12 font-mono text-xs">
          {(page - 1) * limit + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('timestamp')}
          className="-ml-3 h-8 text-foreground font-semibold hover:bg-accent/40"
        >
          Timestamp
          {getSortIcon('timestamp')}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatTimestamp(row.original.timestamp)}
        </span>
      ),
    },
    {
      accessorKey: 'actor',
      header: () => <span className="font-semibold text-foreground">Actor</span>,
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.actor}</span>,
    },
    {
      accessorKey: 'role',
      header: () => <span className="font-semibold text-foreground">Role</span>,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.role}</span>,
    },
    {
      accessorKey: 'action',
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('action')}
          className="-ml-3 h-8 text-foreground font-semibold hover:bg-accent/40"
        >
          Action
          {getSortIcon('action')}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-muted/60 px-1.5 py-0.5 rounded border border-border/40 text-foreground">
          {row.original.action}
        </span>
      ),
    },
    {
      accessorKey: 'resource',
      header: () => <span className="font-semibold text-foreground">Resource</span>,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground break-all max-w-50 inline-block">
          {row.original.resource}
        </span>
      ),
    },
    {
      accessorKey: 'resourceType',
      header: () => <span className="font-semibold text-foreground">Type</span>,
      cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.resourceType}</span>,
    },
    {
      accessorKey: 'ipAddress',
      header: () => <span className="font-semibold text-foreground">IP Address</span>,
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.ipAddress}</span>,
    },
    {
      accessorKey: 'region',
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('region')}
          className="-ml-3 h-8 text-foreground font-semibold hover:bg-accent/40"
        >
          Region
          {getSortIcon('region')}
        </Button>
      ),
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.region}</span>,
    },
    {
      accessorKey: 'severity',
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('severity')}
          className="-ml-3 h-8 text-foreground font-semibold hover:bg-accent/40"
        >
          Severity
          {getSortIcon('severity')}
        </Button>
      ),
      cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
    },
    {
      accessorKey: 'status',
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('status')}
          className="-ml-3 h-8 text-foreground font-semibold hover:bg-accent/40"
        >
          Status
          {getSortIcon('status')}
        </Button>
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: () => <span className="font-semibold text-foreground">Actions</span>,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedLog(row.original)}
          className="h-8 font-medium hover:bg-accent"
        >
          Investigate
        </Button>
      ),
    },
  ], [page, limit, sortBy, sortOrder, setSort]);

  // Configure TanStack React Table
  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  // Only show full skeleton screen on very first load
  if (isLoading && logs.length === 0) {
    return <LogTableSkeleton />;
  }

  return (
    <div className="w-full relative min-h-125">
      {/* Scrollable Container to maintain layout responsiveness on small viewports */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto shadow-sm">
        <Table className="min-w-250">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground font-medium"
                >
                  No logs found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Semi-transparent loading overlay screen during background refetches */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10 transition-opacity">
          <div className="flex flex-col items-center gap-2 bg-popover/80 border border-border px-6 py-4 rounded-lg shadow-lg backdrop-blur-xs">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-semibold text-muted-foreground">Refreshing logs...</span>
          </div>
        </div>
      )}

      {/* Controlled Dialog for audit details */}
      <LogDetailsDialog
        log={selectedLog}
        open={selectedLog !== null}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      />
    </div>
  );
});

LogTable.displayName = 'LogTable';

export default LogTable;
