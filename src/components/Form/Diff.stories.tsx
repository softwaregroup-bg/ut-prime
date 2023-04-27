import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import type { Props } from './Form.types';
import Form from './index';
import decorators from '../test/decorator';
import {previous, current} from '../test/diff';
import {middleware} from '../Text/Text.mock';
import useForm from '../hooks/useForm';
import useLayout from '../hooks/useLayout';

const meta: Meta = {
    title: 'Form',
    component: Form,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {},
        middleware: [middleware]
    }
};
export default meta;

declare type StoryTemplate = Story<Partial<Props>> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

const Template: Story<Props> = args => {
    const formApi = useForm();
    return <div className='flex' style={{overflowX: 'hidden', width: '100%'}}>
        <Form formApi={formApi} layoutState={useLayout(args.schema, args.cards, args.layout, args.editors, undefined, args.layoutFields)} {...args} />
    </div>;
};

export const Diff: StoryTemplate = Template.bind({});

Diff.args = {
    schema: {
        properties: {
            previous: {
                title: '',
                widget: {
                    type: 'json'
                }
            },
            current: {
                title: '',
                widget: {
                    type: 'json'
                }
            }
        }
    },
    cards: {
        previous: {
            className: 'md:col-3',
            label: 'Previous',
            widgets: ['previous']
        },
        current: {
            className: 'md:col-3',
            label: 'Current',
            widgets: ['current']
        },
        diff: {
            className: 'md:col-3',
            label: 'Diff',
            widgets: [{
                name: 'current',
                parent: 'previous'
            }]
        }
    },
    layout: ['previous', 'current', 'diff'],
    value: {
        previous,
        current
    },
    onSubmit: () => {}
};
export const DiffBG: StoryTemplate = Template.bind({});
DiffBG.args = {
    ...Diff.args,
    lang: 'bg'
};

export const DiffAR: StoryTemplate = Template.bind({});
DiffAR.args = {
    ...Diff.args,
    lang: 'ar',
    dir: 'rtl'
};
