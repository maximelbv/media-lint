#!/usr/bin/env node
import { Command } from "commander";
import { loadConfig, lint } from "media-lint-core";
import {
  outputFormats,
  reportFormats,
  OUTPUT_FORMATS,
  REPORT_FORMATS,
} from "media-lint-core/formats";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const program = new Command();

program
  .name("media-lint")
  .description("Audit media files based on a configuration file")
  .version("0.1.0");

program
  .command("audit")
  .option(
    "--report-format <format>",
    `Override report format (${REPORT_FORMATS.join(", ")})`
  )
  .option("--report-path <path>", "Override report path")
  .action(async (opts) => {
    try {
      const cfg = await loadConfig();
      const res = await lint(cfg);

      const outputFmt = cfg.output?.format ?? OUTPUT_FORMATS[0];
      if (outputFormats[outputFmt]) {
        outputFormats[outputFmt](res);
      } else if (res.diagnostics.length === 0) {
        console.log("No issues found.");
      }

      const flagWantsReport = opts.reportFormat || opts.reportPath;
      const cfgWantsReport = cfg.report?.enabled === true;

      if (flagWantsReport || cfgWantsReport) {
        const fmt = (opts.reportFormat ||
          cfg.report?.format ||
          REPORT_FORMATS[0]) as (typeof REPORT_FORMATS)[number];
        const outPath =
          opts.reportPath || cfg.report?.path || `reports/media-lint.${fmt}`;
        const serializer = reportFormats[fmt];
        if (!serializer) throw new Error(`Unknown report format: ${fmt}`);
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, serializer(res));
        console.log(`Report saved to: ${outPath}`);
      }

      process.exit(res.diagnostics.some((d) => d.severity === "error") ? 1 : 0);
    } catch (e: any) {
      console.error(e?.message ?? e);
      process.exit(2);
    }
  });

program.parse();
