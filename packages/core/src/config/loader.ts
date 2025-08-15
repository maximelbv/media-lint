import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { ConfigSchema, type LintConfig } from "./schema.js";

type Maybe<T> = T | undefined;

const DEFAULT_CANDIDATES = [
  "media-config.json",
  "media-config.js",
  "media-config.mjs",
  "media.config.json",
  "media.config.js",
  "media.config.mjs",
];

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function findDefaultConfig(cwd: string): Promise<Maybe<string>> {
  for (const name of DEFAULT_CANDIDATES) {
    const full = path.resolve(cwd, name);
    if (await fileExists(full)) return full;
  }
  return undefined;
}

async function loadJsonConfig(absPath: string): Promise<unknown> {
  const raw = await fs.readFile(absPath, "utf8");
  return JSON.parse(raw);
}

async function loadJsConfig(absPath: string): Promise<unknown> {
  const url = pathToFileURL(absPath).href;
  const mod = await import(url);
  return mod?.default ?? mod;
}

function isJsonExt(p: string) {
  return /\.json$/i.test(p);
}
function isJsExt(p: string) {
  return /\.(mjs|js)$/i.test(p);
}

export async function loadConfig(cliPath?: string): Promise<LintConfig> {
  const cwd = process.cwd();

  let resolved: Maybe<string>;
  if (cliPath) {
    resolved = path.isAbsolute(cliPath) ? cliPath : path.resolve(cwd, cliPath);
    if (!(await fileExists(resolved))) {
      throw new Error(`Configuration file not found at: ${resolved}`);
    }
  } else {
    resolved = await findDefaultConfig(cwd);
  }

  if (!resolved) {
    throw new Error(
      `No configuration file found. Looked for: ${DEFAULT_CANDIDATES.join(
        ", "
      )}`
    );
  }

  let rawConfig: unknown;
  if (isJsonExt(resolved)) {
    rawConfig = await loadJsonConfig(resolved);
  } else if (isJsExt(resolved)) {
    rawConfig = await loadJsConfig(resolved);
  } else {
    throw new Error(
      `Unsupported config extension for: ${resolved}. Use .json, .js, or .mjs`
    );
  }

  const parsed = ConfigSchema.safeParse(rawConfig);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n - ");
    throw new Error(`Invalid configuration:\n - ${issues}`);
  }

  return parsed.data;
}
