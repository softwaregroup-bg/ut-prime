# ut-front-devextreme

## Install node modules
```
npm install
```

### Run storybook
```
npm run storybook
```

### Run tests
```
npm run test
```

### Generates a new component
```
npm run generate:component ComponentName
```
* Add Component name to rollup.config.js -> build() -> components[]
* Export new component in src/components/index.ts


### Import global styles
```
@import '~ut-front-devextreme/core/assets/main.css';
```