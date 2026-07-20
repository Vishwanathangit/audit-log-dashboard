import { create } from 'zustand';
import type { IAuditLog, LogQueryParams } from '../types/log.types';
import { fetchLogs as fetchLogsApi } from '../api/logs.api';
import { DEFAULT_PAGE_SIZE } from '../constants/log.constants';

// We separate filter properties from pagination and sorting to make state merging simpler
export interface LogFiltersState {
  search?: string;
  severity?: IAuditLog['severity'];
  status?: IAuditLog['status'];
  region?: string;
  action?: string;
  resourceType?: IAuditLog['resourceType'];
  actor?: string;
  startDate?: string;
  endDate?: string;
}

interface LogState {
  // State slices
  logs: IAuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: LogFiltersState;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // Actions
  setFilters: (newFilters: Partial<LogFiltersState>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  fetchLogs: () => Promise<void>;
}

/**
 * Zustand store for managing audit log list state.
 * To avoid full-store re-renders, components should subscribe using selectors:
 * e.g., const logs = useLogStore((state) => state.logs);
 */
export const useLogStore = create<LogState>((set, get) => ({
  logs: [],
  total: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  isLoading: false,
  error: null,
  filters: {},
  sortBy: 'timestamp',
  sortOrder: 'desc',

  setFilters: (newFilters) => {
    // Merges partial filters and resets page to 1
    set((state) => {
      const merged = { ...state.filters, ...newFilters };
      // Explicitly delete undefined keys so they are completely removed from the store state
      Object.keys(merged).forEach((key) => {
        if (merged[key as keyof LogFiltersState] === undefined) {
          delete merged[key as keyof LogFiltersState];
        }
      });
      return {
        filters: merged,
        page: 1,
      };
    });
  },

  setPage: (page) => {
    set({ page });
  },

  setLimit: (limit) => {
    // Changing page size resets to page 1
    set({ limit, page: 1 });
  },

  setSort: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
  },

  fetchLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit, sortBy, sortOrder, filters } = get();
      
      // Map store state directly to API query params
      const params: LogQueryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...filters,
      };

      const data = await fetchLogsApi(params);
      set({
        logs: data.logs,
        total: data.total,
        totalPages: data.totalPages,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || err.message || 'An error occurred while fetching audit logs.',
      });
    }
  },
}));
