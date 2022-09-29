import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import Button from './index';

const meta: Meta = {
    title: 'Button',
    component: Button,
    parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC = () => <Button >Button</Button>;
export const Add: React.FC = () => <Button button='save'>Save</Button>;
export const Cancel: React.FC = () => <Button button='cancel'>Cancel</Button>;
export const Next: React.FC = () => <Button button='next'>Next</Button>;
