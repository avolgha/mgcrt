import type { Page } from "./types";

/**
 * the default error thrown by mgcrt.
 *
 * prefixes all error messages with a `mgcrt:`.
 */
export class MgcrtError extends Error {
  constructor(message: string) {
    super(`mgcrt: ${message}`);
  }
}

/**
 * tries to find a page matching the specified path in the router definitions.
 * if no page could be found, an error will be thrown.
 *
 * @param path the path of the page to find.
 * @returns the found page.
 */
export function findPage<PageData = never>(path: string) {
  if (!window.mgcrtPages)
    throw new MgcrtError("router was corrupted or not initialized.");

  const realPath = path.toLowerCase().replace(/^#?/g, "");
  const page = window.mgcrtPages.find((page) => page.path === realPath);
  if (page) return page as Page<PageData>;

  // TODO: add a 404 page/ component.
  throw new MgcrtError(`could not find page. (path: '${path}')`);
}

/**
 * checks if when navigating to a new page, the page should be reloaded or not.
 *
 * this is only then useful, when you want to listen to user link clicks and
 * check if a reload should be performed when the user tries to load the same
 * page he already is on.
 *
 * if the user tries to load a different page, this function will always return
 * `true` since a reload is necessary in this case.
 *
 * the output can be tweaked with the `linkReload` setting in the `init` function.
 *
 * @param path the path to check.
 * @returns whether a component reload should be performed.
 */
export function checkPageReloadable(path: string) {
  if (!window.mgcrtSettings?.linkReload)
    throw new MgcrtError("router was corrupted or not initialized.");

  if (window.location.hash.substring(1) !== path) return true;

  if (typeof window.mgcrtSettings?.linkReload === "boolean")
    return window.mgcrtSettings.linkReload;

  return window.mgcrtSettings?.linkReload(path);
}
