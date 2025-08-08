import type { AuditResult } from "../../types";

export function serializeJson(res: AuditResult): string {
  return JSON.stringify(res, null, 2);
}
