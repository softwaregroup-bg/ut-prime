import React from 'react';
import type { Story, Meta } from '@storybook/react';
import Joi from 'joi';

import page from './README.mdx';
import Report from './index';
import type { Props } from './Report.types';

import decorators from '../test/decorator';
import useToast from '../hooks/useToast';

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

const Template: Story<Props> = props => {
    const {toast, submit} = useToast();
    return <>
        {toast}
        <Report
            name='test'
            schema={{
                properties: {
                    params: {
                        properties: {
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
                        }
                    },
                    result: {
                        properties: {
                            name: {},
                            date: {
                                widget: {
                                    type: 'date'
                                }
                            }
                        }
                    }
                }
            }}
            init={{params: {name: 'row 1'}}}
            params={['name', 'startDate', 'endDate']}
            columns={['name', 'date']}
            onDropdown={names => Promise.resolve({})}
            onCustomization={submit}
            fetch={({result: {name}} : {result?: Record<string, unknown>}) => new Promise((resolve, reject) =>
                setTimeout(() => resolve({
                    result: [
                        {name: 'row 1', date: new Date('2022-09-18')},
                        {name: 'row 2', date: new Date('2022-09-19')}
                    ].filter(item => name == null ? true : item.name.includes(String(name)))
                }), 300))}
            {...props}
        />
    </>;
};

export const Basic = Template.bind({});
Basic.args = {};

export const Design = Template.bind({});
Design.args = {
    design: true
};
