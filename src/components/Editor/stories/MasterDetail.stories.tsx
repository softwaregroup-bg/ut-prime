import { userEvent, within } from '@storybook/testing-library';
import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const MasterDetail = () =>
    <Editor
        id={1}
        onGet={() => Promise.resolve({
            person: [
                {personId: 1, fullName: 'John Doe', birthDate: '2000-01-08', nationalId: '777777777'},
                {personId: 2, fullName: 'Jane Doe', birthDate: '2002-03-18', nationalId: '888888888'}
            ]
        })}
        onDropdown={() => Promise.resolve({})}
        schema={{
            type: 'object',
            properties: {
                person: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            fullName: {},
                            nationalId: {title: 'National ID'},
                            birthDate: {format: 'date'}
                        }
                    },
                    title: '',
                    widget: {
                        type: 'table',
                        selectionMode: 'single',
                        actions: {
                            allowEdit: false
                        }
                    }
                }
            }
        }}
        cards={{
            master: {
                label: 'Persons',
                className: 'xl:col-2',
                widgets: [{
                    name: 'person',
                    widgets: ['fullName']
                }]
            },
            detail: {
                className: 'xl:col-3',
                label: 'Personal Information',
                watch: '$.selected.person',
                widgets: [
                    '$.edit.person.fullName',
                    '$.edit.person.birthDate',
                    '$.edit.person.nationalId'
                ]
            }
        }}
        layouts={{
            edit: ['master', 'detail']
        }}
    />;

MasterDetail.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByText('John Doe'));
};
