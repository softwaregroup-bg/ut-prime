import React from 'react';
import Wrap from './wrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default [
    (Story, {args, globals}) => args?.state ? (
        <Wrap state={args?.state} dir={args?.dir ?? globals?.dir} type={globals?.theme} language={args?.lang}>
            <Story />
        </Wrap>
    ) : <DndProvider backend={HTML5Backend}>
        <Story />
    </DndProvider>
];
