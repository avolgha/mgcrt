/**
 * structural representation of a page.
 */
export interface Page<SharedContext = never, PreloadData = never> extends Component<SharedContext, PreloadData> {
  /**
   * the raw path to the page prefixed with a slash.
   */
  path: string;
}

/**
 * structural representation of a component.
 */
export interface Component<SharedContext = never, PreloadData = never> {
  /**
   * the name of the component.
   */
  name: string;

  /**
   * the template of the component.
   */
  template: HTMLElement;

  /**
   * perform actions on the element. should probably be used for inserting data
   * into the component.
   *
   * @param element the template element which should be populated.
   * @param data preloaded data from the `preload` function if it exists.
   */
  populate?(element: Node, context: SharedContext, data?: PreloadData): void;

  /**
   * an element which is to be shown while the `preload` function is running.
   */
  loadingElement?: HTMLElement | null;

  /**
   * preload data for the page before it is shown. the returned data will be
   * passed to the `populate` function.
   *
   * the function will only be called if there is a `loadingElement` defined.
   *
   * @returns a promise which resolves to the data to be passed to the
   *          `populate` function.
   */
  preload?(context: SharedContext): Promise<PreloadData>;
}

/**
 * structural representation of a middleware component such that pages can
 * reuse their preloading logic without needing to add it to every page itself.
 *
 * possible application would be authentication-guards, where the user will be
 * redirected to a login page when no login is found.
 *
 * @see createPage
 * @see Component
 */
export interface PreloadMiddleware<SharedContext = never, PreloadData = never> {
  /**
   * an element which is to be shown while the `preload` function is running.
   */
  loadingElement: Component["loadingElement"];

  /**
   * preload data for the page before it is shown. the returned data will be
   * passed to the `populate` function.
   *
   * the function will only be called if there is a `loadingElement` defined.
   *
   * @returns a promise which resolves to the data to be passed to the
   *          `populate` function.
   */
  preload: NonNullable<Component<SharedContext, PreloadData>["preload"]>;
}

/**
 * options for the `init` function of the mgcrt router.
 */
export interface InitOptions<SharedContext = never> {
  /**
   * the main containing element for the router.
   */
  container: HTMLElement;

  /**
   * the pages to be registered with the router.
   */
  pages: Page<SharedContext, unknown>[];

  /**
   * settings for the router. these settings can be used to change the default
   * behavior of the router.
   */
  settings?: Settings;

  /**
   * the context that is immediately available without modifications by the
   * pages.
   */
  initialContext?: SharedContext;
}

/**
 * settings for the router. these settings can be used to change the default
 * behavior of the router.
 */
export interface Settings {
  /**
   * determines whether a reload should be performed when trying to navigate
   * to a page you are currently already on.
   *
   * can be set to a constant value or a filter function which determines the
   * result by the provided path.
   */
  linkReload?: boolean | ((path: string) => boolean);

  /**
   * determine whether a so called "404-page" should be shown when the user
   * tries navigating to a page which is not registered within the router.
   *
   * if set to a boolean with value `true`, it will try to reroute to a page
   * with the path `/404`.
   *
   * this behaviour can be alternated by passing in a string which results in
   * the boolean to be automatically thought of as `true` but the route set
   * to the provided string value.
   */
  notFoundPage?: boolean | string;
}
