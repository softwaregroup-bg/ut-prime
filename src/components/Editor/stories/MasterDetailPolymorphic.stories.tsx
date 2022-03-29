import { userEvent, within } from '@storybook/testing-library';
import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

const common = {
    className: 'xl:col-3',
    label: 'Shape properties',
    watch: '$.selected.shape'
};

export const MasterDetailPolymorphic = () =>
    <Editor
        id={1}
        onGet={() => Promise.resolve({
            shape: [
                {name: 'Big circle', type: 'circle', radius: 100},
                {name: 'Small ellipse', type: 'ellipse', radius: 5, secondRadius: 4},
                {name: 'Big square', type: 'square', side1: 100},
                {name: 'Medium triangle', type: 'triangle', side1: 30, side2: 40, side3: 50},
                {name: 'Small rectangle', type: 'rectangle', side1: 2, side2: 4}
            ]
        })}
        onDropdown={() => Promise.resolve({})}
        schema={{
            type: 'object',
            properties: {
                shape: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {},
                            type: {enum: ['circle', 'square', 'triangle', 'rectangle', 'ellipse']},
                            radius: {title: 'Radius', type: 'number'},
                            secondRadius: {title: 'Second radius', type: 'number'},
                            side1: {title: 'Side Length', type: 'number'},
                            side2: {title: 'Second Side Length', type: 'number'},
                            side3: {title: 'Third Side Length', type: 'number'},
                            tags: {}
                        }
                    },
                    title: '',
                    widget: {
                        type: 'table',
                        selectionMode: 'single',
                        actions: {
                            allowEdit: false
                        }
                    }
                }
            }
        }}
        cards={{
            shapes: {
                label: 'Shapes',
                className: 'xl:col-2',
                widgets: [{
                    name: 'shape',
                    widgets: ['name']
                }]
            },
            shapeCircle: {
                ...common,
                match: {type: 'circle'},
                widgets: [
                    '$.edit.shape.radius'
                ]
            },
            shapeEllipse: {
                ...common,
                match: {type: 'ellipse'},
                widgets: [
                    '$.edit.shape.radius',
                    '$.edit.shape.secondRadius'
                ]
            },
            shapeSquare: {
                ...common,
                match: {type: 'square'},
                widgets: [
                    '$.edit.shape.side1'
                ]
            },
            shapeRectangle: {
                ...common,
                match: {type: 'rectangle'},
                widgets: [
                    '$.edit.shape.side1',
                    '$.edit.shape.side2'
                ]
            },
            shapeTriangle: {
                ...common,
                match: {type: 'triangle'},
                widgets: [
                    '$.edit.shape.side1',
                    '$.edit.shape.side2',
                    '$.edit.shape.side3'
                ]
            }
        }}
        layouts={{
            edit: ['shapes', ['shapeCircle', 'shapeSquare', 'shapeTriangle', 'shapeRectangle', 'shapeEllipse']]
        }}
    />;

MasterDetailPolymorphic.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByText('Small ellipse'));
};
