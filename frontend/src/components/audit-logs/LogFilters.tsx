import { useLogStore } from '../../store/logStore';

export default function LogFilters() {
  const filters = useLogStore((state) => state.filters);
  const setFilters = useLogStore((state) => state.setFilters);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-lg border border-border bg-card">
      <div className="text-sm font-medium text-muted-foreground">
        LogFilters Scaffold (Connected: {Object.keys(filters).length} active filter fields)
      </div>
      <button 
        onClick={() => setFilters({})}
        className="text-xs text-primary hover:underline"
      >
        Clear Filters
      </button>
    </div>
  );
}
