import { loadConfig, lint } from "media-lint-core";
import { outputFormats, reportFormats } from "media-lint-core/formats";
import { handleReportFlag } from "../flags/report.js";
import type { RunAudit } from "../constants/audit.js";
import { handleOutput } from "../utils/output.js";

export async function runAudit(
  ...args: Parameters<RunAudit>
): ReturnType<RunAudit> {
  const [opts = {}] = args;
  const cfg = await loadConfig();
  const res = await lint(cfg);

  handleOutput(res, cfg, outputFormats);

  const wantsReport =
    !!(opts.reportFormat || opts.reportPath) || cfg.report?.enabled === true;

  if (wantsReport) {
    await handleReportFlag(res, opts, cfg, reportFormats);
  }

  return res.diagnostics?.some((d) => d.severity === "error") ? 1 : 0;
}
