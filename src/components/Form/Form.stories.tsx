import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Form from './index';
import tree from '../test/tree';

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
            layout={['edit', ['taxonomy', 'reproduction'], 'morphology']}
            dropdowns={{'tree.type': [{value: 1, label: 'Conifer'}, {value: 2, label: 'Broadleaf'}]}}
            value={{tree: {treeName: 'Oak', treeId: 1, treeType: 1}}}
            onSubmit={() => {}}
        />
    </div>;
