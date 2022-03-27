import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const TabbedLayout = () =>
    <Editor
        debug
        onDropdown={names => Promise.resolve({})}
        cards={{
            a1: {label: 'A 1'},
            a2: {label: 'A 2'},
            b1: {label: 'B 1'},
            b2: {label: 'B 2'},
            b3: {label: 'B 3'},
            c: {label: 'C'},
            d: {label: 'D'},
            e: {label: 'E', className: 'xl:col-4'},
            f1: {label: 'F 1', className: 'xl:col-4'},
            f2: {label: 'F 2'},
            g: {label: 'G', className: 'xl:col-4'}
        }}
        layouts={{
            edit: {
                orientation: 'top',
                items: [{
                    id: 'ab',
                    label: 'A and B',
                    widgets: [['a1', 'a2'], ['b1', 'b2', 'b3']]
                }, {
                    id: 'cd',
                    label: 'C and D',
                    widgets: ['c', 'd']
                }, {
                    id: 'efg',
                    label: 'E, F and G',
                    widgets: ['e', ['f1', 'f2'], 'g']
                }]
            }
        }}
    />;
