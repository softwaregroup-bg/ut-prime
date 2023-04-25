import React from 'react';
import type { Story } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import type { Props } from '../Editor.types';
import Editor from '..';
import useToast from '../../hooks/useToast';

import {input, dropdowns} from '../../test/input';

export {default} from '../Editor.stories';

const Template: Story<Props> = ({methods, ...args}) => {
    const {toast, submit} = useToast();
    return <>
        <Editor
            id={1}
            object='input'
            onGet={() => Promise.resolve({input: {}})}
            onDropdown={() => Promise.resolve(dropdowns)}
            onAdd={submit}
            onEdit={submit}
            onFieldChange='handleFieldChange'
            onLoaded='handleLoaded'
            onMount='handleCheck'
            methods={{
                async handleFieldChange({field, value}: {field: unknown, value, event: Event}) {
                    submit({field, value});
                    // throw new Error('test error');
                    // return false;
                },
                async handleLoaded({value: {input = {}, ...value}, dropdowns}) {
                    if (dropdowns) {
                        dropdowns.select = [
                            {value: 3, label: 'Three'},
                            {value: 2, label: 'Two'},
                            {value: 1, label: 'One'}
                        ];
                    }
                    return {...value, input: {...input, text: 'loaded'}};
                },
                async handleCheck({ value, form: { formState, ...form }}) {
                    formState = {
                        errors: {
                            input: {
                                input: {
                                    type: 'custom',
                                    message: 'Error'
                                }
                            }
                        },
                        ...formState
                    };
                    console.log('errors', formState);
                    return { value, form: { formState, ...form } };
                },
                async handleAutocomplete() {
                    return {
                        suggestions: [{
                            value: 1, label: 'value 1', status: 'active'
                        }, {
                            value: 2, label: 'value 2', status: 'pending'
                        }, {
                            value: 3, label: 'value 3', status: 'new'
                        }]
                    };
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
                widget: {
                    onChange: 'handleDiscount',
                    enabled: '$.calc.positive'
                }
            },
            bitmask: {
                widget: {onChange: 'handleBitmask'}
            },
            input: {
                widget: {
                    visible: 'visible',
                    enabled: 'enabled'
                }
            },
            visible: {
                type: 'boolean'
            },
            enabled: {
                type: 'boolean'
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
                'bitmask',
                'visible',
                'enabled',
                'input'
            ]
        }
    },
    onGet: () => Promise.resolve({a: 0, b: 0, sum: 0, visible: true, enabled: true}),
    methods: {
        async handleA({form, value}) {
            const sum = Number(form.getValues('b')) + Number(value);
            form.setValue('sum', sum);
            form.setValue('$.calc.positive', sum > 0);
        },
        async handleB({form, value}) {
            const sum = Number(form.getValues('a')) + Number(value);
            form.setValue('sum', sum);
            form.setValue('$.calc.positive', sum > 0);
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
