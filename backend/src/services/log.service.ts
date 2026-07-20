import { AuditLog } from '../models/log.model';
import { IAuditLog, LogQueryParams } from '../types/log.types';
import { buildLogFilter, buildSortObject } from '../utils/queryBuilder.util';

export const bulkInsertLogs = async (logs: IAuditLog[]): Promise<number> => {
  try {
    const result = await AuditLog.insertMany(logs, { ordered: false });
    return result.length;
  } catch (error: any) {
    if (error.result && typeof error.result.nInserted === 'number') {
      return error.result.nInserted;
    }
    if (error.insertedDocs) {
      return error.insertedDocs.length;
    }
    throw error;
  }
};

export const getLogs = async (query: LogQueryParams) => {
  const filter = buildLogFilter(query);
  const sort = buildSortObject(query.sortBy, query.sortOrder);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort(sort).skip(skip).limit(limit),
    AuditLog.countDocuments(filter)
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};
