# Async

Renders a component returned by an async function.
Alternative to React.Suspense and React.lazy.

## How to use

```jsx
import Async from 'ut-prime/core/Async';

<Async component={asyncFn} />;
```

## Props

- **className** - class applied to root `Async` html element.

| propName  | propType | defaultValue | isRequired |
| --------- | -------- | ------------ | ---------- |
| component | function |              | yes         |
