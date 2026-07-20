export const SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const LOG_STATUS = ["Resolved", "Unresolved"] as const;
export const RESOURCE_TYPES = ["USER", "FILE", "SYSTEM", "API", "DATABASE"] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

export const SEVERITY_COLOR_MAP = {
  LOW: "bg-severity-low/10 text-severity-low border-severity-low/20 dark:bg-severity-low/20",
  MEDIUM: "bg-severity-medium/10 text-severity-medium border-severity-medium/20 dark:bg-severity-medium/20",
  HIGH: "bg-severity-high/10 text-severity-high border-severity-high/20 dark:bg-severity-high/20",
  CRITICAL: "bg-severity-critical/10 text-severity-critical border-severity-critical/20 dark:bg-severity-critical/20",
} as const;

export const STATUS_COLOR_MAP = {
  Resolved: "bg-status-resolved/10 text-status-resolved border-status-resolved/20 dark:bg-status-resolved/20",
  Unresolved: "bg-status-unresolved/10 text-status-unresolved border-status-unresolved/20 dark:bg-status-unresolved/20",
} as const;
