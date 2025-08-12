export const CLI_NAME = "media-lint" as const;
export const CLI_DESCRIPTION =
  "Audit media files based on a configuration file" as const;

export const EXIT = {
  SUCCESS: 0,
  ERROR: 1,
  FATAL: 2,
} as const;

export const COMMAND = {
  AUDIT: "audit",
} as const;

export const REPORT_MESSAGES = {
  UNKNOWN_FORMAT: (format: string) => `Unknown report format: ${format}`,
  SAVED: (path: string) => `Report saved to: ${path}`,
} as const;
