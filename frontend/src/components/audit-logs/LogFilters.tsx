import { useLogStore } from '../../store/logStore';
import { SEVERITY_LEVELS, LOG_STATUS, RESOURCE_TYPES } from '../../constants/log.constants';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import DateRangePicker from '../common/DateRangePicker';

export default function LogFilters() {
  // Subscribe strictly to the relevant filter values and setFilters action
  const search = useLogStore((state) => state.filters.search);
  const severity = useLogStore((state) => state.filters.severity);
  const status = useLogStore((state) => state.filters.status);
  const resourceType = useLogStore((state) => state.filters.resourceType);
  const region = useLogStore((state) => state.filters.region);
  const action = useLogStore((state) => state.filters.action);
  const actor = useLogStore((state) => state.filters.actor);
  const startDate = useLogStore((state) => state.filters.startDate);
  const endDate = useLogStore((state) => state.filters.endDate);
  const setFilters = useLogStore((state) => state.setFilters);

  // Clears all filters in a single operation
  const handleClearAll = () => {
    setFilters({
      search: undefined,
      severity: undefined,
      status: undefined,
      resourceType: undefined,
      region: undefined,
      action: undefined,
      actor: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const hasActiveFilters = 
    (search !== undefined && search !== '') ||
    severity !== undefined ||
    status !== undefined ||
    resourceType !== undefined ||
    (region !== undefined && region !== '') ||
    (action !== undefined && action !== '') ||
    (actor !== undefined && actor !== '') ||
    startDate !== undefined ||
    endDate !== undefined;

  return (
    <div className="grid gap-4 p-5 rounded-lg border border-border bg-card shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Severity filter Select */}
        <div className="space-y-1.5">
          <label htmlFor="severity-select" className="text-xs font-semibold text-muted-foreground">Severity</label>
          <Select
            value={severity || "ALL"}
            onValueChange={(val) => setFilters({ severity: val === "ALL" ? undefined : (val as any) })}
          >
            <SelectTrigger id="severity-select" className="bg-background text-foreground">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Severities</SelectItem>
              {SEVERITY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status filter Select */}
        <div className="space-y-1.5">
          <label htmlFor="status-select" className="text-xs font-semibold text-muted-foreground">Status</label>
          <Select
            value={status || "ALL"}
            onValueChange={(val) => setFilters({ status: val === "ALL" ? undefined : (val as any) })}
          >
            <SelectTrigger id="status-select" className="bg-background text-foreground">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {LOG_STATUS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Resource Type filter Select */}
        <div className="space-y-1.5">
          <label htmlFor="resourcetype-select" className="text-xs font-semibold text-muted-foreground">Resource Type</label>
          <Select
            value={resourceType || "ALL"}
            onValueChange={(val) => setFilters({ resourceType: val === "ALL" ? undefined : (val as any) })}
          >
            <SelectTrigger id="resourcetype-select" className="bg-background text-foreground">
              <SelectValue placeholder="All Resource Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Resource Types</SelectItem>
              {RESOURCE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action input filter */}
        <div className="space-y-1.5">
          <label htmlFor="action-input" className="text-xs font-semibold text-muted-foreground">Action</label>
          <Input
            id="action-input"
            type="text"
            placeholder="e.g. USER_LOGIN"
            value={action || ''}
            onChange={(e) => setFilters({ action: e.target.value || undefined })}
            className="bg-background text-foreground"
          />
        </div>

        {/* Region input filter */}
        <div className="space-y-1.5">
          <label htmlFor="region-input" className="text-xs font-semibold text-muted-foreground">Region</label>
          <Input
            id="region-input"
            type="text"
            placeholder="e.g. us-east-1"
            value={region || ''}
            onChange={(e) => setFilters({ region: e.target.value || undefined })}
            className="bg-background text-foreground"
          />
        </div>

        {/* Date Range Picker */}
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="date-picker-trigger" className="text-xs font-semibold text-muted-foreground">Date Range</label>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => setFilters({ startDate: start, endDate: end })}
          />
        </div>
      </div>

      {/* Action panel */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2 border-t border-border/60">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs font-semibold text-destructive border-destructive/50 hover:bg-destructive/10 flex items-center gap-1.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5 shrink-0" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
