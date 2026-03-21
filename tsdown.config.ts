import { defineConfig } from "tsdown";
import fs from "node:fs";

function bannify(text: string) {
  return `/*\n * ${text.trim().split("\n").join("\n * ")}\n */`;
}

export default defineConfig({
  dts: true,
  exports: true,
  devtools: true,
  minify: true,
  clean: true,
  sourcemap: true,
  unused: true,
  platform: "browser",
  attw: {
    profile: "esm-only",
  },
  banner: bannify(fs.readFileSync("./license", "utf-8")),
});
