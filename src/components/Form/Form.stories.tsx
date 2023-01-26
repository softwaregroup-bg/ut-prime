import React from 'react';
import type { Story, Meta } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import page from './README.mdx';
import type { Props } from './Form.types';
import Form from './index';
import tree from '../test/tree';
import {input, dropdowns} from '../test/input';
import decorators from '../test/decorator';
import {middleware} from '../Text/Text.mock';
import useForm from '../hooks/useForm';

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

const Template: Story<Props & {state: unknown, middleware: unknown}> = ({state, middleware, ...args}) => {
    const formApi = useForm();
    return <div className='flex' style={{overflowX: 'hidden', width: '100%'}}>
        <Form formApi={formApi} {...args} />
    </div>;
};

export const Basic: StoryTemplate = Template.bind({});

Basic.args = {
    ...tree,
    layout: ['edit', ['taxonomy', 'reproduction'], 'links', 'morphology'],
    dropdowns: {'tree.type': [{value: 1, label: 'Conifer'}, {value: 2, label: 'Broadleaf'}]},
    value: {tree: {treeName: 'Oak', treeId: 1, treeType: 1}},
    onSubmit: () => {}
};
export const BasicBG: StoryTemplate = Template.bind({});
BasicBG.args = {
    ...Basic.args,
    lang: 'bg'
};

export const BasicAR: StoryTemplate = Template.bind({});
BasicAR.args = {
    ...Basic.args,
    lang: 'ar',
    dir: 'rtl'
};

export const Input: StoryTemplate = Template.bind({});

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
    const clickWithin = (id, name, role = 'option') =>
        typeof name === 'number'
            ? within(canvas.getByTestId(id)).getAllByRole(role)[name].click()
            : within(canvas.getByTestId(id)).getByRole(role, {name}).click();

    // left
    await clear('textbox', 'input-input');
    await type('textbox', 'input-input', 'input');
    await type('textbox', 'input-text', 'text');
    // await type('textbox', 'input-mask', '192168000001');
    await type('textbox', 'input-date', '01/31/2022');
    await type('textbox', 'input-time', '20:00');
    await click('input-boolean');
    await type('textbox', 'input-datetime', '01/31/2022 20:00:00');
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
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
};

export const InputBG: StoryTemplate = Template.bind({});
InputBG.args = {
    ...Input.args,
    lang: 'bg'
};
InputBG.play = Input.play;

export const InputAR: StoryTemplate = Template.bind({});
InputAR.args = {
    ...Input.args,
    lang: 'ar',
    dir: 'rtl'
};
InputAR.play = Input.play;

export const Table: StoryTemplate = Template.bind({});
Table.args = {
    ...input,
    layout: ['table'],
    dropdowns,
    value: {table: [{input: 'test'}]},
    onSubmit: () => {}
};

Table.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    (await within(within(await canvas.findByTestId('table1')).getByRole('table')).findAllByRole('button')).filter((el) => el.getAttribute('name') === 'row-edit').pop().click();
    within(canvas.getByTestId('table2')).getAllByRole('button', {name: ''}).filter((el) => el.getAttribute('name') === 'row-edit').pop().click();
    within(canvas.getByTestId('table3')).getAllByRole('button', {name: ''}).filter((el) => el.getAttribute('name') === 'row-edit').pop().click();
    within(canvas.getByTestId('table4')).getAllByRole('button', {name: ''}).filter((el) => el.getAttribute('name') === 'row-edit').pop().click();
};

export const TableBG: StoryTemplate = Template.bind({});
TableBG.args = {
    ...Table.args,
    lang: 'bg'
};
TableBG.play = Table.play;

export const TableAR: StoryTemplate = Template.bind({});
TableAR.args = {
    ...Table.args,
    lang: 'ar',
    dir: 'rtl'
};
TableAR.play = Table.play;

export const CurrencyScale: StoryTemplate = Template.bind({});
CurrencyScale.args = {
    ...input,
    layout: ['currencyScale'],
    dropdowns,
    value: {
        input: {
            currencyScaleDollar: 1234567.89,
            currencyScaleEuro: 1234567.89,
            currencyScaleIraqiDinar: 1234567.89,
            dropdown: 4,
            currencyScaleParent: 1234567.89
        }
    },
    onSubmit: () => {}
};
