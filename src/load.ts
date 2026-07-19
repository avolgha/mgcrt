import { errorNotInit, MgcrtError } from "./misc";
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
export function loadPage<PageData = never>(page: Page<PageData>) {
  if (!window.mgcrtContainer) throw errorNotInit();

  loadComponent(window.mgcrtContainer, page, () => {
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
export function loadComponent<ComponentData = never>(
  container: HTMLElement,
  component: Component<ComponentData>,
  onFinish?: () => void,
) {
  if (!container) {
    throw new MgcrtError("cannot load component without container element.");
  }

  if (!component.loadingElement) {
    const template = document.importNode(component.template, true);
    component.populate(template);
    container.replaceChildren(template);
    onFinish && onFinish();
    return;
  }

  if (!component.preload) {
    throw new MgcrtError(
      `loading element was specified but no preload function exists. (component: '${component.name}')`,
    );
  }

  container.replaceChildren(component.loadingElement);
  component.preload().then((data) => {
    const template = document.importNode(component.template, true);
    component.populate(template, data);
    container.replaceChildren(template);
    onFinish && onFinish();
  });
}
