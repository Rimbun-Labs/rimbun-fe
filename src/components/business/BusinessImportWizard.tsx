import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  confirmImport,
  downloadImportOriginal,
  getImportBatch,
  listImportBatches,
  listImportTemplates,
  previewImport,
  reverseImport,
  type BusinessImportBatch,
  type BusinessImportBatchDetail,
  type BusinessImportPreview,
  type BusinessImportSourceType,
  type BusinessImportTemplate,
} from "@/lib/api/businessApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ImportDataTable } from "@/components/business/ImportDataTable";
import { SoftWait } from "@/components/ui/SoftWait";

const SOURCE_OPTIONS: Array<{
  value: BusinessImportSourceType;
  title: string;
  blurb: string;
}> = [
  {
    value: "account_balances_csv",
    title: "Account balances",
    blurb: "Dated closing balances—the starting point for current cash.",
  },
  {
    value: "bank_csv",
    title: "Bank statement",
    blurb: "Posted transactions that move cash.",
  },
  {
    value: "pos_csv",
    title: "POS / daily sales",
    blurb: "Cafe sales by day, channel, and settlement expectation.",
  },
  {
    value: "invoices_csv",
    title: "Invoices",
    blurb: "Open and paid customer invoices (Money → Coming in).",
  },
  {
    value: "invoice_payments_csv",
    title: "Invoice payments",
    blurb: "Payments against invoices, optionally linked to bank refs.",
  },
  {
    value: "settlements_csv",
    title: "Sales settlements",
    blurb: "Expected QRIS/POS payouts to match against bank credits.",
  },
  {
    value: "bills_csv",
    title: "Bills & commitments",
    blurb: "Supplier bills and recurring outflows (Money → Going out).",
  },
];

type Stage = "choose" | "upload" | "map" | "confirm";

type Props = {
  customerId: string;
  onComplete?: () => void;
};

function sourceTypeTitle(sourceType: string): string {
  return (
    SOURCE_OPTIONS.find((o) => o.value === sourceType)?.title ?? sourceType
  );
}

function batchHeading(b: BusinessImportBatch): string {
  const title = sourceTypeTitle(b.sourceType);
  return b.originalFilename ? `${title} · ${b.originalFilename}` : title;
}

function payloadPreview(payload: Record<string, unknown> | null): string {
  if (!payload) return "—";
  const entries = Object.entries(payload).filter(
    ([, v]) => v != null && v !== "",
  );
  return entries
    .slice(0, 6)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join(" · ");
}

function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const BusinessImportWizard: React.FC<Props> = ({
  customerId,
  onComplete,
}) => {
  const [stage, setStage] = useState<Stage>("choose");
  const [sourceType, setSourceType] = useState<BusinessImportSourceType>(
    "account_balances_csv",
  );
  const [templates, setTemplates] = useState<BusinessImportTemplate[]>([]);
  const [batches, setBatches] = useState<BusinessImportBatch[]>([]);
  const [filename, setFilename] = useState<string>("");
  const [csvText, setCsvText] = useState("");
  const [mapping, setMapping] = useState<Record<string, string | null>>({});
  const [preview, setPreview] = useState<BusinessImportPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewLoadingMore, setViewLoadingMore] = useState(false);
  const [viewDetail, setViewDetail] =
    useState<BusinessImportBatchDetail | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);

  const refreshBatches = useCallback(async () => {
    if (!customerId) return;
    const next = await listImportBatches(customerId);
    setBatches(next);
  }, [customerId]);

  useEffect(() => {
    void (async () => {
      try {
        const [tpl, hist] = await Promise.all([
          listImportTemplates(),
          listImportBatches(customerId),
        ]);
        setTemplates(tpl);
        setBatches(hist);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load import tools",
        );
      }
    })();
  }, [customerId]);

  const template = useMemo(
    () => templates.find((t) => t.sourceType === sourceType) ?? null,
    [templates, sourceType],
  );

  const resetWizard = () => {
    setStage("choose");
    setFilename("");
    setCsvText("");
    setMapping({});
    setPreview(null);
    setError(null);
  };

  const runPreview = async (nextMapping?: Record<string, string | null>) => {
    if (!csvText.trim()) {
      setError("Choose a CSV file first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await previewImport(customerId, {
        sourceType,
        filename: filename || undefined,
        csvText,
        mapping: nextMapping ?? mapping,
      });
      setPreview(result);
      setMapping(result.mapping);
      setStage("map");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      setError(
        "Excel uploads are not supported yet. Export to CSV (UTF-8) and try again.",
      );
      return;
    }
    setFilename(file.name);
    setCsvText(await file.text());
    setPreview(null);
    setResultMessage(null);
    setError(null);
    setStage("upload");
  };

  const onConfirm = async () => {
    if (!preview) return;
    setBusy(true);
    setError(null);
    try {
      const result = await confirmImport(customerId, {
        sourceType,
        filename: filename || undefined,
        csvText,
        mapping,
      });
      const created = result.batch.createdCount ?? 0;
      const skipped = result.batch.skippedCount ?? 0;
      const errors = result.batch.errorCount ?? 0;
      setResultMessage(
        result.duplicate
          ? (result.message ?? "File already imported.")
          : result.batch.status === "failed"
            ? `Import failed: ${errors} row(s) need attention. No business facts were created.`
            : `Imported ${created} new row(s)${skipped ? `; ${skipped} existing row(s) skipped` : ""}${errors ? `; ${errors} row(s) need attention` : ""}.`,
      );
      await refreshBatches();
      onComplete?.();
      resetWizard();
      setStage("choose");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
    }
  };

  const onReverse = async (batchId: string) => {
    const ok = window.confirm(
      "Remove this import? Facts created by this batch will be deleted, and the original file copy will be removed.",
    );
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      await reverseImport(customerId, batchId);
      setResultMessage("Import removed.");
      await refreshBatches();
      onComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reverse failed");
    } finally {
      setBusy(false);
    }
  };

  const onView = async (batchId: string) => {
    setViewOpen(true);
    setViewLoading(true);
    setViewError(null);
    setViewDetail(null);
    try {
      const detail = await getImportBatch(customerId, batchId, {
        limit: 100,
        offset: 0,
      });
      setViewDetail(detail);
    } catch (err) {
      setViewError(
        err instanceof Error ? err.message : "Could not load import",
      );
    } finally {
      setViewLoading(false);
    }
  };

  const onViewMore = async () => {
    if (!viewDetail || viewLoadingMore || !viewDetail.truncated) return;
    setViewLoadingMore(true);
    setViewError(null);
    try {
      const next = await getImportBatch(customerId, viewDetail.batch.id, {
        limit: 100,
        offset: viewDetail.rows.length,
      });
      setViewDetail({
        ...next,
        rows: [...viewDetail.rows, ...next.rows],
      });
    } catch (err) {
      setViewError(
        err instanceof Error ? err.message : "Could not load more rows",
      );
    } finally {
      setViewLoadingMore(false);
    }
  };

  const onDownloadOriginal = async (batchId: string) => {
    try {
      const file = await downloadImportOriginal(customerId, batchId);
      downloadText(file.filename, file.csvText);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not download original file",
      );
    }
  };

  const mapPreviewFields = useMemo(() => {
    if (!preview) return [] as string[];
    return preview.mappableFields ?? preview.requiredFields;
  }, [preview]);

  const mapTableRows = useMemo(() => {
    if (!preview) return [];
    return preview.previewRows.map((row) => ({
      id: `preview-${row.rowNumber}`,
      rowNumber: row.rowNumber,
      tone:
        row.validationState === "invalid"
          ? ("invalid" as const)
          : undefined,
      statusLabel: row.validationState === "invalid" ? "Needs fix" : "OK",
      cells: mapPreviewFields.map((field) => {
        const value = row.payload?.[field];
        return value == null ? "" : String(value);
      }),
    }));
  }, [preview, mapPreviewFields]);

  const viewTableRows = useMemo(() => {
    if (!viewDetail) return [];
    const failedNumbers = new Set(
      viewDetail.failedRows.map((f) => f.rowNumber),
    );
    return viewDetail.rows.map((row) => ({
      id: `view-${row.rowNumber}`,
      rowNumber: row.rowNumber,
      cells: row.cells,
      tone: failedNumbers.has(row.rowNumber)
        ? ("invalid" as const)
        : undefined,
    }));
  }, [viewDetail]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Import data</CardTitle>
          <CardDescription>
            Locked source types for bank, sales, invoices, payments,
            settlements, and bills. Upload CSV only (Excel .xlsx not supported
            yet). Map columns once; we remember the mapping for next time.
            Insight pages always use the latest confirmed data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {(
              [
                ["choose", "1. Source"],
                ["upload", "2. Upload"],
                ["map", "3. Map & validate"],
                ["confirm", "4. Confirm"],
              ] as const
            ).map(([key, label]) => (
              <Badge key={key} variant={stage === key ? "default" : "outline"}>
                {label}
              </Badge>
            ))}
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {resultMessage ? (
            <p className="text-sm text-muted-foreground">{resultMessage}</p>
          ) : null}

          {stage === "choose" || stage === "upload" ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {SOURCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`rounded-md border p-3 text-left transition-colors ${
                      sourceType === opt.value
                        ? "border-foreground bg-muted/40"
                        : "hover:bg-muted/30"
                    }`}
                    onClick={() => {
                      setSourceType(opt.value);
                      setPreview(null);
                      setCsvText("");
                      setFilename("");
                      setStage("choose");
                    }}
                  >
                    <div className="text-sm font-medium">{opt.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {opt.blurb}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {template ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadText(
                        `${sourceType}-template.csv`,
                        template.sampleCsv,
                      )
                    }
                  >
                    Download CSV template
                  </Button>
                ) : null}
                <Label className="cursor-pointer">
                  <span className="sr-only">Upload CSV</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="block text-sm"
                    onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
                  />
                </Label>
              </div>

              {csvText ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ready: {filename || "pasted file"} (
                    {csvText.split(/\r?\n/).filter((l) => l.trim()).length - 1}{" "}
                    data rows)
                  </p>
                  <Button disabled={busy} onClick={() => void runPreview()}>
                    Preview mapping
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {stage === "map" && preview ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 text-sm">
                <span>
                  {preview.summary.validCount} valid /{" "}
                  {preview.summary.invalidCount} invalid of{" "}
                  {preview.summary.rowCount}
                </span>
                {preview.summary.errorCodes.length > 0 ? (
                  <span className="text-muted-foreground">
                    Issues: {preview.summary.errorCodes.join(", ")}
                  </span>
                ) : null}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {(preview.mappableFields ?? preview.requiredFields).map(
                  (field) => (
                    <div key={field} className="space-y-1">
                      <Label htmlFor={`map-${field}`}>{field}</Label>
                      <select
                        id={`map-${field}`}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={mapping[field] ?? ""}
                        onChange={(e) => {
                          const next = {
                            ...mapping,
                            [field]: e.target.value || null,
                          };
                          setMapping(next);
                        }}
                      >
                        <option value="">— not mapped —</option>
                        {preview.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  ),
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Sample rows · mapped values
                </p>
                <ImportDataTable
                  headers={mapPreviewFields}
                  rows={mapTableRows}
                  statusHeader="Check"
                  maxHeightClassName="max-h-[min(40vh,22rem)]"
                  emptyMessage="No sample rows yet. Re-validate after mapping."
                />
                {preview.previewRows.some(
                  (r) => r.validationState === "invalid",
                ) ? (
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {preview.previewRows
                      .filter((r) => r.validationState === "invalid")
                      .slice(0, 5)
                      .map((r) => (
                        <li key={r.rowNumber}>
                          Row {r.rowNumber}:{" "}
                          {(r.errorCodes ?? []).join(", ") ||
                            r.errorMessage ||
                            "invalid"}
                        </li>
                      ))}
                  </ul>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void runPreview(mapping)}
                >
                  Re-validate
                </Button>
                <Button
                  disabled={busy || preview.summary.validCount === 0}
                  onClick={() => setStage("confirm")}
                >
                  Continue to confirm
                </Button>
                <Button variant="ghost" onClick={resetWizard}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}

          {stage === "confirm" && preview ? (
            <div className="space-y-3">
              <p className="text-sm">
                Import {preview.summary.validCount} valid row(s) as{" "}
                <strong>{sourceType}</strong>
                {filename ? ` from ${filename}` : ""}. Invalid rows are kept in
                the batch log but not written as facts. Insight pages will use
                the confirmed facts automatically.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button disabled={busy} onClick={() => void onConfirm()}>
                  Confirm import
                </Button>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => setStage("map")}
                >
                  Back
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import history</CardTitle>
          <CardDescription>
            View the original file you uploaded, or remove an import to delete
            that batch&apos;s facts and refresh the outlook.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {batches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No imports yet.</p>
          ) : (
            batches.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
              >
                <div className="space-y-0.5 text-sm">
                  <div className="font-medium">{batchHeading(b)}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.status} · {formatWhen(b.createdAt)} ·{" "}
                    {b.createdCount ?? 0} new · {b.skippedCount ?? 0} skipped ·{" "}
                    {b.errorCount ?? 0} errors
                    {b.periodStart
                      ? ` · ${b.periodStart} → ${b.periodEnd ?? b.periodStart}`
                      : ""}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy || viewLoading}
                    onClick={() => void onView(b.id)}
                  >
                    View
                  </Button>
                  {b.status === "imported" || b.status === "partial" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void onReverse(b.id)}
                    >
                      Remove import
                    </Button>
                  ) : (
                    <Badge variant="outline">{b.status}</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Sheet
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) {
            setViewDetail(null);
            setViewError(null);
            setViewLoadingMore(false);
          }
        }}
      >
        <SheetContent className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:!max-w-3xl lg:!max-w-5xl">
          <SheetHeader className="shrink-0 space-y-1 border-b px-6 py-4 text-left">
            <SheetTitle>
              {viewDetail
                ? batchHeading(viewDetail.batch)
                : "Imported file"}
            </SheetTitle>
            <SheetDescription>
              {viewDetail
                ? [
                    viewDetail.batch.status,
                    formatWhen(viewDetail.batch.createdAt),
                    viewDetail.totalRows
                      ? `${viewDetail.totalRows} row${viewDetail.totalRows === 1 ? "" : "s"}`
                      : null,
                    viewDetail.batch.periodStart
                      ? `${viewDetail.batch.periodStart} → ${viewDetail.batch.periodEnd ?? viewDetail.batch.periodStart}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : "What was in the file you uploaded."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4 text-sm">
            {viewLoading ? (
              <SoftWait
                preset="import"
                compact
                className="min-h-[min(50vh,22rem)]"
              />
            ) : null}
            {!viewLoading && viewError ? (
              <p className="text-destructive">{viewError}</p>
            ) : null}
            {!viewLoading && viewDetail?.message ? (
              <p className="text-muted-foreground">{viewDetail.message}</p>
            ) : null}

            {!viewLoading && viewDetail ? (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {viewDetail.batch.createdCount ?? 0} new
                </Badge>
                <Badge variant="outline">
                  {viewDetail.batch.skippedCount ?? 0} skipped
                </Badge>
                <Badge
                  variant={
                    (viewDetail.batch.errorCount ?? 0) > 0
                      ? "destructive"
                      : "outline"
                  }
                >
                  {viewDetail.batch.errorCount ?? 0} errors
                </Badge>
                {viewDetail.batch.hasOriginal !== false ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                    onClick={() => void onDownloadOriginal(viewDetail.batch.id)}
                  >
                    Download original
                  </Button>
                ) : null}
              </div>
            ) : null}

            {!viewLoading && viewDetail && viewDetail.failedRows.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Rows that need attention ({viewDetail.failedRows.length}
                  {typeof viewDetail.batch.errorCount === "number" &&
                  viewDetail.batch.errorCount > viewDetail.failedRows.length
                    ? ` of ${viewDetail.batch.errorCount}`
                    : ""}
                  )
                </p>
                <ul className="max-h-36 space-y-2 overflow-y-auto">
                  {viewDetail.failedRows.map((f) => (
                    <li
                      key={f.rowNumber}
                      className="rounded-lg border border-destructive/25 bg-destructive/[0.04] px-3 py-2 text-xs"
                    >
                      <p className="font-medium">Row {f.rowNumber}</p>
                      <p className="text-muted-foreground">
                        {(f.errorCodes ?? []).join(", ") || "error"}
                        {f.errorMessage ? ` · ${f.errorMessage}` : ""}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {payloadPreview(f.sample)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {!viewLoading && viewDetail && viewDetail.headers.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    File contents
                    {viewDetail.truncated
                      ? ` · showing ${viewDetail.rows.length} of ${viewDetail.totalRows}`
                      : ` · ${viewDetail.totalRows} row${viewDetail.totalRows === 1 ? "" : "s"}`}
                  </p>
                </div>
                <ImportDataTable
                  headers={viewDetail.headers}
                  rows={viewTableRows}
                  emptyMessage="This file has no data rows."
                  footerExtra={
                    viewDetail.truncated ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={viewLoadingMore}
                        onClick={() => void onViewMore()}
                      >
                        {viewLoadingMore
                          ? "Loading…"
                          : `Load 100 more (${viewDetail.totalRows - viewDetail.rows.length} left)`}
                      </Button>
                    ) : null
                  }
                />
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
