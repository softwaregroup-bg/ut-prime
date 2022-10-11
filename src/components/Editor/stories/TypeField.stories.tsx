import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const TypeField = () => {
    return (<Editor
        id={1}
        typeField='type'
        onGet={() => Promise.resolve({
            type: 'circle',
            radius: 10
        })}
        onDropdown={names => Promise.resolve({})}
        schema={{
            properties: {
                radius: {},
                type: {}
            }
        }}
        cards={{
            editCircle: {
                widgets: ['type', 'radius']
            }
        }}
        layouts={{
            editCircle: {
                orientation: 'top',
                items: [{
                    icon: 'pi pi-user',
                    label: 'Circle',
                    widgets: ['editCircle']
                }]
            }
        }}
    />);
};
