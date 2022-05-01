import React from 'react';
import { withReadme } from 'storybook-readme';

// @ts-ignore: md file and not a module
import README from './README.md';
import Text from './index';

export default {
    title: 'Text',
    component: Text,
    decorators: [withReadme(README)],
    args: {
        state: {
        }
    }
};

export const Basic: React.FC<{}> = () =>
    <div className='p-component'><Text>Text content, which can be translated</Text></div>;
