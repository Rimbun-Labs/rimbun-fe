import axios from "axios";
import { apiClient } from "./client";
import type { ConsumerStatementReading } from "./types/consumerStatement";

const MAX_FILES = 3;

export function readingErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { details?: unknown; message?: unknown } | undefined;
    if (typeof data?.details === "string" && data.details.length > 0) return data.details;
    if (typeof data?.message === "string" && data.message.length > 0) return data.message;
    if (error.response?.status === 401) return "Sign in again to read a statement.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Could not read these statements.";
}

export async function readStatementFiles(files: File[]): Promise<ConsumerStatementReading> {
  if (files.length < 1 || files.length > MAX_FILES) {
    throw new Error("Choose one to three monthly statement files.");
  }

  const statements = await Promise.all(
    files.map(async (file) => {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error(
          `${file.name} is a PDF. This screen reads statement text. If the statements are PDFs, the API needs to take the file.`
        );
      }
      const text = (await file.text()).trim();
      if (!text) {
        throw new Error(`${file.name} has no text to read.`);
      }
      return { text };
    })
  );

  const response = await apiClient.post("/dashboard/consumer/statement-reading", { statements });
  const reading = response.data?.data as ConsumerStatementReading | undefined;
  if (!reading?.months) {
    throw new Error("The reading did not come back in the expected shape.");
  }
  return reading;
}
