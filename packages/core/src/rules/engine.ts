import { listFiles } from "../scan/globber.js";
import { detectType, type MediaType } from "../utils/filetype.js";
import { readImageMeta, readAVMeta } from "../scan/metadata.js";
import { parseBytes, parseSeconds } from "../utils/units.js";
import type { LintConfig } from "../config/schema.js";
import { applyGeneralRules } from "./general.js";
import { applyImageRules } from "./image.js";
import { applyVideoRules } from "./video.js";
import { applyAudioRules } from "./audio.js";

export type Diagnostic = {
  file: string;
  rule: string;
  message: string;
  severity: "error" | "warn";
};

export type LintResult = { diagnostics: Diagnostic[] };

export async function lint(config: LintConfig): Promise<LintResult> {
  const files = await listFiles(config.include, config.exclude);
  const diags: Diagnostic[] = [];

  for (const file of files) {
    const { media, ext } = await detectType(file);
    // general rules
    diags.push(...(await applyGeneralRules(file, ext, config)));

    if (media === "image") {
      const meta = await readImageMeta(file);
      diags.push(...(await applyImageRules(file, meta, config)));
    } else if (media === "video") {
      const meta = await readAVMeta(file);
      diags.push(...(await applyVideoRules(file, meta as any, config)));
    } else if (media === "audio") {
      const meta = await readAVMeta(file);
      diags.push(...(await applyAudioRules(file, meta as any, config)));
    }
  }

  return { diagnostics: diags };
}

// helpers exposés pour les règles
export const helpers = { parseBytes, parseSeconds };
