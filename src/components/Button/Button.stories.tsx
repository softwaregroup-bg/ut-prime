import React from 'react';
import type { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// @ts-ignore: md file and not a module
import page from './README.mdx';
import Button from './index';

const meta: Meta = {
    title: 'Button',
    component: Button,
    parameters: {docs: {page}}
};
export default meta;

export const Basic: React.FC<{}> = () => <Button onClick={action('clicked')}>Button</Button>;
export const Add: React.FC<{}> = () => <Button onClick={action('clicked')} button='save'>Save</Button>;
export const Cancel: React.FC<{}> = () => <Button onClick={action('clicked')} button='cancel'>Cancel</Button>;
export const Next: React.FC<{}> = () => <Button onClick={action('clicked')} button='next'>Next</Button>;
