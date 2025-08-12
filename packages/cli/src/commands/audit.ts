import { loadConfig, lint } from "media-lint-core";
import { outputFormats, OUTPUT_FORMATS } from "media-lint-core/formats";
import { handleReportFlag } from "../flags/report";

export type AuditOpts = { reportFormat?: string; reportPath?: string };

export async function runAudit(opts: AuditOpts = {}): Promise<number> {
  const cfg = await loadConfig();
  const res = await lint(cfg);

  const outputFmt = cfg.output?.format ?? OUTPUT_FORMATS[0];
  if (outputFormats[outputFmt]) {
    outputFormats[outputFmt](res);
  } else if (res.diagnostics.length === 0) {
    console.log("No issues found.");
  }

  const wantsReport =
    !!(opts.reportFormat || opts.reportPath) || cfg.report?.enabled === true;
  if (wantsReport) {
    await handleReportFlag(res, opts, cfg);
  }

  return res.diagnostics.some((d) => d.severity === "error") ? 1 : 0;
}
