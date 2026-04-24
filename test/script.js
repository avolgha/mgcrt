import { link } from "./node_modules/@avolgha/mgcrt/dist/helper.js";

const container = document.getElementById("app");
if (!container) throw new Error();

function element(tag, attrs, children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  for (const child of children) {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  }
  return el;
}

init({
  container,
  pages: [
    {
      path: "/",
      template: element("div", {}, [element("div", {}, ["Hello, World!"])]),
      populate: () => {},
    },
    {
      path: "/page2",
      template: element("div", {}, [element("div", {}, ["This is page 2."])]),
      populate: () => {},
    },
    {
      path: "/page3",
      template: element("div", {}, [
        element("div", {}, ["This is the third page."]),
      ]),
      populate: () => {},
    },
    {
      path: "/testlazy",
      template: element("p", {}, ["The secret was revealed: @"]),
      populate: (element, data) => {
        element.textContent = element.textContent.replace("@", data.secret);
      },
      loadingElement: element("p", {}, ["Loading..."]),
      preload: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ secret: 42 });
          }, 3000);
        });
      },
    },
  ],
  settings: {
    linkReload: false,
  },
});
