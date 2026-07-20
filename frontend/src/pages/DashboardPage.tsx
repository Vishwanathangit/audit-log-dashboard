import LogTable from '../components/audit-logs/LogTable';
import LogFilters from '../components/audit-logs/LogFilters';
import LogSearchBar from '../components/audit-logs/LogSearchBar';
import LogPagination from '../components/audit-logs/LogPagination';
import BulkUploadDialog from '../components/audit-logs/BulkUploadDialog';
import ActiveFilterChips from '../components/audit-logs/ActiveFilterChips';
import { useLogStore } from '../store/logStore';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function DashboardPage() {
  const fetchLogs = useLogStore((state) => state.fetchLogs);
  
  // Select active state slices to trigger URL updates and refetches
  const page = useLogStore((state) => state.page);
  const limit = useLogStore((state) => state.limit);
  const sortBy = useLogStore((state) => state.sortBy);
  const sortOrder = useLogStore((state) => state.sortOrder);
  const filters = useLogStore((state) => state.filters);

  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialized = useRef(false);

  // Sync initial URL query string params into Zustand store on mount
  useEffect(() => {
    const urlPage = searchParams.get('page');
    const urlLimit = searchParams.get('limit');
    const urlSortBy = searchParams.get('sortBy');
    const urlSortOrder = searchParams.get('sortOrder');

    const urlFilters: any = {};
    const filterKeys = ['search', 'severity', 'status', 'resourceType', 'region', 'action', 'actor', 'startDate', 'endDate'];
    filterKeys.forEach((key) => {
      const val = searchParams.get(key);
      if (val) {
        urlFilters[key] = val;
      }
    });

    // Populate Zustand store values directly in one batch
    useLogStore.setState({
      page: urlPage ? Number(urlPage) : 1,
      limit: urlLimit ? Number(urlLimit) : 20,
      sortBy: urlSortBy || 'timestamp',
      sortOrder: (urlSortOrder as any) || 'desc',
      filters: urlFilters,
    });

    isInitialized.current = true;
  }, []);

  // Sync Zustand store updates back to URL search params and trigger data fetches
  useEffect(() => {
    if (!isInitialized.current) return;

    const params = new URLSearchParams();

    if (page !== 1) params.set('page', String(page));
    if (limit !== 20) params.set('limit', String(limit));
    if (sortBy !== 'timestamp') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);

    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        params.set(key, String(val));
      }
    });

    setSearchParams(params, { replace: true });
    fetchLogs();
  }, [page, limit, sortBy, sortOrder, filters, fetchLogs, setSearchParams]);

  return (
    <main className="container mx-auto max-w-350 p-4 sm:p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Top dashboard summary area with Import actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Audit Logs</h2>
          <p className="text-sm text-muted-foreground">
            Track, audit, and analyze system actions, actor roles, and resource access history.
          </p>
        </div>
        <div className="shrink-0">
          <BulkUploadDialog />
        </div>
      </div>

      {/* Control Panel: Search & Filters grouping */}
      <div className="flex flex-col gap-4">
        <div className="w-full sm:max-w-sm">
          <LogSearchBar />
        </div>
        <LogFilters />
      </div>

      {/* Active Filter Chips */}
      <ActiveFilterChips />

      {/* Audit Logs Table & Paging */}
      <div className="space-y-4">
        <LogTable />
        <LogPagination />
      </div>
    </main>
  );
}

