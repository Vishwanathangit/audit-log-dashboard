import { useLogStore } from '../../store/logStore';

export default function LogTable() {
  const logs = useLogStore((state) => state.logs);
  const isLoading = useLogStore((state) => state.isLoading);

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-8 text-center text-muted-foreground">
        {isLoading ? (
          <p className="animate-pulse">Loading audit logs...</p>
        ) : logs.length === 0 ? (
          <p>No audit logs available. LogTable scaffolding connected to Zustand.</p>
        ) : (
          <p>Logs data loaded: {logs.length} logs available.</p>
        )}
      </div>
    </div>
  );
}
