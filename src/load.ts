import { errorNotInit, findPage, MgcrtError, MgcrtRedirect } from "./misc";
import type { Component, Page } from "./types";

/**
 * load the current page into the page container specified in `init`.
 *
 * you might want to use this function with the `findPage(string)` function which
 * searches for a page matching a specific path in the router.
 *
 * @param page the page object that should be loaded.
 * @see loadComponent
 */
export function loadPage<SharedContext = never, PageData = never>(
  page: Page<SharedContext, PageData>,
  context: SharedContext
) {
  if (!window.mgcrtContainer) throw errorNotInit();

  loadComponent(window.mgcrtContainer, page, context, () => {
    document.location.hash = page.path;
  });
};

/**
 * load a component into a container.
 *
 * if there is a loading element specified, the preload function will be called
 * asynchronously loading data which will then be passed on to populate the
 * template.
 *
 * @param container the container you want to put the component into.
 * @param component the component you want to add to the container.
 * @param onFinish an event function for when the component is fully loaded.
 */
export function loadComponent<SharedContext = never, ComponentData = never>(
  container: HTMLElement,
  component: Component<SharedContext, ComponentData>,
  context: SharedContext,
  onFinish?: () => void,
) {
  if (!container) {
    throw new MgcrtError("cannot load component without container element.");
  }

  if (component.loadingElement === undefined) {
    const template = document.importNode(component.template, true);
    component.populate && component.populate(template, context);
    container.replaceChildren(template);
    onFinish && onFinish();
    return;
  }

  if (!component.preload) {
    throw new MgcrtError(
      `loading element was specified but no preload function exists. (component: '${component.name}')`,
    );
  }

  component.loadingElement && container.replaceChildren(component.loadingElement);
  component.preload(context).then((data) => {
    const template = document.importNode(component.template, true);
    component.populate && component.populate(template, context, data);
    container.replaceChildren(template);
    onFinish && onFinish();
  }).catch((reason) => {
    if (reason instanceof MgcrtRedirect) {
      loadPage<SharedContext & { error_notFound: MgcrtRedirect }, ComponentData>(findPage(reason.path), Object.assign(context, { error_notFound: reason }));
    } else {
      throw new Error(`preloading component '${component.name}' failed with`, reason);
    }
  });
}
