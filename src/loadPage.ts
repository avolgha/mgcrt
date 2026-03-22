import { MgcrtError } from "./misc";
import type { Page } from "./types";

/**
 * load the current page into the container.
 *
 * if there is a loading element specified, the preload function will be called
 * asynchronously loading data which will then be passed on to populate the
 * template.
 *
 * you might want to use this function with the `findPage(string)` function which
 * searches for a page matching a specific path in the router.
 *
 * @param page the page object that should be loaded.
 */
export default function loadPage<PageData = never>(page: Page<PageData>) {
  if (!window.mgcrtContainer) {
    throw new MgcrtError("router was corrupted or not initialized.");
  }

  if (!page.loadingElement) {
    const template = document.importNode(page.template, true);
    page.populate(template);
    window.mgcrtContainer.replaceChildren(template);
    document.location.hash = page.path;
    return;
  }

  if (!page.preload) {
    throw new MgcrtError(
      `loading element was specified but no preload function exists. (page: '${page.path}')`,
    );
  }

  window.mgcrtContainer.replaceChildren(page.loadingElement);
  page.preload().then((data) => {
    const template = document.importNode(page.template, true);
    page.populate(template, data);
    window.mgcrtContainer.replaceChildren(template);
    document.location.hash = page.path;
  });
}
