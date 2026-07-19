import { loadPage } from "./load";
import { checkPageReloadable, findPage, MgcrtError } from "./misc";
import type { InitOptions, Settings } from "./types";

const defaultSettings: Settings = {
  // motivation: will only be triggered if user tries to load the same page
  //             twice which is irrelevant in most cases.
  linkReload: false,

  // motivation: we dont implement default pages thus the user has to explicitly
  //             create one by himself. should be set to `true` in most cases.
  notFoundPage: false,
};

/**
 * initialize the router. any other function should be called after this one.
 *
 * @param options configuration of the router
 */
export default function init(options: InitOptions) {
  if (window.mgcrtContainer) {
    throw new MgcrtError("there is already a mgcrt instance running.");
  }

  if (!options.container) {
    throw new MgcrtError("container element does not exists.");
  }

  window.mgcrtContainer = options.container;
  window.mgcrtPages = options.pages.map((page) => {
    page.path = page.path.toLowerCase();
    return page;
  });
  window.mgcrtSettings = Object.freeze(
    Object.assign(Object.create(defaultSettings), options.settings || {}),
  );

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    if (!event.target.dataset.page) return;
    const nextPage = event.target.dataset.page;
    if (!checkPageReloadable(nextPage)) {
      return;
    }

    const page = findPage(nextPage);
    if (page) loadPage(page);
  });

  loadPage(findPage(document.location.hash || "/"));
}
