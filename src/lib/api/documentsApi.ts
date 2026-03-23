import { apiClient } from './client';
import type {
  DocumentParseResponse,
  DocumentParseErrorBody,
} from './types/documents';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export type DocumentTypeParam = 'bank_statement' | 'insurance_pds';

/**
 * Parse a PDF document (bank statement or insurance PDS).
 * Uses multipart/form-data; apiClient adds Authorization header.
 * Do not set Content-Type – axios sets multipart/form-data with boundary.
 * Returns union: bank_statement (bankStatement + suggestedForSpending) or insurance_pds (productDna).
 */
export async function parseDocument(
  file: File,
  documentType?: DocumentTypeParam
): Promise<DocumentParseResponse> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File must be under ${MAX_FILE_SIZE_MB}MB`);
  }
  if (file.type !== 'application/pdf') {
    throw new Error('File must be a PDF');
  }

  const formData = new FormData();
  formData.append('file', file);
  if (documentType) {
    formData.append('documentType', documentType);
  }

  const response = await apiClient.post<DocumentParseResponse>(
    '/documents/parse',
    formData
  );

  return response.data;
}

/**
 * Get user-friendly message from backend error (400, 415, 422, 502, 503).
 */
export function getDocumentParseErrorMessage(
  status: number,
  body?: DocumentParseErrorBody | unknown
): string {
  const err = body as DocumentParseErrorBody | undefined;
  const message = err?.message || err?.error;
  if (message) return String(message);

  switch (status) {
    case 400:
      return 'No file was sent. Please select a PDF and try again.';
    case 401:
      return 'Please sign in again to upload documents.';
    case 415:
      return 'This document type is not supported. Use a bank statement or product brochure (PDS).';
    case 422:
      return 'We could not read text from this PDF. Scanned images may not be supported yet.';
    case 502:
    case 503:
      return 'Document processing is temporarily unavailable. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
