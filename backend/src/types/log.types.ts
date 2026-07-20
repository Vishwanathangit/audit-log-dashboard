import { SEVERITY_LEVELS, LOG_STATUS, RESOURCE_TYPES } from '../constants/log.constants';

export interface IAuditLog {
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
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  severity?: string;
  status?: string;
  region?: string;
  action?: string;
  resourceType?: string;
  actor?: string;
  startDate?: string;
  endDate?: string;
}
