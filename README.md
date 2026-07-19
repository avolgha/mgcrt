# mgcrt

Simple JavaScript SPA router implementation.

> [!NOTE]
> as mentioned, this project aims to only support single-page applications.
> this also means, that for example SSR (server side rendering) will not be
> supported and is no goal for the future.

## Usage

```html
<div class="links">
  <button data-page="/">Page 1</button>
  <button data-page="/page2">Page 2</button>
</div>

<div id="root"></div>

<script type="module" src="..."></script>
```

```javascript
import { init as initMgcrt } from "./mgcrt.js";

initMgcrt({
  container: document.getElementById("root"),
  pages: [
    {
      path: "/",
      template: document.createTextNode("Hello World from Page 1!"),
      populate: () => {},
    },
    {
      path: "/page2",
      template: document.createTextNode("Hello World from @!"),
      populate: (element) => {
        element.textContent = element.textContent.replace("@", "Page 2");
      },
    },
  ],
});
```

## Build it yourself

```bash
$ pnpm install
$ pnpm build
$ cp dist/mgcrt.js ...
```

There are also `mgcrt.js.map` and `mgcrt.d.ts` available.
