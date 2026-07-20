import { useLogStore } from '../../store/logStore';

export default function LogPagination() {
  const page = useLogStore((state) => state.page);
  const totalPages = useLogStore((state) => state.totalPages);
  const setPage = useLogStore((state) => state.setPage);

  return (
    <div className="flex items-center justify-between gap-4 p-4 border border-border rounded-lg bg-card text-card-foreground">
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 text-sm rounded border border-border disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 text-sm rounded border border-border disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
        >
          Next
        </button>
      </div>
    </div>
  );
}
