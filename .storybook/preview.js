import React from 'react';
import Wrap from '../src/components/test/wrap';

export const parameters = {
    layout: 'fullscreen',
    readme: {
        theme: {
            textColor: 'white',
            barBg: '#2b2b2b'
        },
        codeTheme: 'a11y-dark',
        StoryPreview: ({ children }) => children,
    }
};

export const decorators = [
    (Story, {args}) => args?.state ? (
        <Wrap state={args?.state}>
            <Story />
        </Wrap>
    ) : <Story />
];
