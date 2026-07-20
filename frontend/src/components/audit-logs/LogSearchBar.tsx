import { useLogStore } from '../../store/logStore';

export default function LogSearchBar() {
  const search = useLogStore((state) => state.filters.search || '');
  const setFilters = useLogStore((state) => state.setFilters);

  return (
    <div className="flex gap-2 w-full max-w-sm">
      <input
        type="text"
        placeholder="Search logs (actor, action, resource)..."
        value={search}
        onChange={(e) => setFilters({ search: e.target.value })}
        className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}
