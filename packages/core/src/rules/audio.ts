import type { LintConfig } from "../config/schema.js";
import type { Diagnostic } from "./engine.js";
import { helpers } from "./engine.js";

export type AudMeta = {
  duration?: number;
  sample_rate?: number;
  bytes: number;
};

export async function applyAudioRules(
  file: string,
  meta: AudMeta,
  config: LintConfig
) {
  const diags: Diagnostic[] = [];
  const r = config.rules.audio;
  if (!r) return diags;

  if (r.maxDuration != null) {
    const lim = helpers.parseSeconds(r.maxDuration);
    if (lim && meta.duration && meta.duration > lim) {
      diags.push({
        file,
        rule: "audio.maxDuration",
        message: `duration=${meta.duration.toFixed(2)}s > ${lim}s`,
        severity: "error",
      });
    }
  }
  if (
    r.sampleRate &&
    meta.sample_rate &&
    !r.sampleRate.includes(meta.sample_rate)
  ) {
    diags.push({
      file,
      rule: "audio.sampleRate",
      message: `sample_rate=${meta.sample_rate} not in [${r.sampleRate.join(
        ", "
      )}]`,
      severity: "warn",
    });
  }
  return diags;
}
