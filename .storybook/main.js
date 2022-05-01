const lazy = /(primereact[/\\]resources[/\\]themes[/\\].+\.css$)/i;

module.exports = {
    webpackFinal: (config) => {
        const cssRule = config.module.rules.findIndex(rule => rule && rule.test && rule.test.toString() === '/\\.css$/');
        if (cssRule > -1) {
            config.module.rules.splice(cssRule, 0, {
                test: lazy,
                use: [{
                    loader: config.module.rules[cssRule].use[0].loader || config.module.rules[cssRule].use[0],
                    options: {
                        injectType: 'lazyStyleTag'
                    }
                }, {
                    loader: config.module.rules[cssRule].use[1].loader,
                }]
            });
        }
        config.module.rules.forEach(rule => {
            if (rule.exclude && rule.exclude.toString() === '/node_modules/') {
                rule.exclude = /node_modules[\\/](?!(impl|ut)-)/i;
            }
            if (rule && rule.test && rule.test.toString() === '/\\.css$/') {
                rule.exclude = lazy;
            }
        });
        config.plugins.forEach(plugin => {
            if (plugin?.options?.exclude?.toString().startsWith('/node_modules/')) {
                plugin.options.exclude = /node_modules[\\/](?!(impl|ut)-)/i;
            }
        });
        config.watchOptions = {
            ignored: /node_modules[\\/](?!(impl|ut)-)/
        }
        return config;
    },
    reactOptions: {
        fastRefresh: true
    },
    typescript: {
        check: false,
        reactDocgen: false,
        // reactDocgen: configType === 'PRODUCTION' ? 'react-docgen-typescript' : false,
    },
    // core: { builder: "@storybook/builder-vite" },
    features: {
        postcss: false
    },
    stories: ['../src/**/*.stories.tsx'],
    addons: [
        // 'storybook-addon-swc',
        'storybook-readme',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y',
        '@storybook/addon-storysource',
    ],
};
