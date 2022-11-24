import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Wrap from './wrap';
import { ConfirmPopup } from '../prime';

export default [
    (Story, {args, globals}) => args?.state ? (
        <Wrap state={args.state} dir={args.dir ?? globals?.dir} type={globals?.theme} language={args.lang} middleware={args.middleware}>
            <Story />
        </Wrap>
    ) : <DndProvider backend={HTML5Backend}>
        <ConfirmPopup />
        <Story />
    </DndProvider>
];
