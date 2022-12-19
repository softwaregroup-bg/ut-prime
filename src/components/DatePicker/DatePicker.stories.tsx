import React from 'react';
import DatePicker from 'ut-prime/src/components/DatePicker';
import decorators from 'ut-prime/src/components/test/decorator';

import type { Meta } from '@storybook/react';

// import page from './README.mdx';

const meta: Meta = {
    title: 'DatePicker',
    decorators,
    component: DatePicker,
    args: {
        state: {}
    }
    // parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC = () =>
    <div className='m-5'>
        <DatePicker></DatePicker>
    </div>;
