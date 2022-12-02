import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import decorators from '../test/decorator';
import ActionButton from './index';
import { useToast } from 'ut-prime/src/components/hooks';

const meta: Meta = {
    title: 'ActionButton',
    component: ActionButton,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {}
    }
};
export default meta;

export const Basic: React.FC = () => {
    const {toast, submit, delay, error} = useToast();
    return <>
        <div className='m-5'>
            <ActionButton action={submit} successHint={<div>saved</div>}>Submit</ActionButton>
        </div>
        <div className='m-5'>
            <ActionButton action={delay} successHint={<div>saved after delay</div>}>Delay</ActionButton>
        </div>
        <div className='m-5'>
            <ActionButton action={error('action error')}>Error</ActionButton>
        </div>
        {toast}
    </>;
};
