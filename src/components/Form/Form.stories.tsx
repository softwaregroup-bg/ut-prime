import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Form from './index';

export default {
    title: 'Form',
    component: Form,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () =>
    <div className='p-d-flex' style={{overflowX: 'hidden', width: '100%'}}>
        <Form
            properties={{
                treeName: {
                    title: 'Name'
                },
                treeDescription: {
                    title: 'Description',
                    editor: {
                        type: 'text'
                    }
                },
                treeFamily: {
                    title: 'Family',
                    editor: {
                        type: 'dropdown',
                        dropdown: 'tree.family'
                    }
                }
            }}
            cards={{
                edit: {
                    title: 'Tree',
                    properties: ['treeName', 'treeDescription', 'treeFamily']
                }
            }}
            dropdowns={{'tree.family': [{value: 1, label: 'Fagaceae'}, {value: 2, label: 'Pinaceae'}]}}
            value={{tree: {treeName: 'Oak', treeId: 1, treeFamily: 1}}}
            onSubmit={() => {}}
        />
    </div>;
