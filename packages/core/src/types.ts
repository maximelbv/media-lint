export type MediaType = "image" | "video" | "audio" | "svg" | "other";

export type DiagnosticSeverity = "error" | "warning";

export interface Diagnostic {
  file: string;
  severity: DiagnosticSeverity;
  message: string;
  mediaType?: MediaType;
  actual?: unknown;
  expected?: unknown;
}

export interface AuditResult {
  diagnostics: Diagnostic[];
}
