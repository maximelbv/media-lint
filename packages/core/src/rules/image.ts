import type { LintConfig } from "../config/schema.js";
import type { Diagnostic } from "./engine.js";

export type ImgMeta = {
  width?: number;
  height?: number;
  megapixels?: number;
  bytes: number;
};

export async function applyImageRules(
  file: string,
  meta: ImgMeta,
  config: LintConfig
) {
  const diags: Diagnostic[] = [];
  const r = config.rules.image;
  if (!r) return diags;

  if (r.maxWidth && meta.width && meta.width > r.maxWidth) {
    diags.push({
      file,
      rule: "image.maxWidth",
      message: `width=${meta.width} > ${r.maxWidth}`,
      severity: "error",
    });
  }
  if (r.maxHeight && meta.height && meta.height > r.maxHeight) {
    diags.push({
      file,
      rule: "image.maxHeight",
      message: `height=${meta.height} > ${r.maxHeight}`,
      severity: "error",
    });
  }
  if (r.maxMegapixels && meta.megapixels && meta.megapixels > r.maxMegapixels) {
    diags.push({
      file,
      rule: "image.maxMegapixels",
      message: `megapixels=${meta.megapixels.toFixed(2)} > ${r.maxMegapixels}`,
      severity: "error",
    });
  }
  return diags;
}
