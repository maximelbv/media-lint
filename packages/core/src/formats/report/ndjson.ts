import { AuditResult } from "../../types";

export function serializeNdjson(res: AuditResult): string {
  return res.diagnostics.map((d) => JSON.stringify(d)).join("\n");
}
