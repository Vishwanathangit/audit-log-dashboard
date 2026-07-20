import { Request, Response } from 'express';
import { bulkUploadSchema, logQuerySchema } from '../validators/log.validator';
import { bulkInsertLogs, getLogs as getLogsService } from '../services/log.service';

export const bulkUploadLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = bulkUploadSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parseResult.error.format()
      });
      return;
    }

    const { logs } = parseResult.data;
    const insertedCount = await bulkInsertLogs(logs);

    res.status(201).json({
      message: 'Logs uploaded successfully',
      insertedCount
    });
  } catch (error) {
    res.status(500).json({
      message: 'An unexpected error occurred during bulk upload'
    });
  }
};

export const getLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = logQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parseResult.error.format()
      });
      return;
    }

    const result = await getLogsService(parseResult.data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'An unexpected error occurred while fetching logs'
    });
  }
};
