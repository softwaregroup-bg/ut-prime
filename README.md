# UT React component library `ut-prime`

This module implements React components, for use in building
web applications with the UT framework. The library exports
wrapped `PrimeReact` components
and also locally developed components, which are called `UT components`.

The idea of `wrapped components` is to have a central place
to handle tasks like:

- Controlling used versions of external components
- Fixing bugs
- Extending external components with additional functionality

The idea of `UT components` is to create components
for functionality not available in `PrimeReact`
or higher order components based on existing ones.

All the `UT components` must follow these rules:

- Implemented as function components
- Written in TypeScript, to enable parameter checking during usage.
- Have a `README.md` file, with basic usage instructions.
- Have a `.stories.tsx` file, with example usage.
- Have a `.test.tsx` file, with unit test.
- Have a `.types.tsx` file, with a type definition of component's
  parameters
- Use [Material-UI's styling solution](https://material-ui.com/styles/basics/),
  based on JSS, where applicable.

## Usage

The library is published in a transpiled form, in commonJS format,
so that it can be used with Webpack, but without the need to use Babel.

Import individual components using this pattern:

```js
import SomeComponent from 'ut-prime/core/SomeComponent';
```

Check `README.md` files of the components for further info.
A link to the storybook of all components is available in
the project links below.

## Project links

- [Continuous Integration (Jenkins)](https://jenkins.softwaregroup.com/view/ut/view/master/job/ut/job/ut-prime/)
- [Static Code Analysis (SonarQube)](https://sonar.softwaregroup.com/dashboard?id=ut-prime%3Aorigin%2Fmaster)
- [Component library storybook (Chromatic)](https://www.chromatic.com/library?appId=6064dffb57787f0021be7b17)

### Library development tasks

1) Test components in storybook, with React fast refresh:

   ```bash
   npm run storybook
   ```

1) Run automated unit tests locally before pushing to git:

   ```bash
   npm run jest
   ```

   or

   ```bash
   node runjest
   ```

1) Expose a wrapped `PrimeReact` component:

   Add it to [./src/components/prime/index.ts](./src/components/prime/index.ts)

1) Create a new `UT component`:

   ```bash
   npm run generate:component ComponentName
   ```

   - Implement the component's logic in the files in the folder
     `src/components/ComponentName`
   - Export the new component in src/components/index.ts

   ```js
   export { default as ComponentName } from './ComponentName';
   ```
