import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const ThumbIndexLayout = () =>
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
                orientation: 'left',
                items: [{
                    id: 'ab',
                    icon: 'pi pi-user',
                    items: [{
                        label: 'A',
                        items: [{label: 'A 1'}, {label: 'A 2'}],
                        widgets: ['a1', 'a2']
                    }, {
                        label: 'B',
                        items: [{label: 'B 1'}, {label: 'B 2'}, {label: 'B 3'}],
                        widgets: ['b1', 'b2', 'b3']
                    }]
                }, {
                    id: 'cd',
                    icon: 'pi pi-id-card',
                    items: [{
                        label: 'C and D',
                        items: [{label: 'C'}, {label: 'D'}],
                        widgets: ['c', 'd']
                    }]
                }, {
                    id: 'efg',
                    icon: 'pi pi-list',
                    items: [
                        {
                            label: 'E and F',
                            items: [{label: 'E'}, {label: 'F'}],
                            widgets: ['e', ['f1', 'f2']]
                        },
                        {
                            label: 'G',
                            items: [{label: 'G'}],
                            widgets: ['g']
                        }
                    ]
                }]
            }
        }}
    />;
