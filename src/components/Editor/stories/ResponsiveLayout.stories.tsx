import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const ResponsiveLayout = () =>
    <Editor
        debug
        onDropdown={names => Promise.resolve({})}
        cards={{
            a1: {label: 'A 1', className: 'sm:col-6 xl:col-4'},
            a2: {label: 'A 2'},
            b1: {label: 'B 1', className: 'sm:col-6 xl:col-4'},
            b2: {label: 'B 2'},
            b3: {label: 'B 3'},
            c: {label: 'C', className: 'md:col-6 xl:col-4'},
            d: {label: 'D', className: 'md:col-6 xl:col-4'},
            e: {label: 'E', className: 'md:col-4'},
            f1: {label: 'F 1', className: 'md:col-4'},
            f2: {label: 'F 2'},
            g: {label: 'G', className: 'md:col-4'}
        }}
        layouts={{
            edit: [
                ['a1', 'a2'],
                ['b1', 'b2', 'b3'],
                'c',
                'd',
                'e',
                ['f1', 'f2'],
                'g'
            ]
        }}
    />;
