export interface Page<PreloadData = never> {
  name?: string;
  path: string;
  template: HTMLElement;
  populate(element: Node, data?: PreloadData): void;
  loadingElement?: HTMLElement;
  preload?(): Promise<PreloadData>;
}

export interface InitOptions {
  container: HTMLElement;
  pages: Page[];
  settings?: {
    // TODO: mabye make setting a filter function for more flexibility.
    linkReload?: boolean;
  };
}

export type Settings = Required<InitOptions["settings"]>;

const defaultSettings: Settings = {
  linkReload: true,
};

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

// TODO: make links work completely case-insensitive.

const _err = (message: string) => new Error(`mgcrt: ${message}`);

export function loadPage<PageData = never>(page: Page<PageData>) {
  if (!window.mgcrtContainer) {
    throw _err("router was corrupted or not initialized.");
  }

  if (!page.loadingElement) {
    const template = document.importNode(page.template, true);
    page.populate(template);
    window.mgcrtContainer.replaceChildren(template);
    document.location.hash = page.path;
    return;
  }

  if (!page.preload) {
    throw _err(
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

export function findPage<PageData = never>(path: string) {
  if (!window.mgcrtPages)
    throw _err("router was corrupted or not initialized.");
  path = path.toLowerCase();
  if (path.startsWith("#")) path = path.substring(1);
  const page = window.mgcrtPages.find((page) => page.path === path);
  if (page) return page as Page<PageData>;
  throw _err(`could not find page. (path: '${path}')`);
}

export function init(options: InitOptions) {
  if (!options.container) {
    throw _err("container element does not exists.");
  }

  window.mgcrtContainer = options.container;
  window.mgcrtPages = options.pages;
  window.mgcrtSettings = defaultSettings;

  if (options.settings) {
    for (const key of Object.keys(options.settings)) {
      window.mgcrtSettings![key] = options.settings[key]!;
    }
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    if (!event.target.dataset.page) return;
    const nextPage = event.target.dataset.page;
    if (
      window.mgcrtSettings?.linkReload === false &&
      nextPage === document.location.hash.substring(1)
    ) {
      return;
    }

    const page = findPage(nextPage);
    if (page) loadPage(page);
  });

  loadPage(findPage(document.location.hash || "/"));
}
