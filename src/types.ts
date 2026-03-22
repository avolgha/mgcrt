/**
 * structural representation of a page.
 */
export interface Page<PreloadData = never> {
  /**
   * @deprecated currently not used.
   */
  name?: string;

  /**
   * the raw path to the page prefixed with a slash.
   */
  path: string;

  /**
   * the template of the main page component.
   */
  template: HTMLElement;

  /**
   * perform actions on the element. should probably be used for inserting data
   * into the page.
   *
   * @param element the template element which should be populated.
   * @param data preloaded data from the `preload` function if it exists.
   */
  populate(element: Node, data?: PreloadData): void;

  /**
   * an element which is to be shown while the `preload` function is running.
   */
  loadingElement?: HTMLElement;

  /**
   * preload data for the page before it is shown. the returned data will be
   * passed to the `populate` function.
   *
   * the function will only be called if there is a `loadingElement` defined.
   *
   * @returns a promise which resolves to the data to be passed to the
   *          `populate` function.
   */
  preload?(): Promise<PreloadData>;
}

/**
 * options for the `init` function of the mgcrt router.
 */
export interface InitOptions {
  /**
   * the main containing element for the router.
   */
  container: HTMLElement;

  /**
   * the pages to be registered with the router.
   */
  pages: Page[];

  /**
   * settings for the router. these settings can be used to change the default
   * behavior of the router.
   */
  settings?: {
    /**
     * determines whether a reload should be performed when trying to navigate
     * to a page you are currently already on.
     *
     * can be set to a constant value or a filter function which determines the
     * result by the provided path.
     */
    linkReload?: boolean | ((path: string) => boolean);
  };
}

/**
 * settings for the router. these settings can be used to change the default
 * behavior of the router.
 */
export type Settings = InitOptions["settings"];
