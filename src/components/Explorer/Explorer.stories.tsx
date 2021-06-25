import React from 'react';
import { withReadme } from 'storybook-readme';
import Wrap from '../test/wrap';
import {Toast} from '../prime';

// @ts-ignore: md file and not a module
import README from './README.md';
import Explorer from './index';
import {fetchItems, updateItems} from './mock';

export default {
    title: 'Explorer',
    component: Explorer,
    decorators: [withReadme(README)]
};

const state = {
};
export const Basic: React.FC<{}> = () => {
    const toast = React.useRef(null);
    const show = action => data => toast.current.show({
        severity: 'success',
        summary: 'Submit',
        detail: <pre>{JSON.stringify({action, data}, null, 2)}</pre>
    });
    return (
        <Wrap state={state}>
            <Toast ref={toast} />
            <div style={{height: 500, display: 'flex', flexDirection: 'column'}}>
                <Explorer
                    fetch={fetchItems}
                    keyField='id'
                    resultSet='items'
                    fields={[{
                        field: 'name',
                        title: 'Name',
                        filter: true,
                        sort: true
                    }, {
                        field: 'size',
                        title: 'Size',
                        filter: true,
                        sort: true
                    }]}
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
        </Wrap>
    );
};
