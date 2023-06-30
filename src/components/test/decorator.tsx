import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Tooltip } from 'react-tooltip';

import Wrap from './wrap';
import { ConfirmPopup, ConfirmDialog } from '../prime';

export default [
    (Story, {args, globals}) => args?.state ? (
        <Wrap state={args.state} dir={args.dir ?? globals?.dir} type={globals?.theme} language={args.lang} middleware={args.middleware}>
            <Story />
        </Wrap>
    ) : <DndProvider backend={HTML5Backend}>
        <ConfirmPopup />
        <ConfirmDialog />
        <Tooltip
            id="utPrime-react-tooltip"
            className="p-component z-2" // because table header has z-index: 1
        />
        <Story />
    </DndProvider>
];
