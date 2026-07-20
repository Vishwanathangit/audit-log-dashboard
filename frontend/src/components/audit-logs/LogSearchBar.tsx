import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useLogStore } from '../../store/logStore';

export default function LogSearchBar() {
  // Subscribe strictly to only the slices of store required
  const storeSearch = useLogStore((state) => state.filters.search);
  const setFilters = useLogStore((state) => state.setFilters);

  // Local state to keep the input fluid while typing
  const [value, setValue] = React.useState(storeSearch || '');
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Keep local input in sync if store gets cleared (e.g. via 'Clear Filters' or chips)
  React.useEffect(() => {
    if (!storeSearch) {
      setValue('');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (storeSearch !== value) {
      setValue(storeSearch);
    }
  }, [storeSearch]);

  // Push changes to store when debounced value updates
  const handleChange = (newValue: string) => {
    setValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setFilters({ search: newValue.trim() || undefined });
    }, 400);
  };

  // Clean up pending timeouts on component unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0" />
      <Input
        type="search"
        placeholder="Search logs (actor, action, resource)..."
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full pl-9 bg-background text-foreground"
      />
    </div>
  );
}
