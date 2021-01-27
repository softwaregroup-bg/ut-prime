import React from 'react';
import immutable from 'immutable';

import { render } from '../test';
import Loader from './index';

describe('<Loader />', () => {
    it('render equals snapshot', () => {
        const {
            getByTestId
        } = render(<Loader />, {
            preloadWindow: immutable.fromJS({
                open: true,
                message: 'Loading...'
            })
        });
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
