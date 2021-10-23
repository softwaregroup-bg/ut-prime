import React from 'react';
import {waitFor} from '@testing-library/react';

import { render } from '../test';
import Navigator from './index';

describe('<Navigator />', () => {
    it('render equals snapshot', async() => {
        const { getByTestId } = render(<Navigator
            fetch={() => Promise.resolve({
                items: [...Array(50).keys()].map(number => ({
                    id: String(number),
                    name: `Item ${number}`,
                    parents: number >= 10 ? String(number % 10) : undefined
                }))
            })}
            keyField='id'
            resultSet='items'
            field='name'
            title='Name'
        />);
        await waitFor(() => expect(getByTestId('ut-front-test').querySelector('div.p-treenode-content')).toBeTruthy());
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
