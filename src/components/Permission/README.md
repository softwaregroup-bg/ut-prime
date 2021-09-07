# Permission

Render children when permission is granted

## How to use

```jsx
import Permission from 'ut-front-devextreme/core/Permission';

<Permission permission='x.y.z'>content when x.y.z is allowed</Permission>
<Permission permission={['a.b.c', 'x.y.z']}>content when a.b.c and x.y.z are allowed</Permission>
```

## Props

- **permission** - permission(s) to check

| propName   | propType          | defaultValue | isRequired |
| ---------- | ----------------- | ------------ | ---------- |
| permission | string | string[] |              | no         |
