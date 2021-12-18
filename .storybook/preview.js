import React from 'react';
import Wrap from '../src/components/test/wrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import theme from './theme';
if(process.env.NODE_ENV === 'production') require('./preview.css');

export const parameters = {
    layout: 'fullscreen',
    readme: {
        theme: {
            textColor: 'white',
            barBg: '#2b2b2b'
        },
        codeTheme: 'a11y-dark',
        StoryPreview: ({ children }) => children,
    },
    docs: {
        theme
    }
};

export const decorators = [
    (Story, {args}) => args?.state ? (
        <Wrap state={args?.state}>
            <Story />
        </Wrap>
    ) : <DndProvider backend={HTML5Backend}>
            <Story />
        </DndProvider>
];
