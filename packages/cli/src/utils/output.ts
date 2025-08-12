import { OUTPUT_FORMATS } from "media-lint-core/formats";
import type { LintConfig } from "media-lint-core";

export function handleOutput<
  T extends { diagnostics?: { severity: string }[] }
>(res: T, cfg: LintConfig, serializers: Record<string, (r: T) => void>): void {
  const fmt = cfg.output?.format ?? OUTPUT_FORMATS[0];
  const render = serializers[fmt];

  if (render) {
    render(res);
    return;
  }

  if (!res.diagnostics || res.diagnostics.length === 0) {
    console.log("No issues found.");
  }
}
