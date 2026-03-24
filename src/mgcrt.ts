import type { Page, Settings } from "./types";

declare global {
  interface Window {
    mgcrtContainer: HTMLElement;
    mgcrtPages: Page[];
    mgcrtSettings: Settings;
  }

  interface ObjectConstructor {
    keys<T>(object: T): Array<keyof T>;
  }
}

export { default as init } from "./init";
export { default as loadPage } from "./loadPage";

export { MgcrtError, findPage, checkPageReloadable } from "./misc";
export type { Page, Settings };
export type { InitOptions } from "./types";
