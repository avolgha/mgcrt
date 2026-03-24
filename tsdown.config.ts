import { defineConfig } from "tsdown";
import fs from "node:fs";

function bannify(text: string) {
  return `/*\n * ${text.trim().split("\n").join("\n * ")}\n */`;
}

export default defineConfig({
  banner: bannify(fs.readFileSync("./license", "utf-8")),
  clean: true,
  dts: true,
  exports: true,
  minify: true,
  platform: "browser",
  sourcemap: true,
});
