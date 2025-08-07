import { ConfigSchema, type LintConfig } from "./schema.js";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

export function defineConfig(cfg: LintConfig): LintConfig {
  return cfg; // helper for intellisense
}

export async function loadConfig(cwd = process.cwd()): Promise<LintConfig> {
  const candidates = [
    "media.config.js",
    "media.config.mjs",
    "media.config.cjs",
    "media.config.json",
  ];

  let foundPath: string | undefined;
  for (const f of candidates) {
    const p = path.resolve(cwd, f);
    if (fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  if (!foundPath) {
    throw new Error(
      `media-lint: No configuration file found in "${cwd}". Expected one of: ${candidates.join(
        ", "
      )}`
    );
  }

  let mod: any;
  try {
    mod = await import(pathToFileURL(foundPath).href);
  } catch (err: any) {
    throw new Error(
      `media-lint: Failed to load configuration file "${foundPath}".\n` +
        `Reason: ${err?.message || err}`
    );
  }

  const cfg = mod?.default ?? mod;
  const parsed = ConfigSchema.safeParse(cfg);

  if (!parsed.success) {
    const issues = parsed.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(
      `media-lint: Configuration validation failed for "${foundPath}".\n` +
        `Issues:\n${issues}`
    );
  }

  return parsed.data;
}
