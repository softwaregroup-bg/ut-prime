import React from 'react';
import Editor from '..';
export {default} from '../Editor.stories';

export const CustomEditors = () => {
    function Period({Input, Label, ErrorLabel}) {
        return (
            <>
                <ErrorLabel/>
                <div className='field grid w-full mx-0'>
                    <Label className='md:col-2' name='period' />
                    <Input fieldClass='md:col-4' name='period' />
                    <Input fieldClass='md:col-6' name='unit' />
                </div>
            </>
        );
    }

    Period.properties = ['period', 'unit'];

    return (<Editor
        id={1}
        onGet={() => Promise.resolve({
            period: 5,
            unit: 'days'
        })}
        onDropdown={names => Promise.resolve({})}
        schema={{
            properties: {
                unit: {
                    widget: {
                        type: 'select',
                        options: [
                            {value: 'minutes', label: 'Minutes'},
                            {value: 'hours', label: 'Hours'},
                            {value: 'days', label: 'Days'},
                            {value: 'months', label: 'Months'}
                        ]
                    }
                },
                period: {
                    title: 'Expiration period',
                    type: 'integer'
                }
            }
        }}
        cards={{
            edit: {
                widgets: ['Period']
            }
        }}
        editors={{
            Period
        }}
    />);
};
