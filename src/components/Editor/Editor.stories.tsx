import React from 'react';
import type { Story, Meta } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

// @ts-ignore: md file and not a module
import page from './README.mdx';
import Editor from './index';
import type { Props } from './Editor.types';
import tree from '../test/tree';
import useToast from '../hooks/useToast';

const meta: Meta = {
    title: 'Editor',
    component: Editor,
    parameters: {docs: {page}},
    args: {
        state: {}
    }
};
export default meta;

const sticky = {sticky: true};

const Template: Story<Props> = args => {
    const {toast, submit} = useToast(sticky);
    return (
        <>
            {toast}
            <Editor
                onAdd={submit}
                onEdit={submit}
                {...args}
            />
        </>
    );
};

export const Basic: Story<Props> = Template.bind({});
Basic.args = {
    id: 1,
    object: 'tree',
    ...tree,
    layouts: {
        edit: ['edit', ['taxonomy', 'reproduction'], ['morphology', 'links'], 'habitat']
    },
    onDropdown: names => Promise.resolve({
        'tree.type': [{value: 1, label: 'Conifer'}, {value: 2, label: 'Broadleaf'}],
        'tree.habitat': [
            {value: 1, label: 'Forests'},
            {value: 2, label: 'Plantations'},
            {value: 3, label: 'Riverbanks'},
            {value: 4, label: 'Rivers'},
            {value: 5, label: 'Rocky areas'},
            {value: 6, label: 'Urban'},
            {value: 7, label: 'Wetlands'}
        ]
    }),
    onGet: params => Promise.resolve({
        tree: {treeName: 'Oak', treeId: 1, treeType: 1}
    })
};

export const Loading: Story<Props> = Template.bind({});
Loading.args = {
    ...Basic.args,
    onGet: params => new Promise((resolve, reject) => {})
};

export const Design: Story<Props> = Template.bind({});
Design.args = {
    ...Basic.args,
    design: true
};

export const Tabs: Story<Props> = Template.bind({});
Tabs.args = {
    ...Basic.args,
    layouts: {
        edit: {
            orientation: 'top',
            items: [{
                id: 'general',
                icon: 'pi pi-user',
                label: 'General',
                widgets: ['edit', 'habitat']
            }, {
                id: 'details',
                label: 'Details',
                icon: 'pi pi-book',
                widgets: ['taxonomy', 'morphology']
            }, {
                id: 'history',
                icon: 'pi pi-clock',
                widgets: ['history']
            }]
        }
    }
};

export const Submit: Story<Props> = Template.bind({});
Submit.args = Basic.args;
Submit.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue('Oak'); // wait for the data to be loaded
    userEvent.type(canvas.getByLabelText('Description'), 'test');
    userEvent.click(canvas.getByLabelText('save'));
};

export const Validation: Story<Props> = Template.bind({});
Validation.args = Basic.args;
Validation.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue('Oak'); // wait for the data to be loaded
    userEvent.clear(canvas.getByLabelText('Name'));
    userEvent.click(canvas.getByLabelText('save'));
};
