# Portal

`Portal` shows application pages in a tabbed UI.
It must be wrapped in a Redux Provider, where
the information for the active tabs is stored.

## How to use

```jsx
import {Provider} from 'react-redux';
import Portal from 'ut-front-devextreme/core/Portal';

<Provider store={store}>
    <Portal />
</Provider>
```

See the [storybook source](./Portal.stories.tsx) for examples.

## Props

| propName  | propType | defaultValue | isRequired |
| --------- | -------- | ------------ | ---------- |
