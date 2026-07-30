import { loadPage } from "./load";
import { checkPageReloadable, findPage, MgcrtError } from "./misc";
import { Pages } from "./pages";
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
export default function init<SharedContext = never>(
  options: InitOptions<SharedContext>,
) {
  if (window.mgcrtContainer) {
    throw new MgcrtError("there is already a mgcrt instance running.");
  }

  if (!options.container) {
    throw new MgcrtError("container element does not exists.");
  }

  window.mgcrtContainer = options.container;
  window.mgcrtPages = new Pages(options.pages);
  window.mgcrtSettings = Object.freeze(
    Object.assign(Object.create(defaultSettings), options.settings || {}),
  );

  window.mgcrtNavigate = function (nextPage: string) {
    if (!checkPageReloadable(nextPage)) {
      return;
    }

    const page = findPage(nextPage);
    if (page) loadPage(page, baseContext);
  };

  const baseContext = Object.create(
    options.initialContext || {},
  ) as SharedContext;

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    if (!event.target.dataset.page) return;
    const nextPage = event.target.dataset.page;

    window.mgcrtNavigate(nextPage);
  });

  loadPage(findPage(document.location.hash || "/"), baseContext);
}
