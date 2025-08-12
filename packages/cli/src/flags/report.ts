import { reportFormats, REPORT_FORMATS } from "media-lint-core/formats";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export type ReportOpts = { reportFormat?: string; reportPath?: string };

export async function handleReportFlag(
  res: any,
  opts: ReportOpts,
  cfg: any
): Promise<void> {
  const wanted = (opts.reportFormat ??
    cfg.report?.format ??
    REPORT_FORMATS[0]) as (typeof REPORT_FORMATS)[number];
  const serializer = reportFormats[wanted];
  if (!serializer) throw new Error(`Unknown report format: ${wanted}`);
  const outPath =
    opts.reportPath || cfg.report?.path || `reports/media-lint.${wanted}`;
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, serializer(res));
  console.log(`Report saved to: ${outPath}`);
}
