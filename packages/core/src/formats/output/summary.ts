import { AuditResult } from "../../types";

export function printSummary(res: AuditResult): void {
  const errors = res.diagnostics.filter((d) => d.severity === "error").length;
  const warnings = res.diagnostics.filter(
    (d) => d.severity === "warning"
  ).length;
  console.log(
    `${errors} errors, ${warnings} warnings in ${res.diagnostics.length} issues`
  );
}
