import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const PolymorphicLayout = () => {
    const props = {
        typeField: 'type',
        keyField: 'id',
        onDropdown: names => Promise.resolve({}),
        schema: {
            properties: {
                name: {},
                role: {},
                registrationNumber: {}
            }
        },
        cards: {
            editPerson: {
                label: 'Person',
                className: 'col-12',
                widgets: ['name', 'role']
            },
            editOrganization: {
                label: 'Organization',
                className: 'col-12',
                widgets: ['name', 'registrationNumber']
            }
        }
    };

    return (<div className='flex flex-row'>
        <div className='flex-col flex-grow-1'>
            <Editor
                id={1}
                onGet={() => Promise.resolve({
                    id: 1,
                    type: 'person',
                    name: 'John Doe',
                    role: 'Director'
                })}
                {...props}
            />
        </div>
        <div className='flex-col flex-grow-1'>
            <Editor
                id={2}
                onGet={() => Promise.resolve({
                    id: 2,
                    type: 'organization',
                    name: 'Acme Inc.',
                    registrationNumber: '111-111-111'
                })}
                {...props}
            />
        </div>
    </div>);
};
