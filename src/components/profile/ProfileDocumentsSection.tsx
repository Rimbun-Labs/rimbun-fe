import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUp, Loader2, CheckCircle, AlertCircle, ExternalLink, BookOpen } from 'lucide-react';
import { useDocumentParse } from '@/hooks/useDocumentParse';
import { useApplyBankStatement } from '@/hooks/useSpendingData';
import { useInsuranceProducts, useEnrichProductFromPds } from '@/hooks/useInsuranceProducts';
import { useFormatters } from '@/hooks/useFormatters';
import type { DocumentParseResponse } from '@/lib/api/types/documents';

const MAX_FILE_SIZE_MB = 10;
const ACCEPT_PDF = 'application/pdf';

export function ProfileDocumentsSection() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { formatCurrency } = useFormatters();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<DocumentParseResponse | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const parseMutation = useDocumentParse();
  const applyMutation = useApplyBankStatement();
  const enrichMutation = useEnrichProductFromPds();
  const { data: productsData } = useInsuranceProducts({ limit: 200 });
  const products = productsData?.products ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setParseResult(null);
      return;
    }
    if (file.type !== ACCEPT_PDF) {
      setSelectedFile(null);
      setParseResult(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setSelectedFile(null);
      setParseResult(null);
      return;
    }
    setSelectedFile(file);
    setParseResult(null);
  };

  const handleParse = async () => {
    if (!selectedFile) return;
    try {
      const result = await parseMutation.mutateAsync({
        file: selectedFile,
        // Omit documentType so backend auto-detects (bank_statement vs insurance_pds)
      });
      setParseResult(result);
      setSelectedProductId('');
    } catch {
      // Error toast handled in useDocumentParse
    }
  };

  const handleUseForSpending = async () => {
    if (!parseResult?.bankStatement) return;
    try {
      await applyMutation.mutateAsync(parseResult.bankStatement);
      setParseResult(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      navigate('/spending');
    } catch {
      // Error toast handled in useApplyBankStatement
    }
  };

  const handleReset = () => {
    setParseResult(null);
    setSelectedFile(null);
    setSelectedProductId('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEnrichFromPds = async () => {
    if (parseResult?.documentType !== 'insurance_pds' || !selectedProductId) return;
    try {
      const updated = await enrichMutation.mutateAsync({
        productId: selectedProductId,
        productDna: parseResult.productDna,
      });
      setParseResult(null);
      setSelectedFile(null);
      setSelectedProductId('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      navigate(`/insurance/products/${encodeURIComponent(updated.productId)}`);
    } catch {
      // Error toast handled in useEnrichProductFromPds
    }
  };

  const isParseLoading = parseMutation.isPending;
  const isApplyLoading = applyMutation.isPending;
  const isEnrichLoading = enrichMutation.isPending;
  const suggested = parseResult?.documentType === 'bank_statement' ? parseResult.suggestedForSpending : undefined;
  const summary = parseResult?.documentType === 'bank_statement' ? parseResult.bankStatement?.summary : undefined;
  const transactionCount = parseResult?.documentType === 'bank_statement' ? parseResult.bankStatement?.transactions?.length ?? 0 : 0;
  const isPdsResult = parseResult?.documentType === 'insurance_pds';

  return (
    <Card id="documents-section" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5" />
          Upload documents
        </CardTitle>
        <CardDescription>
          Upload a bank statement (PDF) to import spending and balance data, or a product brochure (PDS) for future use.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File input */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_PDF}
            onChange={handleFileChange}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <p className="text-xs text-muted-foreground">
            PDF only, max {MAX_FILE_SIZE_MB}MB. We support bank statements and product brochures (PDS).
          </p>
        </div>

        {selectedFile && !parseResult && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleParse}
              disabled={isParseLoading}
            >
              {isParseLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Parsing…
                </>
              ) : (
                'Parse document'
              )}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isParseLoading}>
              Clear
            </Button>
          </div>
        )}

        {/* Parse error */}
        {parseMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {parseMutation.error?.message ?? 'Failed to parse document.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Parse result: bank statement summary + Use for spending */}
        {parseResult?.documentType === 'bank_statement' && parseResult.bankStatement && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              We detected <strong>{transactionCount}</strong> transaction{transactionCount !== 1 ? 's' : ''}
              {summary?.periodStart && summary?.periodEnd && (
                <> for the period <strong>{summary.periodStart}</strong> to <strong>{summary.periodEnd}</strong></>
              )}.
            </p>
            {suggested && (
              <div className="space-y-1 text-sm">
                <p>
                  Detected: <strong>{formatCurrency(suggested.monthlySpending)}</strong>/month spending,{' '}
                  <strong>{formatCurrency(suggested.emergencyFundCurrent)}</strong> balance
                  {suggested.monthlyIncomeProxy != null && suggested.monthlyIncomeProxy > 0 && (
                    <> · ~{formatCurrency(suggested.monthlyIncomeProxy)}/month income</>
                  )}.
                </p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={handleUseForSpending}
                disabled={isApplyLoading}
              >
                {isApplyLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Applying…
                  </>
                ) : (
                  'Use these values'
                )}
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={isApplyLoading}>
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your spending overview will be updated and you’ll be taken to the Spending page.
            </p>
          </div>
        )}

        {/* Parse result: product brochure (PDS) – choose product and enrich */}
        {isPdsResult && parseResult.documentType === 'insurance_pds' && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 shrink-0" />
              Product brochure (PDS) detected. Choose a catalog product to enrich with fees, risk and transparency data from this document.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Catalog product</label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={products.length === 0 ? 'Loading products…' : 'Select a product…'} />
                </SelectTrigger>
                <SelectContent>
                  {products.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No products in catalog. Try refreshing the page.
                    </div>
                  ) : (
                    products.map((p) => (
                      <SelectItem key={p.productId} value={p.productId}>
                        {p.insurerName} – {p.productName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={handleEnrichFromPds}
                disabled={!selectedProductId || isEnrichLoading}
              >
                {isEnrichLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enriching…
                  </>
                ) : (
                  'Enrich this product'
                )}
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={isEnrichLoading}>
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The product’s fee structure, ranking dimensions and resilience indicators will be updated. You’ll be taken to the product detail page.
            </p>
          </div>
        )}

        {/* Apply success: show link to spending if we didn't navigate */}
        {applyMutation.isSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-2 flex-wrap">
              <span>Spending updated from bank statement.</span>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto"
                onClick={() => navigate('/spending')}
              >
                View spending <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
