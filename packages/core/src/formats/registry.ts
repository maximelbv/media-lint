import type { AuditResult } from "../types";

import { printTable } from "./output/table";
import { printSummary } from "./output/summary";
import { printStylish } from "./output/stylish";

import { serializeJson } from "./report/json";
import { serializeNdjson } from "./report/ndjson";
import { serializeCsv } from "./report/csv";

export const OUTPUT_FORMATS = ["table", "summary", "stylish"] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

export const REPORT_FORMATS = ["json", "ndjson", "csv"] as const;
export type ReportFormat = (typeof REPORT_FORMATS)[number];

export const outputFormats: Record<OutputFormat, (res: AuditResult) => void> = {
  table: printTable,
  summary: printSummary,
  stylish: printStylish,
};

export const reportFormats: Record<ReportFormat, (res: AuditResult) => string> =
  {
    json: serializeJson,
    ndjson: serializeNdjson,
    csv: serializeCsv,
  };
