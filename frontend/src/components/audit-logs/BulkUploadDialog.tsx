import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ZodIssue } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { auditLogSchema } from '../../validators/log.validator';
import { bulkUploadLogs } from '../../api/logs.api';
import { useLogStore } from '../../store/logStore';
import type { IAuditLog } from '../../types/log.types';

export default function BulkUploadDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Local validation and upload state
  const [validLogs, setValidLogs] = useState<Omit<IAuditLog, '_id'>[]>([]);
  const [invalidCount, setInvalidCount] = useState<number>(0);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchLogs = useLogStore((state) => state.fetchLogs);

  // Reset dialog state when opening or closing
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFile(null);
      setValidLogs([]);
      setInvalidCount(0);
      setFieldErrors([]);
      setUploadError(null);
      setUploadSuccess(null);
      setIsUploading(false);
    }
  };

  // Parse and validate the selected CSV file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadError(null);
    setUploadSuccess(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const validList: Omit<IAuditLog, '_id'>[] = [];
        const errorsList: string[] = [];
        let invalidRows = 0;

        data.forEach((row, index) => {
          // Normalize and clean whitespace
          const cleanedRow = {
            actor: typeof row.actor === 'string' ? row.actor.trim() : row.actor,
            role: typeof row.role === 'string' ? row.role.trim() : row.role,
            action: typeof row.action === 'string' ? row.action.trim() : row.action,
            resource: typeof row.resource === 'string' ? row.resource.trim() : row.resource,
            resourceType: typeof row.resourceType === 'string' ? row.resourceType.trim() : row.resourceType,
            ipAddress: typeof row.ipAddress === 'string' ? row.ipAddress.trim() : row.ipAddress,
            region: typeof row.region === 'string' ? row.region.trim() : row.region,
            severity: typeof row.severity === 'string' ? row.severity.toUpperCase().trim() : row.severity,
            status: typeof row.status === 'string' ? row.status.trim() : row.status,
            timestamp: typeof row.timestamp === 'string' ? row.timestamp.trim() : row.timestamp,
          };

          const parseResult = auditLogSchema.safeParse(cleanedRow);
          
          if (!parseResult.success) {
            invalidRows++;
            // Only collect first 5 row errors to keep list concise
            if (errorsList.length < 5) {
              const rowIssues = parseResult.error.issues
                .map((issue: ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');
              // Index + 2 corresponds to actual row number in CSV (1-based + header row)
              errorsList.push(`Row ${index + 2}: ${rowIssues}`);
            }
          } else {
            validList.push(parseResult.data as any);
          }
        });

        setValidLogs(validList);
        setInvalidCount(invalidRows);
        setFieldErrors(errorsList);
      },
      error: () => {
        setUploadError('Failed to parse CSV file. Please make sure the format is valid.');
      }
    });
  };

  // Submit the valid logs array to the backend
  const handleUpload = async () => {
    if (validLogs.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Send valid items to server
      const response = await bulkUploadLogs(validLogs as any);
      
      setUploadSuccess(`Successfully uploaded ${response.count} audit logs.`);
      
      // Reactive refresh: update layout dashboard data in background
      fetchLogs();

      // Delay closing dialog briefly so the user sees the success state
      setTimeout(() => {
        handleOpenChange(false);
      }, 1500);

    } catch (err: any) {
      setUploadError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred during bulk upload.'
      );
      setIsUploading(false);
    }
  };

  const totalRecords = validLogs.length + invalidCount;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2 font-semibold cursor-pointer">
          <Upload className="h-4 w-4" />
          Import Logs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Import Audit Logs</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select a CSV file containing logs matching the audit schemas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* File select field */}
          <div className="space-y-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
              className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          {/* Validation Errors panel */}
          {file && invalidCount > 0 && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm space-y-2">
              <div className="flex items-start gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Validation failed: {invalidCount} of {totalRecords} records contain errors.
                </span>
              </div>
              <ul className="list-disc pl-5 text-xs space-y-1 font-mono max-h-30 overflow-y-auto">
                {fieldErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground italic pt-1 border-t border-destructive/10">
                Fix the validation issues and select the file again. Confirming will only upload valid rows.
              </p>
            </div>
          )}

          {/* Validation success / ready state preview */}
          {file && validLogs.length > 0 && (
            <div className="p-4 rounded-lg bg-status-resolved/10 border border-status-resolved/20 text-status-resolved text-sm flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-status-resolved" />
              <div className="space-y-1">
                <span className="font-semibold block">
                  {validLogs.length.toLocaleString()} valid records ready to upload
                </span>
                {invalidCount > 0 && (
                  <span className="text-xs text-muted-foreground block">
                    (Note: {invalidCount} invalid rows will be skipped)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Upload outcome messages */}
          {uploadError && (
            <div className="p-4 rounded-lg bg-destructive/15 text-destructive border border-destructive/20 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-4 rounded-lg bg-status-resolved/15 text-status-resolved border border-status-resolved/20 text-sm flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || validLogs.length === 0}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Confirm Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
