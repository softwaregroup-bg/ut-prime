import React from 'react';
import type { Meta } from '@storybook/react';
import Joi from 'joi';

import page from './README.mdx';
import Report from './index';
import { Properties } from '../types';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Report',
    component: Report,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {}
    }
};
export default meta;

const columns: Properties = {
    name: {
        title: 'Name',
        validation: Joi.string().required()
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
        init={{name: 'row 1'}}
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
