import { Schema, model } from 'mongoose';
import { IAuditLog } from '../types/log.types';
import { SEVERITY_LEVELS, LOG_STATUS, RESOURCE_TYPES } from '../constants/log.constants';

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: String, required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceType: { type: String, required: true, enum: [...RESOURCE_TYPES] },
    ipAddress: { type: String, required: true },
    region: { type: String, required: true },
    severity: { type: String, required: true, enum: [...SEVERITY_LEVELS] },
    status: { type: String, required: true, enum: [...LOG_STATUS] },
    timestamp: { type: String, required: true }
  },
  {
    timestamps: false
  }
);

// These indexes exist to support server-side filtering/sorting performance.
AuditLogSchema.index({ severity: 1 });
AuditLogSchema.index({ status: 1 });
AuditLogSchema.index({ region: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ actor: 1 });

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);
