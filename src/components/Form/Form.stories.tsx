import React from 'react';
import { withReadme } from 'storybook-readme';
import { userEvent } from '@storybook/testing-library';
import { within } from '@testing-library/react';

// @ts-ignore: md file and not a module
import README from './README.md';
import Form from './index';
import tree from '../test/tree';
import {input, dropdowns} from '../test/input';

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
            dropdowns={dropdowns}
            value={{input: {}}}
            onSubmit={() => {}}
        />
    </div>;

Input.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const type = (role, id, text) => userEvent.type(canvas.getByRole(role, {name: (name, el) => el.id === id}), text);
    const click = (id) => userEvent.click(canvas.getByTestId(id));
    const clickOption = (id, name, role = 'option') => {
        id && click(id);
        body.getByRole(role, {name}).click();
    };
    const clickWithin = (id, name, role = 'option') => within(canvas.getByTestId(id)).getByRole(role, {name}).click();

    // left
    type('textbox', 'input.input', 'input');
    type('textbox', 'input.text', 'text');
    type('textbox', 'input.mask', '192168000001');
    type('textbox', 'input.date', '01/31/2022');
    type('textbox', 'input.time', '20:00');
    type('generic', 'input.boolean', '');
    type('textbox', 'input.datetime', '01/31/2022 20:00');
    type('spinbutton', 'input.currency', '1234567.89');
    type('spinbutton', 'input.number', '12345.67890');
    type('spinbutton', 'input.integer', '1234567890');
    type('textbox', 'input.password', '123');

    // center
    clickOption('input.dropdown', 'EUR');
    clickOption('input.dropdownTree', 'Asia', 'treeitem');
    clickOption('input.multiSelect', 'Rome');
    click('input.multiSelect'); // close the multiselect dropdown
    clickOption('input.multiSelectTree', 'Earth', 'treeitem');
    click('input.multiSelectTree'); // close the multiselect dropdown
    click('input.table.addButton');
    type('textbox', 'input.table[0].name', 'name');
    type('textbox', 'input.table[0].value', 'value');

    // right
    clickWithin('input.select', 'One', 'button');
    clickWithin('input.selectTable', 'One', 'cell');
    clickWithin('input.multiSelectPanel', 'One', 'option');
    // within(within(canvas.getByTestId('input.multiSelectTreeTable')).getByRole('row', {name: 'One'})).getAllByRole('checkbox')[0].click();
};
