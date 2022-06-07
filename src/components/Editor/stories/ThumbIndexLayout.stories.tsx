import React from 'react';
import Editor from '..';
import tree from '../../test/tree';
export {default} from '../Editor.stories';

const mock = count => Array(count).fill(0).map((_, index) => ({name: 'tree.mock', id: `${index}`}));

export const ThumbIndexLayout = () =>
    <Editor
        debug
        onDropdown={names => Promise.resolve({})}
        {...tree}
        id={1}
        onGet={params => new Promise((resolve, reject) => {})}
        cards={{
            a1: {label: 'A 1', widgets: mock(3)},
            a2: {label: 'A 2', widgets: mock(2)},
            b1: {label: 'B 1', widgets: mock(2)},
            b2: {label: 'B 2', widgets: mock(1)},
            c1: {label: 'C 1', widgets: mock(4)},
            c2: {label: 'C 2', widgets: mock(1)},
            d: {label: 'D', widgets: mock(4)},
            e: {label: 'E', widgets: mock(2)},
            f1: {label: 'F 1', widgets: mock(1)},
            f2: {label: 'F 2', widgets: mock(1)},
            g: {label: 'G', widgets: mock(1)}
        }}
        layouts={{
            edit: {
                orientation: 'left',
                items: [{
                    id: 'ab',
                    icon: 'pi pi-user',
                    items: [{
                        label: 'A',
                        id: 'a',
                        items: [{label: 'A 1', id: 'a1'}, {label: 'A 2', id: 'a2'}],
                        widgets: ['a1', 'a2']
                    }, {
                        label: 'B',
                        id: 'b',
                        items: [{label: 'B 1', id: 'b1'}, {label: 'B 2', id: 'b2'}],
                        widgets: ['b1', 'b2']
                    }]
                }, {
                    id: 'cd',
                    icon: 'pi pi-id-card',
                    items: [{
                        label: 'C and D',
                        id: 'cd',
                        items: [{label: 'C', id: 'c'}, {label: 'D', id: 'd'}],
                        widgets: [['c1', 'c2'], 'd']
                    }]
                }, {
                    id: 'efg',
                    icon: 'pi pi-list',
                    items: [
                        {
                            label: 'E and F',
                            id: 'ef',
                            items: [{label: 'E', id: 'e'}, {label: 'F', id: 'f'}],
                            widgets: ['e', ['f1', 'f2']]
                        },
                        {
                            label: 'G',
                            id: 'g',
                            items: [{label: 'G', id: 'g'}],
                            widgets: ['g']
                        }
                    ]
                }]
            }
        }}
    />;
