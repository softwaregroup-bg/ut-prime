import { userEvent, within } from '@storybook/testing-library';

import {Template, Basic, type StoryTemplate} from '../Editor.stories';
export {default} from '../Editor.stories';

export const Validation: StoryTemplate = Template.bind({});
Validation.args = Basic.args;
Validation.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue('Oak'); // wait for the data to be loaded
    await userEvent.clear(canvas.getByLabelText('Name'));
    await userEvent.type(canvas.getByLabelText('Description'), 'test');
    await userEvent.click(canvas.getByLabelText('save'));
    await new Promise(resolve => setTimeout(resolve, 1000));
};

export const ValidationBG: StoryTemplate = Template.bind({});
ValidationBG.args = {
    ...Validation.args,
    lang: 'bg'
};
ValidationBG.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue('Oak'); // wait for the data to be loaded
    await userEvent.clear(canvas.getByLabelText('Име'));
    await userEvent.type(canvas.getByLabelText('Описание'), 'test');
    await userEvent.click(canvas.getByLabelText('save'));
    await new Promise(resolve => setTimeout(resolve, 1000));
};
