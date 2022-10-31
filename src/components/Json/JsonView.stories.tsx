import React from 'react';
import type { Meta } from '@storybook/react';

// import page from './README.mdx';
import JsonView from './JsonView';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'JsonView',
    component: JsonView,
    decorators,
    args: {
        state: {}
    }
    // parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC = () =>
    <JsonView value={{
        id: 1,
        name: 'test'
    }}
    />;
