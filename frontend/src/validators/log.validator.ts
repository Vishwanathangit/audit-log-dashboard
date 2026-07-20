import { z } from 'zod';
import { SEVERITY_LEVELS, LOG_STATUS, RESOURCE_TYPES } from '../constants/log.constants';

export const auditLogSchema = z.object({
  actor: z.string().min(1, 'Actor is required'),
  role: z.string().min(1, 'Role is required'),
  action: z.string().min(1, 'Action is required'),
  resource: z.string().min(1, 'Resource is required'),
  resourceType: z.enum(RESOURCE_TYPES),
  ipAddress: z.string().min(1, 'IP Address is required'),
  region: z.string().min(1, 'Region is required'),
  severity: z.enum(SEVERITY_LEVELS),
  status: z.enum(LOG_STATUS),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO date string'
  })
});

export const logQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  severity: z.enum(SEVERITY_LEVELS).optional(),
  status: z.enum(LOG_STATUS).optional(),
  region: z.string().optional(),
  action: z.string().optional(),
  resourceType: z.enum(RESOURCE_TYPES).optional(),
  actor: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO date string'
  }).optional(),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO date string'
  }).optional()
});

export type LogQueryInput = z.infer<typeof logQuerySchema>;
