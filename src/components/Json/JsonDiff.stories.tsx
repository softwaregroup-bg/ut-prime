import React from 'react';
import type { Meta } from '@storybook/react';

// import page from './README.mdx';
import JsonDiff from './JsonDiff';

const meta: Meta = {
    title: 'JsonDiff',
    component: JsonDiff
    // parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC = () =>
    <JsonDiff
        left={{
            id: 1,
            name: 'test',
            description: 'demo'
        }}
        right={{
            id: 1,
            name: 'test 1',
            delete: 'delete'
        }}
    />;
