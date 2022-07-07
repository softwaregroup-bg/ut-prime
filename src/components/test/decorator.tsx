import React from 'react';
import Wrap from './wrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default [
    (Story, {args}) => args?.state ? (
        <Wrap state={args?.state}>
            <Story />
        </Wrap>
    ) : <DndProvider backend={HTML5Backend}>
        <Story />
    </DndProvider>
];
