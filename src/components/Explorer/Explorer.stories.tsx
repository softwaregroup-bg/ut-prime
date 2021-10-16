import React from 'react';
import { withReadme } from 'storybook-readme';
import {Toast} from '../prime';

// @ts-ignore: md file and not a module
import README from './README.md';
import Explorer from './index';
import {fetchItems, updateItems} from './mock';

export default {
    title: 'Explorer',
    component: Explorer,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};

export const Basic: React.FC<{}> = () => {
    const toast = React.useRef(null);
    const show = action => data => toast.current.show({
        severity: 'success',
        summary: 'Submit',
        detail: <pre>{JSON.stringify({action, data}, null, 2)}</pre>
    });
    return (
        <>
            <Toast ref={toast} />
            <div style={{height: 500, display: 'flex', flexDirection: 'column'}}>
                <Explorer
                    fetch={fetchItems}
                    keyField='id'
                    resultSet='items'
                    schema={{
                        properties: {
                            name: {
                                title: 'Name',
                                filter: true,
                                sort: true
                            },
                            size: {
                                title: 'Size',
                                filter: true,
                                sort: true
                            }
                        }
                    }}
                    columns = {['name', 'size']}
                    subscribe={updateItems}
                    details={{
                        name: 'Name'
                    }}
                    filter={{}}
                    actions={[{
                        title: 'Create',
                        action: () => {}
                    }, {
                        title: 'Edit',
                        enabled: 'current',
                        action: show('edit')
                    }, {
                        title: 'Delete',
                        enabled: 'selected',
                        action: show('delete')
                    }]}
                >
                    <div>Navigation component</div>
                </Explorer>
            </div>
        </>
    );
};
