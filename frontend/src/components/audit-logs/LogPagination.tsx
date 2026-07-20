import { useLogStore } from '../../store/logStore';
import { PAGE_SIZE_OPTIONS } from '../../constants/log.constants';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LogPagination() {
  // Subscribe strictly to the relevant pagination state and actions
  const page = useLogStore((state) => state.page);
  const limit = useLogStore((state) => state.limit);
  const total = useLogStore((state) => state.total);
  const totalPages = useLogStore((state) => state.totalPages);
  const setPage = useLogStore((state) => state.setPage);
  const setLimit = useLogStore((state) => state.setLimit);

  // Range metadata info
  const startRange = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, total);

  // Generate sliding window of page numbers to render
  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border rounded-lg bg-card text-card-foreground shadow-xs">
      {/* Range summary text */}
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{startRange}</span>–
        <span className="font-semibold text-foreground">{endRange}</span> of{" "}
        <span className="font-semibold text-foreground">{total.toLocaleString()}</span> results
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {/* Page size controller Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Rows per page</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => setLimit(Number(val))}
          >
            <SelectTrigger id="page-size-select" className="w-17.5 h-8 bg-background text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Buttons pagination controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          {pageNumbers.map((num) => (
            <Button
              key={num}
              variant={num === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(num)}
              className="h-8 w-8 font-medium text-xs"
            >
              {num}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
