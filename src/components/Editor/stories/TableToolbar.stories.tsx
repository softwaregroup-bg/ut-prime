import React from 'react';
import type { Story } from '@storybook/react';
import type { Props } from '../Editor.types';
import Editor from '..';
import useToast from '../../hooks/useToast';

import {input, dropdowns} from '../../test/tableToolbar';
import {confirmPopup} from '../../prime';

export {default} from '../Editor.stories';

const Template: Story<Props> = ({methods, ...args}) => {
    const {toast, submit} = useToast();
    return <>
        <Editor
            id={1}
            object='input'
            onGet={() => Promise.resolve({
                input: {
                    table: [
                        {id: 1, name: 'row 1'},
                        {id: 2, name: 'row 2'},
                        {id: 3, name: 'row 3'}
                    ]
                }
            })}
            onDropdown={() => Promise.resolve(dropdowns)}
            onAdd={submit}
            onEdit={submit}
            methods={{
                async 'table.row.process'(params: {value: number}) {
                    submit(params);
                    return {value: (params.value || 0) + 1};
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

const clean = ({form, ...props}) => props;

export const TableToolbar = Template.bind({});
TableToolbar.args = {
    ...input,
    layouts: {edit: ['center']},
    middleware: [
        _store => next => action => (action.type === 'front.button.action')
            ? confirmPopup({
                target: action?.params?.[0]?.event?.target,
                message: <div className='pre'>{JSON.stringify(clean(action?.params?.[1]), null, 4)}</div>
            }) : next(action)
    ]
};
