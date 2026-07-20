import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useLogStore } from '../../store/logStore';
import { useDebounce } from '../../utils/useDebounce';

export default function LogSearchBar() {
  // Subscribe strictly to only the slices of store required
  const storeSearch = useLogStore((state) => state.filters.search);
  const setFilters = useLogStore((state) => state.setFilters);

  // Local state to keep the input fluid while typing
  const [value, setValue] = React.useState(storeSearch || '');
  const debouncedValue = useDebounce(value, 400);

  // Keep local input in sync if store gets cleared (e.g. via 'Clear Filters')
  React.useEffect(() => {
    setValue(storeSearch || '');
  }, [storeSearch]);

  // Push changes to store when debounced value updates
  React.useEffect(() => {
    // Only update if it differs from current store value
    if (debouncedValue !== (storeSearch || '')) {
      setFilters({ search: debouncedValue || undefined });
    }
  }, [debouncedValue, storeSearch, setFilters]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0" />
      <Input
        type="search"
        placeholder="Search logs (actor, action, resource)..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-9 bg-background text-foreground"
      />
    </div>
  );
}
