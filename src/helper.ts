export type Attributes = Record<string, string>;
export type Children = (string | Node | undefined | null)[];

export function element<Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  attrs: Attributes = {},
  children: Children = [],
): HTMLElementTagNameMap[Tag] {
  const el = document.createElement(tag);

  for (const key of Object.keys(attrs)) {
    el.setAttribute(key, attrs[key]);
  }

  for (const child of children) {
    if (child === undefined || child === null) {
      continue;
    } else if (typeof child === "string") {
      el.append(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.append(child);
    }
  }

  return el;
}
export const link = (
  page: string,
  attrs: Attributes = {},
  children?: Children,
) =>
  element(
    "button",
    {
      ...attrs,
      "data-page": page,
    },
    children,
  );
