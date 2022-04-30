# App

The application component, usually passed to ReactDOM.render

## How to use

```jsx
import App from 'ut-prime/core/App';

<App
    portalName='test app'
    state={state}
    theme={{
        ut: {
            classes: {}
        },
        palette: {
            type: 'dark'
        }
    }}
/>
```

## Props

- **className** - Class applied to root `App` HTML element.
- **state** - The initial Redux state.
- **theme** - Theme parameters

| propName  | propType | defaultValue | isRequired |
| --------- | -------- | ------------ | ---------- |
| className | string   |              | no         |
| state     | object   |              | no         |
| theme     | object   |              | no         |
