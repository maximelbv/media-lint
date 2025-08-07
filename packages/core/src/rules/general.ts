import type { LintConfig } from "../config/schema.js";
import type { Diagnostic } from "./engine.js";
import { helpers } from "./engine.js";
import fs from "node:fs/promises";
import path from "node:path";

export async function applyGeneralRules(
  file: string,
  ext: string,
  config: LintConfig
) {
  const diags: Diagnostic[] = [];
  const { general } = config.rules;

  // maxBytes
  if (general.maxBytes != null) {
    const lim = helpers.parseBytes(general.maxBytes);
    const stat = await fs.stat(file);
    if (lim && stat.size > lim) {
      diags.push({
        file,
        rule: "general.maxBytes",
        message: `Fichier ${fmtBytes(stat.size)} > ${fmtBytes(lim)}`,
        severity: "error",
      });
    }
  }

  // allowedFormats
  if (general.allowedFormats && general.allowedFormats.length) {
    if (!general.allowedFormats.includes(ext)) {
      diags.push({
        file,
        rule: "general.allowedFormats",
        message: `Extension .${ext} non autorisée (autorisées: ${general.allowedFormats.join(
          ", "
        )})`,
        severity: "error",
      });
    }
  }

  // naming
  if (general.naming) {
    const base = path.basename(file);
    if (general.naming.noSpaces && /\s/.test(base)) {
      diags.push({
        file,
        rule: "general.naming.noSpaces",
        message: "Nom contient des espaces",
        severity: "warn",
      });
    }
    if (general.naming.pattern) {
      const re = new RegExp(general.naming.pattern);
      if (!re.test(base)) {
        diags.push({
          file,
          rule: "general.naming.pattern",
          message: `Nom n'égale pas le pattern: ${general.naming.pattern}`,
          severity: "warn",
        });
      }
    }
  }

  return diags;
}

function fmtBytes(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + " GB";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + " MB";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + " kB";
  return n + " B";
}
