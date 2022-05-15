import React from 'react';
import type { Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import page from './README.mdx';
import Async from './index';

const meta: Meta = {
    title: 'Async',
    component: Async,
    parameters: {docs: {page}}
};
export default meta;

const Loaded = () => <div className='p-component'>async component loaded</div>;
const Delay = () => new Promise<React.FC>((resolve, reject) => {
    setTimeout(() => resolve(Loaded), 1000);
});

export const Basic: React.FC<{}> = () => <Async component={Delay} />;
