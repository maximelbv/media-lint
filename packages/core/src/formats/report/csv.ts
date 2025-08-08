import type { AuditResult } from "../../types";

export function serializeCsv(res: AuditResult): string {
  const header = "file,severity,message";
  const lines = res.diagnostics.map(
    (d) => `${d.file},${d.severity},"${d.message.replace(/"/g, '""')}"`
  );
  return [header, ...lines].join("\n");
}
