#!/usr/bin/env node
import { Command } from "commander";
import { loadConfig } from "media-lint-core";
import { lint } from "media-lint-core";
import { printTable } from "media-lint-core";
import { writeJson } from "media-lint-core";

const program = new Command();
program
  .name("media-lint")
  .description("Audit des médias via configuration")
  .version("0.1.0");

program
  .command("audit")
  .option("--json <path>", "Chemin du rapport JSON")
  .action(async (opts) => {
    try {
      const cfg = await loadConfig();
      const res = await lint(cfg);

      if (cfg.report.format.includes("table")) printTable(res);
      if (cfg.report.format.includes("json") || opts.json) {
        await writeJson(
          res,
          opts.json ?? cfg.report.outFile ?? "reports/media-lint.json"
        );
        console.log("Rapport JSON écrit.");
      }

      const hasError = res.diagnostics.some((d) => d.severity === "error");
      process.exit(hasError ? 1 : 0);
    } catch (e: any) {
      console.error(e?.message ?? e);
      process.exit(2);
    }
  });

program.parse();
