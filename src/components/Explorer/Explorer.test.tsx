import React from 'react';
import {waitFor} from '@testing-library/react';

import { render } from '../test';
import Explorer from './index';

describe('<Explorer />', () => {
    it('render equals snapshot', async() => {
        const { getByTestId } = render(<Explorer
            fetch={() => Promise.resolve({
                items: [...Array(50).keys()].map(number => ({
                    id: number,
                    name: `Item ${number}`,
                    size: number * 10
                }))
            })}
            keyField='id'
            resultSet='items'
            fields={[{
                dataField: 'name',
                caption: 'Name'
            }, {
                dataField: 'size',
                caption: 'Size'
            }]}
            details={{
                name: 'Name'
            }}
        />);
        await waitFor(() => expect(getByTestId('ut-front-test').querySelector('tr.dx-row')).toBeTruthy());
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});