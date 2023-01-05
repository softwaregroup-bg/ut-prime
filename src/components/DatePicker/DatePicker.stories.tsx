import React, { useState } from 'react';

import type { Meta } from '@storybook/react';

import decorators from '../test/decorator';
import DatePicker from './';

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
export const Basic: React.FC = () => {
    const [dateRange, setDateRange] = useState({from: null, to: null});
    return <div className='m-5'>
        <DatePicker handleSelectedTimeRange={(from, to) => setDateRange({from, to})}></DatePicker>
        {dateRange?.from && dateRange?.to && `${dateRange?.from} - ${dateRange?.to}`}
    </div>;
};
