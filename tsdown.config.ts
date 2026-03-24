import { defineConfig } from "tsdown";
import fs from "node:fs";

function bannify(text: string) {
  return `/*\n * ${text.trim().split("\n").join("\n * ")}\n */`;
}

export default defineConfig({
  entry: "./src/mgcrt.ts",
  banner: bannify(fs.readFileSync("./license", "utf-8")),
  clean: true,
  dts: true,
  minify: true,
  platform: "browser",
  publint: true,
  sourcemap: true,
});
