import React from 'react';
import type { Meta } from '@storybook/react';

// import page from './README.mdx';
import Json from '.';
import decorators from '../test/decorator';
import {previous, current} from '../test/diff';

const meta: Meta = {
    title: 'Json',
    decorators,
    component: Json,
    args: {
        state: {}
    }
    // parameters: {docs: {page}}
};
export default meta;

export const Diff: React.FC = () =>
    <Json
        value={current}
        previous={previous}
    />;

export const View: React.FC = () =>
    <Json value={current}/>;

export const KeyValue: React.FC = () =>
    <Json keyValue className='w-full' value={[
        ['Country', 'Albania'],
        ['Country', 'Afghanistan'],
        ['city', 'Burgas'],
        ['region', 'West'],
        ['organization', 'Software Group'],
        ['organization', 'Bulgaria'],
        ['exchange']
    ]}
    />;
