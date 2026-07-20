import { Router } from 'express';
import { bulkUploadLogs, getLogs } from '../controllers/log.controller';

const router = Router();

router.post('/bulk-upload', bulkUploadLogs);
router.get('/', getLogs);

export default router;
