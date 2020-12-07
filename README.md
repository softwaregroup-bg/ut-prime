# ut-front-devextreme

## Install node modules

```bash
npm install
```

### Run storybook

```bash
npm run storybook
```

### Run tests

```bash
npm run test
```

### Generates a new component

```bash
npm run generate:component ComponentName
```

* Add Component name to rollup.config.js -> build() -> components[]
* Export new component in src/components/index.ts

### Import global styles

```bash
@import 'ut-front-devextreme/core/assets/main.css';
```
