import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Editor from './index';

export default {
    title: 'Editor',
    component: Editor,
    decorators: [withReadme(README)]
};

export const Basic: React.FC<{}> = () =>
    <Editor
        object='tree'
        id={1}
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
        onDropdown={names => Promise.resolve({
            'tree.family': [{value: 1, label: 'Fagaceae'}, {value: 2, label: 'Pinaceae'}]
        })}
        onAdd={params => Promise.resolve({})}
        onGet={params => Promise.resolve({
            tree: {treeName: 'Oak', treeId: 1, treeFamily: 1}
        })}
        onEdit={params => Promise.resolve({})}
    />;
