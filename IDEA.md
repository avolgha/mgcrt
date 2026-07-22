# idea for `feature/shared-context`

implement some shared context that will be available to all pages in the
`populate` function. (maybe also the `preload` function)

why? because we dont want the user to pass this context through the window
object.

does it matter? no it probably does not because this project is already not
suitable for projects that value security. but it sounds cool.

ideas:

- pass context through `loadPage`/`loadComponent` function?

## possible changes

```typescript
// -> InitOptions
function init<ContextData>({
    ...
    initialContext?: ContextData;
}): void;

function createPage({
    ...
    populate(..., context: ContextData): void;
}): ...;

interface Component<ContextData> {
    populate(..., context: ContextData): void;
    preload(context: ContextData): ...;
}

interface PreloadMiddleware<ContextData> {
    preload(context: ContextData): ...;
}
```
