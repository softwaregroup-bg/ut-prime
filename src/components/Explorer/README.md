# Explorer

Shows a collection of items in a tabular format,
allowing filtering, and performing actions on one or multiple items.
Item details can be shown in the side pane.

It is named after the Windows File Explorer, with which it
aims to have similarities.

## How to use

```jsx
import Explorer from 'ut-front-devextreme/core/Explorer';

<Explorer
    fetch={fetch}
    keyField='id'
    resultSet='items'
    fields={fields}
    details={details}
/>
```

## Props

- **fetch** - Data fetching async function.
- **keyField** - Name of the key field in the result set.
- **resultSet** - Name of the property, in which the result set
  is returned.
- **fields** - Fields to show in the table.
- **details** - Fields to show in the details pane.

| propName  | propType | defaultValue | isRequired |
| --------- | -------- | ------------ | ---------- |
| fetch     | function |              | no         |
| keyField  | string   |              | no         |
| resultSet | string   |              | no         |
| fields    | array    |              | no         |
| details   | object   |              | no         |
