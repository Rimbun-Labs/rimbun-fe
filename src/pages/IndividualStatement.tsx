import React, { useState } from "react";
import { FileText } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  readingErrorMessage,
  readStatementFiles,
} from "@/lib/api/consumerStatementApi";
import type { ConsumerStatementReading } from "@/lib/api/types/consumerStatement";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function money(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return rupiah.format(value);
}

function share(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function yesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

const IndividualStatement: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [reading, setReading] = useState<ConsumerStatementReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFiles = (list: FileList | null) => {
    const next = Array.from(list ?? []).slice(0, 3);
    setFiles(next);
    setError(null);
  };

  const onRead = async () => {
    setLoading(true);
    setError(null);
    try {
      setReading(await readStatementFiles(files));
    } catch (err) {
      setReading(null);
      setError(readingErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const spend = reading
    ? Object.entries(reading.labeledSpend).sort((a, b) => b[1] - a[1])
    : [];
  const maxSpend = spend[0]?.[1] ?? 0;

  return (
    <PageContainer>
      <PageHeader
        icon={FileText}
        title="Individual statement"
        description="Read one to three monthly statement files. Nothing is saved."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statement files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept=".txt,text/plain"
            multiple
            onChange={(event) => onFiles(event.target.files)}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-sm file:text-foreground"
          />
          <p className="text-sm text-muted-foreground">
            Choose up to three text files, one month each. PDF files are not read here.
          </p>
          {files.length > 0 ? (
            <ul className="text-sm text-foreground">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}`}>{file.name}</li>
              ))}
            </ul>
          ) : null}
          <Button onClick={onRead} disabled={loading || files.length === 0}>
            {loading ? "Reading…" : "Read statements"}
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Could not read the statements</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {reading ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Cover</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>{reading.runway.weeksOfLivingCosts} weeks of living costs</p>
                <p>{reading.runway.weeksOfMustPay} weeks of must-pay</p>
                <p className="text-muted-foreground">Balance {money(reading.runway.balance)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Salary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>{reading.income.salaryDetected ? money(reading.income.salaryAmount) : "Not detected"}</p>
                <p>Day {reading.income.salaryDay ?? "—"}</p>
                <p>Stable: {yesNo(reading.income.salaryStable)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Side income</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>{money(reading.income.sideIncomeAmount)}</p>
                <p>Stable: {yesNo(reading.income.sideIncomeStable)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Calls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>Suggest a buffer: {yesNo(reading.product.suggestBuffer)}</p>
                <p>Suggest more credit: {yesNo(reading.product.suggestMoreCredit)}</p>
                <p>Travel is one month: {yesNo(reading.product.episodicTravel)}</p>
                <p>Card repeats: {yesNo(reading.minimumPayment)}</p>
                <p>New loan in latest month: {yesNo(reading.newLoanInLatestMonth)}</p>
                <p>
                  Offers:{" "}
                  {reading.product.offerFamilies.length > 0
                    ? reading.product.offerFamilies.join(", ")
                    : "None"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Months</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-2 pr-3 font-medium">Month</th>
                    <th className="py-2 pr-3 font-medium">Closing</th>
                    <th className="py-2 pr-3 font-medium">Direction</th>
                    <th className="py-2 pr-3 font-medium">Debt</th>
                    <th className="py-2 pr-3 font-medium">Debt / out</th>
                    <th className="py-2 pr-3 font-medium">Debt / in</th>
                    <th className="py-2 pr-3 font-medium">Debt + rent / in</th>
                    <th className="py-2 pr-3 font-medium">Surplus</th>
                    <th className="py-2 pr-3 font-medium">Cash</th>
                    <th className="py-2 pr-3 font-medium">Left the statement</th>
                    <th className="py-2 font-medium">Card repeats</th>
                  </tr>
                </thead>
                <tbody>
                  {reading.months.map((month) => (
                    <tr key={month.period} className="border-b border-border/60">
                      <td className="py-2 pr-3">{month.period}</td>
                      <td className="py-2 pr-3">{money(month.closingBalance)}</td>
                      <td className="py-2 pr-3">{month.direction}</td>
                      <td className="py-2 pr-3">{money(month.debtRepayments)}</td>
                      <td className="py-2 pr-3">{share(month.debtShare)}</td>
                      <td className="py-2 pr-3">{share(month.debtShareOfIncome)}</td>
                      <td className="py-2 pr-3">{share(month.debtAndRentShareOfIncome)}</td>
                      <td className="py-2 pr-3">{money(month.surplus)}</td>
                      <td className="py-2 pr-3">{money(month.cashWithdrawals)}</td>
                      <td className="py-2 pr-3">
                        {money(month.offStatementAmount)} ({share(month.offStatementShare)})
                      </td>
                      <td className="py-2">{yesNo(month.cardPaymentRepeats)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Spend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {spend.length === 0 ? (
                <p className="text-sm text-muted-foreground">No labeled spend.</p>
              ) : (
                spend.map(([label, amount]) => (
                  <div key={label} className="grid grid-cols-[160px_1fr_120px] items-center gap-3 text-sm">
                    <span className="truncate">{label.replace(/_/g, " ")}</span>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${maxSpend > 0 ? (amount / maxSpend) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-right">{money(amount)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </PageContainer>
  );
};

export default IndividualStatement;
