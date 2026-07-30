import { defineConfig, type UserConfig } from "tsdown";
import fs from "node:fs";

function bannify(text: string) {
  return `/*\n * ${text.trim().split("\n").join("\n * ")}\n */`;
}

const templateConfig: Partial<UserConfig> = {
  banner: bannify(fs.readFileSync("./license", "utf-8")),
  clean: true,
  dts: true,
  minify: true,
  platform: "browser",
  publint: true,
  sourcemap: true,
};

export default defineConfig([
  {
    ...templateConfig,
    entry: "./src/mgcrt.ts",
  },
  {
    ...templateConfig,
    entry: "./src/helper.ts",
  },
]);
