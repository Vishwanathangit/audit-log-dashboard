import LogTable from '../components/audit-logs/LogTable';
import LogFilters from '../components/audit-logs/LogFilters';
import LogSearchBar from '../components/audit-logs/LogSearchBar';
import LogPagination from '../components/audit-logs/LogPagination';
import DateRangePicker from '../components/common/DateRangePicker';
import { useLogStore } from '../store/logStore';
import { useEffect } from 'react';

export default function DashboardPage() {
  const fetchLogs = useLogStore((state) => state.fetchLogs);

  // Initialize data fetch on mount to verify Zustand store & API routing
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <main className="container mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
      {/* Top dashboard summary/title area */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Monitor and audit administrative access and application level activities.
        </p>
      </div>

      {/* Control panel grouping filters & search */}
      <div className="grid gap-4 md:flex md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-sm">
          <LogSearchBar />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker 
            onChange={(start, end) => {
              console.log('Date range change:', start, end);
            }} 
          />
        </div>
      </div>

      {/* Full filter bar */}
      <LogFilters />

      {/* Main Logs Table Area */}
      <div className="space-y-4">
        <LogTable />
        <LogPagination />
      </div>
    </main>
  );
}
