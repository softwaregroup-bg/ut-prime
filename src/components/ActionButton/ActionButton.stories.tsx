import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import decorators from '../test/decorator';
import type { Props } from './ActionButton.types';
import ActionButton from './index';
import useSubmit from '../hooks/useSubmit';
import { useToast } from '../hooks';
import { OverlayPanel } from '../prime';

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

declare type StoryTemplate = Story<Partial<Props>> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

const sticky = {sticky: false};

const Template: Story<Props> = args => {
    const {toast, submit} = useToast(sticky);
    const overlay = React.useRef(null);
    return <div className='m-5'>
        <ActionButton action={submit} overlay={overlay} {...args} />
        {toast}
        <OverlayPanel ref={overlay}>
            saved
        </OverlayPanel>
    </div>;
};

export const Basic: StoryTemplate = Template.bind({});
Basic.args = {
    label: 'Save'
};
