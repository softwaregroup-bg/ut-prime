import React from 'react';
import { withReadme } from 'storybook-readme';
import Joi from 'joi';

// @ts-ignore: md file and not a module
import README from './README.md';
import Report from './index';

export default {
    title: 'Report',
    component: Report,
    decorators: [withReadme(README)]
};

export const Basic = () =>
    <Report
        properties={{
            name: {
                title: 'Name'
            },
            startDate: {
                title: 'Start Date',
                validation: Joi.date(),
                editor: {
                    type: 'date'
                }
            },
            endDate: {
                title: 'End Date',
                validation: Joi.date(),
                editor: {
                    type: 'date'
                }
            }
        }}
        params={['name', 'startDate', 'endDate']}
        columns={['name']}
        onDropdown={names => Promise.resolve({})}
        fetch={params => Promise.resolve([
            {name: 'row 1'},
            {name: 'row 2'}
        ])}
    />;
