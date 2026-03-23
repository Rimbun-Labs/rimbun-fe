import { useMutation } from '@tanstack/react-query';
import { parseDocument, getDocumentParseErrorMessage } from '@/lib/api/documentsApi';
import type { DocumentTypeParam } from '@/lib/api/documentsApi';
import type { DocumentParseResponse } from '@/lib/api/types/documents';
import { toast } from 'sonner';
import axios from 'axios';

/**
 * Hook to parse an uploaded PDF (bank statement or insurance PDS).
 * Returns mutation with parse result; UI branches on documentType (bank_statement | insurance_pds).
 */
export function useDocumentParse() {
  return useMutation({
    mutationFn: async ({
      file,
      documentType,
    }: {
      file: File;
      documentType?: DocumentTypeParam;
    }): Promise<DocumentParseResponse> => {
      const result = await parseDocument(file, documentType);
      return result;
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        const message = getDocumentParseErrorMessage(
          error.response.status,
          error.response.data
        );
        toast.error(message);
      } else {
        toast.error(error.message || 'Failed to parse document');
      }
    },
  });
}
