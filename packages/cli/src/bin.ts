#!/usr/bin/env node
import { Command } from "commander";
import { CLI_DESCRIPTION, CLI_NAME, COMMAND } from "./constants/cli.js";
import { getVersion } from "./utils/get-version.js";
import type { AuditOpts, RunAudit } from "./constants/audit.js";
import { REPORT_FLAGS } from "./constants/flags.js";

const program = new Command()
  .name(CLI_NAME)
  .description(CLI_DESCRIPTION)
  .version(getVersion());

program
  .command(COMMAND.AUDIT)
  .option(REPORT_FLAGS.FORMAT)
  .option(REPORT_FLAGS.PATH)
  .action(async (opts: AuditOpts) => {
    try {
      const { runAudit } = (await import("./commands/audit.js")) as {
        runAudit: RunAudit;
      };
      const code = await runAudit(opts);
      process.exit(code);
    } catch (e: any) {
      console.error(e?.message ?? e);
      process.exit(2);
    }
  });

program.parse();
