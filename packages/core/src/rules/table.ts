import type { LintResult } from "../rules/engine.js";

export function printTable(res: LintResult) {
  if (!res.diagnostics.length) {
    console.log("✓ Aucun problème détecté.");
    return;
  }
  for (const d of res.diagnostics) {
    const sev = d.severity === "error" ? "ERROR" : "WARN ";
    console.log(`${sev}  ${d.file}  ${d.rule}  ${d.message}`);
  }
  console.log(`\n${res.diagnostics.length} problème(s).`);
}
