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
                async handleArchive(props) {
                    console.log('handleArchiveEvent', props);
                    console.log('array', props?.input?.table);
                    console.log('array', props?.selected);

                    const archive = [].concat(props?.input?.table);
                    // const updatedValue = props?.input.map(row => {
                    //     if (archive.some(item => item.id === row.id)) {
                    //         return {...row, id: 'documentTest123'};
                    //     }
                    //     return row;
                    // });
                    // props.input = updatedValue;
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
    // methods: {
    //     async handleArchive({value, form, event}) {
    //         event.preventDefault();
    //         // const archive = [].concat(selected);
    //         // const updatedValue = allRows.map(row => {
    //         //     if (archive.some(item => item.id === row.id)) {
    //         //         return {...row, id: 'documentTest123'};
    //         //     }
    //         //     return row;
    //         // });
    //         // handleSelected({value: updatedValue});
    //         // onChange({...event, value: updatedValue});
    //     }
    // }
};
