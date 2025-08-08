import type { AuditResult } from "../../types";

export function printStylish(res: AuditResult): void {
  res.diagnostics.forEach((d) => {
    console.log(`${d.file}`);
    console.log(`  ${d.severity === "error" ? "✖" : "⚠"} ${d.message}`);
  });
}
