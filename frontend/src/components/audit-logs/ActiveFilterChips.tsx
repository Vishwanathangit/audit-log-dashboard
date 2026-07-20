import { X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useLogStore } from '../../store/logStore';
import { format, parseISO, isValid } from 'date-fns';

export default function ActiveFilterChips() {
  // Subscribe strictly to the filters object and setFilters action
  const filters = useLogStore((state) => state.filters);
  const setFilters = useLogStore((state) => state.setFilters);

  const chips = [];

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `Search: "${filters.search}"`,
      onClear: () => setFilters({ search: undefined }),
    });
  }
  if (filters.severity) {
    chips.push({
      key: 'severity',
      label: `Severity: ${filters.severity}`,
      onClear: () => setFilters({ severity: undefined }),
    });
  }
  if (filters.status) {
    chips.push({
      key: 'status',
      label: `Status: ${filters.status}`,
      onClear: () => setFilters({ status: undefined }),
    });
  }
  if (filters.resourceType) {
    chips.push({
      key: 'resourceType',
      label: `Type: ${filters.resourceType}`,
      onClear: () => setFilters({ resourceType: undefined }),
    });
  }
  if (filters.region) {
    chips.push({
      key: 'region',
      label: `Region: ${filters.region}`,
      onClear: () => setFilters({ region: undefined }),
    });
  }
  if (filters.action) {
    chips.push({
      key: 'action',
      label: `Action: ${filters.action}`,
      onClear: () => setFilters({ action: undefined }),
    });
  }
  if (filters.actor) {
    chips.push({
      key: 'actor',
      label: `Actor: ${filters.actor}`,
      onClear: () => setFilters({ actor: undefined }),
    });
  }
  
  if (filters.startDate || filters.endDate) {
    let dateStr = 'Date Range';
    if (filters.startDate && filters.endDate) {
      try {
        const start = parseISO(filters.startDate);
        const end = parseISO(filters.endDate);
        if (isValid(start) && isValid(end)) {
          dateStr = `${format(start, 'dd MMM yy')} - ${format(end, 'dd MMM yy')}`;
        }
      } catch (e) {
        dateStr = 'Custom Date';
      }
    } else if (filters.startDate) {
      try {
        const start = parseISO(filters.startDate);
        if (isValid(start)) dateStr = `After ${format(start, 'dd MMM yy')}`;
      } catch (e) {}
    } else if (filters.endDate) {
      try {
        const end = parseISO(filters.endDate);
        if (isValid(end)) dateStr = `Before ${format(end, 'dd MMM yy')}`;
      } catch (e) {}
    }

    chips.push({
      key: 'dateRange',
      label: dateStr,
      onClear: () => setFilters({ startDate: undefined, endDate: undefined }),
    });
  }

  // If no filters are active, render nothing
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center min-h-8">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1 select-none">
        Active Filters
      </span>
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-medium border border-border bg-muted/65 hover:bg-muted/80 transition-colors text-foreground"
        >
          <span>{chip.label}</span>
          <button
            onClick={chip.onClear}
            className="hover:bg-muted-foreground/30 text-muted-foreground hover:text-foreground rounded-full p-0.5 transition-colors cursor-pointer"
          >
            <X className="h-3 w-3 shrink-0" />
            <span className="sr-only">Remove filter</span>
          </button>
        </Badge>
      ))}
    </div>
  );
}
