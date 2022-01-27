import React from 'react';
import { withReadme } from 'storybook-readme';
import { userEvent } from '@storybook/testing-library';
import { within } from '@testing-library/react';

// @ts-ignore: md file and not a module
import README from './README.md';
import Form from './index';
import tree from '../test/tree';
import input from '../test/input';

export default {
    title: 'Form',
    component: Form,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};

export const Basic: React.FC<{}> = () =>
    <div className='flex' style={{overflowX: 'hidden', width: '100%'}}>
        <Form
            {...tree}
            layout={['edit', ['taxonomy', 'reproduction'], 'links', 'morphology']}
            dropdowns={{'tree.type': [{value: 1, label: 'Conifer'}, {value: 2, label: 'Broadleaf'}]}}
            value={{tree: {treeName: 'Oak', treeId: 1, treeType: 1}}}
            onSubmit={() => {}}
        />
    </div>;

export const Input = () =>
    <div className='flex' style={{overflowX: 'hidden', width: '100%'}}>
        <Form
            {...input}
            layout={['left', 'center', 'right']}
            dropdowns={{
                'input.dropdown': [
                    {value: 1, label: 'One'},
                    {value: 2, label: 'Two'},
                    {value: 3, label: 'Three'}
                ],
                'input.dropdownTree': [
                    {key: 1, label: 'One', data: {label: 'One'}},
                    {key: 2, label: 'Two', data: {label: 'Two'}},
                    {key: 3, label: 'Three', data: {label: 'Three'}}
                ]
            }}
            value={{input: {}}}
            onSubmit={() => {}}
        />
    </div>;

Input.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    const type = (role, id, text) => userEvent.type(canvas.getByRole(role, {name: (name, el) => el.id === id}), text);
    const click = (id) => userEvent.click(canvas.getByTestId(id));
    type('textbox', 'input.input', 'input');
    type('textbox', 'input.text', 'text');
    type('textbox', 'input.mask', '192168000001');
    type('textbox', 'input.date', '01/31/2022');
    type('textbox', 'input.time', '20:00');
    type('textbox', 'input.datetime', '01/31/2022 20:00');
    type('spinbutton', 'input.currency', '1234567.89');
    type('spinbutton', 'input.number', '12345.67890');
    type('spinbutton', 'input.integer', '1234567890');
    type('textbox', 'input.password', '123');
    click('input.dropdown');
    click('input.table.addButton');
    type('textbox', 'input.table[0].name', 'name');
    type('textbox', 'input.table[0].value', 'value');
};
