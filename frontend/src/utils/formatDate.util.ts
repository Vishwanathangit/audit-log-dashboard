import { format, parseISO } from 'date-fns';

/**
 * Formats an ISO timestamp string into a readable local date + time string.
 * Example: "2025-06-14T08:32:00Z" -> "14 Jun 2025, 08:32 AM"
 */
export function formatTimestamp(iso: string): string {
  if (!iso) return '';
  try {
    const date = parseISO(iso);
    return format(date, 'dd MMM yyyy, hh:mm a');
  } catch (error) {
    return iso;
  }
}
