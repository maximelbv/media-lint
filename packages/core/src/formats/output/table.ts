import type { AuditResult } from "../../types";

export function printTable(res: AuditResult): void {
  console.table(
    res.diagnostics.map((d) => ({
      file: d.file,
      severity: d.severity,
      message: d.message,
    }))
  );
}
