import type { Pages } from "./pages";
import type { Page, Settings } from "./types";

declare global {
  interface Window {
    mgcrtContainer: HTMLElement;
    mgcrtNavigate(nextPage: string): void;
    mgcrtPages: Pages;
    mgcrtSettings: Readonly<Settings>;
  }

  interface ObjectConstructor {
    keys<T>(object: T): Array<keyof T>;
  }
}

export { default as init } from "./init";

export { loadPage, loadComponent } from "./load";
export {
  MgcrtError,
  MgcrtRedirect,
  findPage,
  createPage,
  checkPageReloadable,
} from "./misc";
export type { Pages, Page, Settings };
export type { Component, PreloadMiddleware, InitOptions } from "./types";
