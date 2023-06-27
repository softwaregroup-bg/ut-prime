import React, { useState } from 'react';

import type { Meta } from '@storybook/react';

import decorators from '../test/decorator';
import DateRange from './';

const meta: Meta = {
    title: 'DateRange',
    decorators,
    component: DateRange,
    args: {
        state: {}
    }
};

export default meta;

export const Basic: React.FC = () => {
    const [dateRange, setDateRange] = useState<[Date, Date]>([null, null]);
    return <div className='p-component'>
        <div className='m-5'>
            <div>Default</div>
            <DateRange
                value={JSON.stringify(dateRange)}
                onChange={({value}) => setDateRange(value)}
            />
        </div>
        <div className='m-5'>
            <div>Inline</div>
            <DateRange
                inline
                value={JSON.stringify(dateRange)}
                onChange={({value}) => setDateRange(value)}
            />
        </div>
        <div className='m-5'>
            <div>Time only</div>
            <DateRange
                timeOnly
                value={JSON.stringify(dateRange)}
                onChange={({value}) => setDateRange(value)}
            />
        </div>
        <div className='m-5'>
            <div>Time only inline</div>
            <DateRange
                timeOnly
                inline
                value={JSON.stringify(dateRange)}
                onChange={({value}) => setDateRange(value)}
            />
        </div>
    </div>;
};
