import React from 'react';

import { render } from '../test';
import Gate from './index';
import immutable from 'immutable';

describe('<Gate />', () => {
    it('render equals snapshot', () => {
        const {
            getByTestId
        } = render(<Gate />, {
            login: immutable.fromJS({
                cookieChecked: true,
                authenticated: true
            }),
            preloadWindow: immutable.fromJS({
                open: true,
                message: 'Loading...'
            })
        });
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
