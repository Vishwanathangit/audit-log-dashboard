import { SEVERITY_LEVELS, LOG_STATUS, RESOURCE_TYPES } from '../constants/log.constants';

export interface IAuditLog {
  _id: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  resourceType: (typeof RESOURCE_TYPES)[number];
  ipAddress: string;
  region: string;
  severity: (typeof SEVERITY_LEVELS)[number];
  status: (typeof LOG_STATUS)[number];
  timestamp: string;
}

export interface LogQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  severity?: (typeof SEVERITY_LEVELS)[number];
  status?: (typeof LOG_STATUS)[number];
  region?: string;
  action?: string;
  resourceType?: (typeof RESOURCE_TYPES)[number];
  actor?: string;
  startDate?: string;
  endDate?: string;
}

export interface LogsApiResponse {
  logs: IAuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
