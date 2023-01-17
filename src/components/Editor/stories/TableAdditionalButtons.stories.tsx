import React from 'react';
import type { Story } from '@storybook/react';
import type { Props } from '../Editor.types';
import Editor from '..';
import useToast from '../../hooks/useToast';

import {input, dropdowns} from '../../test/inputAdditionalButtons';

export {default} from '../Editor.stories';

const Template: Story<Props> = ({methods, ...args}) => {
    const {toast, submit} = useToast();
    return <>
        <Editor
            id={1}
            object='input'
            onGet={() => Promise.resolve({input: {}})}
            onDropdown={() => Promise.resolve(dropdowns)}
            onAdd={submit}
            onEdit={submit}
            onFieldChange='handleFieldChange'
            methods={{
                async handleFieldChange({field, value, event}: {field: unknown, value, event: Event}) {
                    submit({field, value});
                    // throw new Error('test error');
                    // return false;
                },
                async 'document.customer.notify'() {
                    submit('Notification sent');
                },
                async 'portal.customization.get'() {
                    return {};
                },
                ...methods
            }}
            {...args}
        />
        {toast}
    </>;
};

declare type StoryTemplate = Story<Partial<Props>> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

export const TableAdditionalButtons: StoryTemplate = Template.bind({});
TableAdditionalButtons.args = {
    ...input,
    layouts: {edit: ['center']}
};
