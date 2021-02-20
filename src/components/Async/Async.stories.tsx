import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Async from './index';

export default {
    title: 'Async',
    component: Async,
    decorators: [withReadme(README)]
};

const Loaded = () => <div>async component loaded</div>;
const Delay = () => new Promise<React.FC>((resolve, reject) => {
    setTimeout(() => resolve(Loaded), 1000);
});

export const Basic: React.FC<{}> = () => <Async component={Delay} />;
