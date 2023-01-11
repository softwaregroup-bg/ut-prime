import React, { useState } from 'react';

import type { Meta } from '@storybook/react';

import decorators from '../test/decorator';
import DateRange from './';

const meta: Meta = {
    title: 'DatePicker',
    decorators,
    component: DateRange,
    args: {
        state: {}
    }
};

export default meta;

export const Basic: React.FC = () => {
    const [dateRange, setDateRange] = useState<[Date, Date]>([null, null]);
    return <div className='m-5'>
        <DateRange
            value={dateRange}
            onChange={({value}) => setDateRange(value)}
        />
        <div className='p-component mt-5'>
            {dateRange?.[0]?.toLocaleString()}
            <br />
            {dateRange?.[1]?.toLocaleString()}
        </div>
    </div>;
};
