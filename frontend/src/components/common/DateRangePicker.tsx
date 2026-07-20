import * as React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { cn } from '../../utils/cn.util';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onChange: (startDate?: string, endDate?: string) => void;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className,
}: DateRangePickerProps) {
  // Translate ISO strings from parent props to Date structures for react-day-picker
  const selectedRange = React.useMemo<DateRange | undefined>(() => {
    const from = startDate && isValid(parseISO(startDate)) ? parseISO(startDate) : undefined;
    const to = endDate && isValid(parseISO(endDate)) ? parseISO(endDate) : undefined;
    if (!from && !to) return undefined;
    return { from, to };
  }, [startDate, endDate]);

  const handleSelect = (range: DateRange | undefined) => {
    const fromStr = range?.from ? range.from.toISOString() : undefined;
    const toStr = range?.to ? range.to.toISOString() : undefined;
    onChange(fromStr, toStr);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined, undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-picker-trigger"
            variant="outline"
            size="default"
            className={cn(
              "w-full justify-start text-left font-normal select-none pr-8 relative",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {selectedRange?.from ? (
                selectedRange.to ? (
                  <>
                    {format(selectedRange.from, "LLL dd, yyyy")} -{" "}
                    {format(selectedRange.to, "LLL dd, yyyy")}
                  </>
                ) : (
                  format(selectedRange.from, "LLL dd, yyyy")
                )
              ) : (
                <span>Select date range</span>
              )}
            </span>
            {startDate && (
              <span
                role="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Clear date filter</span>
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(new Date().getFullYear(), 11)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
