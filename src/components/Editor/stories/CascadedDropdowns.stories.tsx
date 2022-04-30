import { userEvent, within } from '@storybook/testing-library';
import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const CascadedDropdowns = () =>
    <Editor
        schema={{
            type: 'object',
            properties: {
                continent: {widget: {type: 'dropdown', dropdown: 'continent'}},
                country: {widget: { type: 'dropdown', dropdown: 'country', parent: 'continent'}},
                city: {widget: { type: 'dropdown', dropdown: 'city', parent: 'country'}}
            }
        }}
        cards={{
            edit: {
                className: 'xl:col-3',
                widgets: ['continent', 'country', 'city']
            }
        }}
        onDropdown={() => Promise.resolve({
            continent: [
                {value: 1, label: 'Africa'},
                {value: 2, label: 'Asia'},
                {value: 3, label: 'Europe'},
                {value: 4, label: 'North America'},
                {value: 5, label: 'Oceania'},
                {value: 6, label: 'South America'}
            ],
            country: [
                {value: 1, label: 'Kenya', parent: 1},
                {value: 2, label: 'Uganda', parent: 1},
                {value: 3, label: 'Tanzania', parent: 1},
                {value: 7, label: 'United States', parent: 4},
                {value: 9, label: 'Mexico', parent: 4},
                {value: 10, label: 'Australia', parent: 5},
                {value: 11, label: 'New Zealand', parent: 5},
                {value: 12, label: 'France', parent: 3},
                {value: 13, label: 'Germany', parent: 3},
                {value: 14, label: 'Italy', parent: 3},
                {value: 15, label: 'Spain', parent: 3}
            ],
            city: [
                {value: 1, label: 'Nairobi', parent: 1},
                {value: 2, label: 'Kampala', parent: 2},
                {value: 3, label: 'Dar es Salaam', parent: 3},
                {value: 4, label: 'New York', parent: 7},
                {value: 6, label: 'Mexico City', parent: 9},
                {value: 7, label: 'Canberra', parent: 10},
                {value: 8, label: 'Paris', parent: 12},
                {value: 9, label: 'Berlin', parent: 13},
                {value: 10, label: 'Rome', parent: 14}
            ]
        })}
        layouts={{edit: ['edit']}}
    />;

CascadedDropdowns.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    userEvent.click(await canvas.findByTestId('continent'));
    userEvent.click(body.getByText('Europe'));
    userEvent.click(canvas.getByTestId('country'));
    userEvent.click(body.getByText('France'));
    userEvent.click(canvas.getByTestId('city'));
    userEvent.click(body.getByText('Paris'));
};
