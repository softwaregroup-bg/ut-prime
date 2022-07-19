import React from 'react';
import type { Story, Meta } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';

import page from './README.mdx';
import type { Props } from './Form.types';
import Form from './index';
import tree from '../test/tree';
import {input, dropdowns} from '../test/input';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Form',
    component: Form,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {}
    }
};
export default meta;

const Template: Story<Props> = args =>
    <div className='flex' style={{overflowX: 'hidden', width: '100%'}}>
        <Form {...args} />
    </div>;

export const Basic: Story<Partial<Props>> = Template.bind({});

Basic.args = {
    ...tree,
    layout: ['edit', ['taxonomy', 'reproduction'], 'links', 'morphology'],
    dropdowns: {'tree.type': [{value: 1, label: 'Conifer'}, {value: 2, label: 'Broadleaf'}]},
    value: {tree: {treeName: 'Oak', treeId: 1, treeType: 1}},
    onSubmit: () => {}
};

export const Input: Story<Partial<Props>> = Template.bind({});

Input.args = {
    ...input,
    layout: ['left', 'center', 'right'],
    dropdowns,
    value: {input: {}},
    onSubmit: () => {}
};

Input.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const clear = async(role, id) => userEvent.clear(await canvas.findByRole(role, {name: (name, el) => el.id === id}));
    const type = async(role, id, text) => userEvent.type(await canvas.findByRole(role, {name: (name, el) => el.id === id}), text);
    const click = (id) => userEvent.click(canvas.getByTestId(id));
    const clickOption = async(id, name, role = 'option') => {
        id && await click(id);
        return (await body.findByRole(role, {name})).click();
    };
    const clickWithin = (id, name, role = 'option') => within(canvas.getByTestId(id)).getByRole(role, {name}).click();

    // left
    await clear('textbox', 'input-input');
    await type('textbox', 'input-input', 'input');
    await type('textbox', 'input-text', 'text');
    await type('textbox', 'input-mask', '192168000001');
    await type('textbox', 'input-date', '01/31/2022');
    await type('textbox', 'input-time', '20:00');
    await click('input-boolean');
    await type('textbox', 'input-datetime', '01/31/2022 20:00');
    await type('spinbutton', 'input-currency', '1234567.89');
    await type('spinbutton', 'input-number', '12345.67890');
    await type('spinbutton', 'input-integer', '1234567890');
    await type('textbox', 'input-password', '123');

    // center
    await clickOption('input-dropdown', 'EUR');
    await clickOption('input-dropdownTree', 'Europe', 'treeitem');
    await clickOption('input-multiSelect', 'Rome');
    await click('input-multiSelect'); // close the multiselect dropdown
    await clickOption('input-multiSelectTree', 'Solar system', 'treeitem');
    await click('input-multiSelectTree'); // close the multiselect dropdown
    await click('input-table-addButton');
    await type('textbox', 'input-table-0-name', 'name');
    await type('textbox', 'input-table-0-value', 'value');

    // right
    await clickWithin('input-select', 'One', 'button');
    await clickWithin('input-selectTable', 'One', 'cell');
    await clickWithin('input-multiSelectPanel', 'One', 'option');
    await within(within(canvas.getByTestId('input-multiSelectTreeTable')).getByRole('row', {name: 'One'})).getAllByRole('checkbox')[0].click();
};

export const Table: Story<Partial<Props>> = Template.bind({});
Table.args = {
    ...input,
    layout: ['table'],
    dropdowns,
    value: {table: [{input: 'test'}]},
    onSubmit: () => {}
};

Table.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    (await within(within(canvas.getByTestId('table1')).getByRole('table')).findByRole('button')).click();
    within(canvas.getByTestId('table2')).getByRole('button', {name: ''}).click();
    within(canvas.getByTestId('table3')).getByRole('button', {name: ''}).click();
    within(canvas.getByTestId('table4')).getByRole('button', {name: ''}).click();
};
