import type { GlobalFlagOpts, ReportFlagOpts } from "./flags.js";

export type AuditOpts = GlobalFlagOpts & ReportFlagOpts;

export type RunAudit = (opts: AuditOpts) => Promise<number>;
