import React from 'react';
import type { Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import page from './README.mdx';
import Text from './index';

const meta: Meta = {
    title: 'Text',
    component: Text,
    parameters: {docs: {page}},
    args: {
        state: {
        }
    }
};
export default meta;

export const Basic: React.FC<{}> = () =>
    <div className='p-component'><Text>Text content, which can be translated</Text></div>;
