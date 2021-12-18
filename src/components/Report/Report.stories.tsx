import React from 'react';
import { withReadme } from 'storybook-readme';
import Joi from 'joi';

// @ts-ignore: md file and not a module
import README from './README.md';
import Report from './index';
import { Properties } from '../types';

export default {
    title: 'Report',
    component: Report,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};

const columns: Properties = {
    name: {
        title: 'Name'
    },
    startDate: {
        title: 'Start Date',
        validation: Joi.date(),
        widget: {
            type: 'date'
        }
    },
    endDate: {
        title: 'End Date',
        validation: Joi.date(),
        widget: {
            type: 'date'
        }
    }
};

export const Basic = () =>
    <Report
        schema={{
            properties: {
                params: {
                    properties: columns
                },
                result: {
                    properties: columns
                }
            }
        }}
        params={['name', 'startDate', 'endDate']}
        columns={['name']}
        onDropdown={names => Promise.resolve({})}
        fetch={params => Promise.resolve({
            result: [
                {name: 'row 1'},
                {name: 'row 2'}
            ]
        })}
    />;
