// packages/cli/src/utils/get-version.ts
import { readFileSync } from "node:fs";
import { findNearestFile, getCurrentFileDir } from "./file-locator";

let _cachedVersion: string | undefined;

export function getVersion(): string {
  if (_cachedVersion) return _cachedVersion;

  const currentDir = getCurrentFileDir();
  const pkgPath = findNearestFile(currentDir, "package.json");

  const raw = readFileSync(pkgPath, "utf8");
  const { version } = JSON.parse(raw) as { version?: string };

  _cachedVersion = version ?? "0.0.0";
  return _cachedVersion;
}
