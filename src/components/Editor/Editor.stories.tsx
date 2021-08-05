import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Editor from './index';
import tree from '../test/tree';
import useToast from '../hooks/useToast';

export default {
    title: 'Editor',
    component: Editor,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};

export const Basic: React.FC<{}> = () => {
    const {toast, submit} = useToast();
    return (
        <>
            {toast}
            <Editor
                id={1}
                object='tree'
                {...tree}
                layouts={{
                    edit: ['edit', ['taxonomy', 'reproduction'], 'morphology']
                }}
                onDropdown={names => Promise.resolve({
                    'tree.type': [{value: 1, label: 'Conifer'}, {value: 2, label: 'Broadleaf'}]
                })}
                onAdd={submit}
                onGet={params => Promise.resolve({
                    tree: {treeName: 'Oak', treeId: 1, treeType: 1}
                })}
                onEdit={submit}
            />
        </>
    );
};
