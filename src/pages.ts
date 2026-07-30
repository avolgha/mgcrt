import type { Page } from "./types";

/**
 * structure that represents a node that is used for storing route information.
 *
 * (there should be no scenario where the user has to create one himself.)
 */
export interface PagesNode {
  /**
   * the parent route. if null, it represents the root node.
   */
  parent: PagesNode | null;

  /**
   * a map containing all children of the current node.
   */
  children: Map<string, PagesNode>;

  /**
   * possibility for the current route to have its own page. if left to null,
   * there is no page connected to the current route.
   */
  own: Page<unknown, unknown> | null;
}

/**
 * utility for managing the routes of the router.
 */
export class Pages {
  private static PATH_SEPERATOR = "/";

  private root: PagesNode;

  constructor(pages: Page<unknown, unknown>[]) {
    this.root = {
      parent: null,
      children: new Map(),
      own: null,
    };

    for (const page of pages) {
      const sections = page.path
        .toLowerCase()
        .substring(1)
        .split(Pages.PATH_SEPERATOR);

      let current = this.root;
      let cursor: string | undefined = undefined;
      while ((cursor = sections.shift()) !== undefined) {
        if (cursor === "") {
          break;
        } else if (!current.children.has(cursor)) {
          const next = {
            parent: current,
            children: new Map(),
            own: null,
          } satisfies PagesNode;
          current.children.set(cursor, next);
          current = next;
        } else {
          current = current.children.get(cursor)!;
        }
      }

      current.own = page;
    }
  }

  /**
   * returns the node for a given path.
   *
   * if null is returned, there could not be a node found for the given path
   * meaning the path is invalid or rather not defined.
   *
   * @param path the path to search for.
   */
  getNode(path: string): PagesNode | null {
    if (path.startsWith(Pages.PATH_SEPERATOR)) {
      path = path.substring(1);
    }

    const sections = path.toLowerCase().split(Pages.PATH_SEPERATOR);
    let current = this.root;
    for (const part of sections) {
      const child = current.children.get(part);
      if (child !== undefined) {
        current = child;
      } else if (part === "") {
        break;
      } else {
        return null;
      }
    }

    return current;
  }
}
