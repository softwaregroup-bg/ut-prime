module.exports = {
  stories: ['../src/**/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-create-react-app', // TODO check if we need this, as it causes warnings during npm install
    'storybook-readme',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
  ],
};
