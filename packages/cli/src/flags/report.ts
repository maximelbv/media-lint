import * as fs from "node:fs/promises";
import * as path from "node:path";
import { REPORT_FORMATS } from "media-lint-core/formats";
import type { LintConfig } from "media-lint-core";
import {
  DEFAULT_REPORT_PATH,
  type ReportFlagOpts,
  type ReportFormat,
} from "../constants/flags.js";
import { REPORT_MESSAGES } from "../constants/cli.js";

export async function handleReportFlag<T>(
  res: T,
  opts: ReportFlagOpts,
  cfg: LintConfig,
  serializerMap: Record<ReportFormat, (result: T) => string>
): Promise<void> {
  const rawFormat =
    opts.reportFormat ?? cfg.report?.format ?? REPORT_FORMATS[0];

  if (!REPORT_FORMATS.includes(rawFormat as ReportFormat)) {
    throw new Error(REPORT_MESSAGES.UNKNOWN_FORMAT(rawFormat));
  }
  const format = rawFormat as ReportFormat;

  const serializer = serializerMap[format];
  const outPath =
    opts.reportPath || cfg.report?.path || `${DEFAULT_REPORT_PATH}.${format}`;

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, serializer(res));

  console.log(REPORT_MESSAGES.SAVED(outPath));
}
