import { z } from 'zod';
import { SEVERITY_LEVELS, LOG_STATUS, RESOURCE_TYPES } from '../constants/log.constants';

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
