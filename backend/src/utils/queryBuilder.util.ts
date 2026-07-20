import { QueryFilter } from 'mongoose';
import { IAuditLog, LogQueryParams } from '../types/log.types';

const escapeRegex = (str: string): string => {
  return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Factory-style query builder pattern that returns a MongoDB filter object conditionally.
export const buildLogFilter = (query: LogQueryParams): QueryFilter<IAuditLog> => {
  const filter: QueryFilter<IAuditLog> = {};

  if (query.severity) {
    filter.severity = query.severity as any;
  }
  if (query.status) {
    filter.status = query.status as any;
  }
  if (query.resourceType) {
    filter.resourceType = query.resourceType as any;
  }

  if (query.region) {
    filter.region = { $regex: `^${escapeRegex(query.region)}$`, $options: 'i' };
  }
  if (query.action) {
    filter.action = { $regex: `^${escapeRegex(query.action)}$`, $options: 'i' };
  }
  if (query.actor) {
    filter.actor = { $regex: `^${escapeRegex(query.actor)}$`, $options: 'i' };
  }

  if (query.search) {
    const escapedSearch = escapeRegex(query.search);
    filter.$or = [
      { actor: { $regex: escapedSearch, $options: 'i' } },
      { action: { $regex: escapedSearch, $options: 'i' } },
      { resource: { $regex: escapedSearch, $options: 'i' } },
      { ipAddress: { $regex: escapedSearch, $options: 'i' } }
    ];
  }

  if (query.startDate || query.endDate) {
    filter.timestamp = {};
    if (query.startDate) {
      filter.timestamp.$gte = query.startDate;
    }
    if (query.endDate) {
      filter.timestamp.$lte = query.endDate;
    }
  }

  return filter;
};

export const buildSortObject = (
  sortBy: string = 'timestamp',
  sortOrder: 'asc' | 'desc' = 'desc'
): { [key: string]: 1 | -1 } => {
  return { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
};

export const buildSeverityAggregationPipeline = (
  filter: any,
  sortOrder: 'asc' | 'desc' = 'desc',
  skip: number,
  limit: number
): any[] => {
  const sortOrderVal = sortOrder === 'asc' ? 1 : -1;
  return [
    { $match: filter },
    {
      $addFields: {
        severityRank: {
          $switch: {
            branches: [
              { case: { $eq: ['$severity', 'LOW'] }, then: 1 },
              { case: { $eq: ['$severity', 'MEDIUM'] }, then: 2 },
              { case: { $eq: ['$severity', 'HIGH'] }, then: 3 },
              { case: { $eq: ['$severity', 'CRITICAL'] }, then: 4 }
            ],
            default: 0
          }
        }
      }
    },
    { $sort: { severityRank: sortOrderVal } },
    { $skip: skip },
    { $limit: limit }
  ];
};
