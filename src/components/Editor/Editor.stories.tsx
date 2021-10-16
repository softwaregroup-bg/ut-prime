import React from 'react';
import { withReadme } from 'storybook-readme';
import type { Story, Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import README from './README.md';
import Editor from './index';
import type { Props } from './Editor.types';
import tree from '../test/tree';
import useToast from '../hooks/useToast';

const meta: Meta = {
    title: 'Editor',
    component: Editor,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};
export default meta;

const Template: Story<Props> = args => {
    const {toast, submit} = useToast();
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
        edit: ['edit', ['taxonomy', 'reproduction'], 'morphology', 'habitat']
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
                icon: 'pi pi-user',
                label: 'General',
                widgets: ['edit', 'habitat']
            }, {
                label: 'Details',
                icon: 'pi pi-book',
                widgets: ['taxonomy', 'morphology']
            }, {
                icon: 'pi pi-clock',
                widgets: ['history']
            }]
        }
    }
};
