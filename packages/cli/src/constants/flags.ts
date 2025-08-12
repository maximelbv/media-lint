import { REPORT_FORMATS } from "media-lint-core/formats";

export const DEFAULT_REPORT_PATH = "reports/media-lint";

export const REPORT_FLAGS = {
  FORMAT: "--report-format <format>",
  PATH: "--report-path <path>",
} as const;

export const GLOBAL_FLAGS = {} as const;

export type ReportFormat = (typeof REPORT_FORMATS)[number];

export type ReportFlagOpts = Readonly<{
  reportFormat?: ReportFormat;
  reportPath?: string;
}>;

export type GlobalFlagOpts = Readonly<{}>;
