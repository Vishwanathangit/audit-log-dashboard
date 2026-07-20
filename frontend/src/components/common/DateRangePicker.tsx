import { CalendarDays } from 'lucide-react';

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onChange: (startDate?: string, endDate?: string) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-border bg-card text-muted-foreground select-none cursor-pointer hover:bg-accent/50">
      <CalendarDays className="h-4 w-4" />
      <span>
        {startDate && endDate 
          ? `${startDate} - ${endDate}`
          : 'Filter by Date Range'}
      </span>
      {/* Temporary clear button for scaffolding verification */}
      {(startDate || endDate) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange(undefined, undefined);
          }}
          className="ml-2 text-xs font-semibold text-primary hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}
