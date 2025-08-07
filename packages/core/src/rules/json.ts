import type { LintResult } from "../rules/engine.js";
import fs from "node:fs/promises";
import path from "node:path";

export async function writeJson(res: LintResult, outFile: string) {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(res, null, 2), "utf8");
}
