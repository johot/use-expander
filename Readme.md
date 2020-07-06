# use-expander

_Tiny React hooks for creating expanders (with regular CSS animation support!)_

## What?

React hooks for creating expander (accordion etc) components.

Takes care of all the hard parts like how to animate between `0` and `auto`, `overflow`, accessibility (`TODO: coming soon`) and so on.

> For more context about this read this great article: https://css-tricks.com/using-css-transitions-auto-dimensions/

## Why?

- Very easy to use!

- Existing solutions felt way too old, complicated and large. This is a super small library that only takes care of the essentials and lets you do the rest.

- All implementations are done using only hooks and "modern" React code and does not rely on things like timers etc.

- No built in animation implementation (this is a good thing), you are free to implement the transitions using regular `.css` files, libraries like emotion or regular React inline styles.

- Tested and works with SSR.

- Accessibility support `TODO: coming soon`

- Full TypeScript support.

## How to use

Controlling the transition animation using regular `.css` files:

```css
/* In your .css file */
.expander-animation {
  transition: height 0.2s ease-out;
}
```

```tsx
import { useExpander } from "use-expander";

export const Expander = () => {
  // Start collapsed
  const { toggleExpanded, contentProps } = useExpander<HTMLDivElement>(false);

  return (
    <div>
      <button onClick={() => toggleExpanded()}>Expand content</button>
      <div className="expander-animation" {...contentProps}>
        This is my content
      </div>
    </div>
  );
};
```

Using inline styles:

```tsx
import { useExpander } from "use-expander";

export const Expander = () => {
  // Start collapsed
  const { toggleExpanded, contentProps } = useExpander<HTMLDivElement>(false);

  return (
    <div>
      <button onClick={() => toggleExpanded()}>Expand content</button>
      <div
        ref={contentProps.ref}
        style={{ ...contentProps.style, transition: "height 0.2s ease-out" }}
      >
        This is my content
      </div>
    </div>
  );
};
```

"Controlled" mode (you handle and store the state of expanded/collapsed):

```tsx
import { useExpander } from "use-expander";

export const Expander = () => {
  const [expanded, setExpanded] = useState(false);
  const { contentProps } = useControlledExpander<HTMLDivElement>(expanded);

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>Expand content</button>
      <div
        ref={contentProps.ref}
        style={{ ...contentProps.style, transition: "height 0.2s ease-out" }}
      >
        This is my content
      </div>
    </div>
  );
};
```
