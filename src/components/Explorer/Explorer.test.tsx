import React from 'react';
import {waitFor} from '@testing-library/react';

import { render } from '../test';
import Explorer from './index';
import {fetchItems} from './mock';

describe('<Explorer />', () => {
    it('render equals snapshot', async() => {
        const { getByTestId } = render(<Explorer
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
            details={{
                name: 'Name'
            }}
        />);
        await waitFor(() => expect(getByTestId('ut-front-test').querySelector('tr.p-selectable-row')).toBeTruthy());
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
