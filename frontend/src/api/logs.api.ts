import axios from 'axios';
import type { LogQueryParams, LogsApiResponse, IAuditLog } from '../types/log.types';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function fetchLogs(params: LogQueryParams): Promise<LogsApiResponse> {
  const response = await api.get<LogsApiResponse>('/api/logs', { params });
  return response.data;
}

export async function bulkUploadLogs(
  logs: (Omit<IAuditLog, '_id'> | IAuditLog[])[]
): Promise<{ success: boolean; count: number; message: string }> {
  const response = await api.post<{ success: boolean; count: number; message: string }>(
    '/api/logs/bulk-upload',
    { logs }
  );
  return response.data;
}
