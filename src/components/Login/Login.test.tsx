import React from 'react';
import immutable from 'immutable';

import { render } from '../test';
import Login from './index';

expect.addSnapshotSerializer({
    test: val => typeof val === 'string' && /^dx_dx-.*_username/.test(val),
    serialize: () => '"test-id"'
});

describe('<Login />', () => {
    it('render equals snapshot', () => {
        const {
            getByTestId
        } = render(<Login />, {
            login: immutable.fromJS({
                authenticated: false
            })
        });
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
