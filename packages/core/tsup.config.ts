import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/formats/registry.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
});
