import { createRequire } from "module";
const require = createRequire(import.meta.url);

export function getVersion(): string {
  const { version } = require("../../package.json");
  return version as string;
}
