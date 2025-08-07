import type { LintConfig } from "../config/schema.js";
import type { Diagnostic } from "./engine.js";
import { helpers } from "./engine.js";

export type VidMeta = {
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
  bytes: number;
};

export async function applyVideoRules(
  file: string,
  meta: VidMeta,
  config: LintConfig
) {
  const diags: Diagnostic[] = [];
  const r = config.rules.video;
  if (!r) return diags;

  if (r.maxDuration != null) {
    const lim = helpers.parseSeconds(r.maxDuration);
    if (lim && meta.duration && meta.duration > lim) {
      diags.push({
        file,
        rule: "video.maxDuration",
        message: `duration=${meta.duration.toFixed(2)}s > ${lim}s`,
        severity: "error",
      });
    }
  }
  if (r.maxWidth && meta.width && meta.width > r.maxWidth) {
    diags.push({
      file,
      rule: "video.maxWidth",
      message: `width=${meta.width} > ${r.maxWidth}`,
      severity: "error",
    });
  }
  if (r.maxHeight && meta.height && meta.height > r.maxHeight) {
    diags.push({
      file,
      rule: "video.maxHeight",
      message: `height=${meta.height} > ${r.maxHeight}`,
      severity: "error",
    });
  }
  if (r.maxFps && meta.fps && meta.fps > r.maxFps) {
    diags.push({
      file,
      rule: "video.maxFps",
      message: `fps=${meta.fps} > ${r.maxFps}`,
      severity: "error",
    });
  }
  return diags;
}
