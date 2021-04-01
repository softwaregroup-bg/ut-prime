# Navigator

Shows a hierarchical data as a tree, to enable
navigating collections of items related to that
tree.

Navigator is named after the `Navigation pane`
in Windows File Explorer.

## How to use

```jsx
import Navigator from 'ut-front-devextreme/core/Navigator';

<Navigator
    fetch={fetch}
    keyField='id'
    resultSet='items'
    field='name'
    title='Name'
>
    body
</Navigator>
```

## Props

- **fetch** - Data fetching async function.
- **keyField** - Name of the key field in the result set.
- **resultSet** - Name of the property, in which the result set
  is returned.
- **field** - Name of the field to show.
- **title** - Title to show.
- **parentField** - Name of the field, which defines
  the parent-child relation in the hierarchy

| propName    | propType | defaultValue | isRequired |
| ----------- | -------- | ------------ | ---------- |
| fetch       | function |              | yes        |
| keyField    | string   |              | yes        |
| resultSet   | string   |              | yes        |
| field       | string   |              | yes        |
| title       | string   |              | yes        |
| parentField | string   |  'parents'   | no         |
