---
title: Fix styled-components withComponent Method
type: text
---
styled-components have deprecated the `withComponent` method in favour of the inline `as` prop.
Unfortunately, [@types/styled-components](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/fe76831d67c996da2b5859407e9bc92aea3544af/types/styled-components/index.d.ts#L188) says you should use `withComponent` method and not the `as` prop.

Ouch!

Here's a higher-order component you can use instead of either of them.

```typescript
import styled, { StyledComponent }
from "styled-components"

function withComponent<
  C extends StyledComponent<any, any>,
  T extends React.ComponentType<any>
    | keyof JSX.IntrinsicElements
>(Component: C, type: T) {
  return styled((props =>
    <Component as={type} {...props} />)
     as unknown as T)``
}

// Example Usage:

const Link = withComponent(Button, 'a');
```
