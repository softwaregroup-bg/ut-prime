import React from 'react';

import { render } from '../test';
import ErrorPopup from './index';
import reducer from './reducer';

describe('<ErrorPopup />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<ErrorPopup />, {errorPopup: {open: true}}, reducer);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
