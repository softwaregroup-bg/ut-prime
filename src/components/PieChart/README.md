# Button

## How to use

```jsx
import PieChart from 'ut-front-devextreme/core/PieChart';

<PieChart
    dataSource={[
        {
            country: 'USA',
            area: 7,
        }
    ]}
    title="Area of Countries"
    argumentField="country"
    valueField="area"
/>;
```

## Props

- **argumentField and valueField** - should be keys of an object from dataSource array

| propName      | propType           | defaultValue | isRequired |
| ---------     | --------           | ------------ | ---------- |
| dataSource    | array of objects   |              | yes        |
| title         | string             |              | yes        |
| argumentField | string             |              | yes        |
| valueField    | string             |              | yes        |
| palette       | PaletteType        | Bright       | yes        |

  