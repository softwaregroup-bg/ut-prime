import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import PieChart from './index';

export default {
    title: 'PieChart',
    component: PieChart,
    decorators: [withReadme(README)],
};

const data = [
    {
        country: 'Russia',
        area: 12,
    },
    {
        country: 'Canada',
        area: 7,
    },
    {
        country: 'USA',
        area: 7,
    },
    {
        country: 'China',
        area: 7,
    },
    {
        country: 'Brazil',
        area: 6,
    },
    {
        country: 'Australia',
        area: 5,
    },
    {
        country: 'India',
        area: 2,
    },
    {
        country: 'Others',
        area: 55,
    },
];

export const Basic: React.FC<{}> = () => (
    <PieChart dataSource={data} title="Area of Countries" argumentField="country" valueField="area" />
);
