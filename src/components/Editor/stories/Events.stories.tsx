import React from 'react';
import type { Story } from '@storybook/react';
import type { Props } from '../Editor.types';
import Editor from '..';
import useToast from '../../hooks/useToast';

import {input, dropdowns} from '../../test/input';

export {default} from '../Editor.stories';

const sticky = {sticky: false};

const Template: Story<Props> = ({methods, ...args}) => {
    const {toast, submit} = useToast(sticky);
    return <>
        <Editor
            id={1}
            object='input'
            onGet={() => Promise.resolve({input: {}})}
            onDropdown={() => Promise.resolve(dropdowns)}
            onAdd={submit}
            onEdit={submit}
            onFieldChange='handleFieldChange'
            methods={{
                async handleFieldChange({field, value, event}: {field: unknown, value, event: Event}) {
                    submit({field, value});
                    // throw new Error('test error');
                    // return false;
                },
                async handleAutocomplete() {
                    return [{
                        value: 1, label: 'value 1'
                    }, {
                        value: 2, label: 'value 2'
                    }, {
                        value: 3, label: 'value 3'
                    }];
                },
                async 'portal.customization.get'() {
                    return {};
                },
                ...methods
            }}
            {...args}
        />
        {toast}
    </>;
};

declare type StoryTemplate = Story<Partial<Props>> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

export const Events: StoryTemplate = Template.bind({});
Events.args = {
    ...input,
    layouts: {edit: ['left', 'center', 'right']}
};

export const EventsFormAPI: StoryTemplate = Template.bind({});
EventsFormAPI.args = {
    schema: {
        properties: {
            a: {
                type: 'integer',
                widget: {onChange: 'handleA'}
            },
            b: {
                type: 'integer',
                widget: {onChange: 'handleB'}
            },
            sum: {
                type: 'number',
                readOnly: true
            },
            discount: {
                type: 'number',
                widget: {onChange: 'handleDiscount'}
            },
            bitmask: {
                widget: {onChange: 'handleBitmask'}
            }
        }
    },
    cards: {
        edit: {
            className: 'lg:col-3',
            widgets: [
                'a',
                'b',
                'sum',
                'discount',
                'bitmask'
            ]
        }
    },
    onGet: () => Promise.resolve({a: 0, b: 0, sum: 0}),
    methods: {
        async handleA({form, value}) {
            form.setValue('sum', Number(form.getValues('b')) + Number(value));
        },
        async handleB({form, value}) {
            form.setValue('sum', Number(form.getValues('a')) + Number(value));
        },
        async handleDiscount({value, form}) {
            if (Number(value) < 0) throw new Error('Discount must be > 0'); // throwing means abort the edit and show error
            if (Number(value) >= 0) form.clearErrors('discount');
        },
        async handleBitmask({value}) {
            if (/[^01]/.test(value)) return false; // returning false means abort the edit silently
        }
    }
};
