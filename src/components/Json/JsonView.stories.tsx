import React from 'react';
import type { Meta } from '@storybook/react';

// import page from './README.mdx';
import JsonView from './JsonView';

const meta: Meta = {
    title: 'JsonView',
    component: JsonView
    // parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC = () =>
    <JsonView object={{
        id: 1,
        name: 'test'
    }}
    />;
