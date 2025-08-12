#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();
program
  .name("media-lint")
  .description("Audit media files based on a configuration file")
  .version("0.1.0");

program
  .command("audit")
  .option("--report-format <format>")
  .option("--report-path <path>")
  .action(async (opts) => {
    try {
      const { runAudit } = await import("./commands/audit.js");
      const code = await runAudit(opts);
      process.exit(code);
    } catch (e: any) {
      console.error(e?.message ?? e);
      process.exit(2);
    }
  });

program.parse();
