import { existsSync } from "node:fs";
import * as path from "node:path";
import { FILE_MESSAGES } from "../constants/cli.js";
import { fileURLToPath } from "node:url";

export function findNearestFile(startDir: string, filename: string): string {
  const root = path.parse(startDir).root;

  for (let dir = path.resolve(startDir); ; dir = path.dirname(dir)) {
    const candidate = path.join(dir, filename);
    if (existsSync(candidate)) return candidate;
    if (dir === root) break;
  }

  throw new Error(FILE_MESSAGES.NOT_FOUND_UPWARDS(filename, startDir));
}

export function getCurrentFileDir(): string {
  try {
    return path.dirname(fileURLToPath((import.meta as any).url));
  } catch {
    return typeof __dirname !== "undefined" ? __dirname : process.cwd();
  }
}
