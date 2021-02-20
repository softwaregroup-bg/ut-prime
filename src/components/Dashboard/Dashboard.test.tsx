import React from 'react';

import { render } from '../test';
import Dashboard from './index';

describe('<Dashboard />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<Dashboard tabName='tab' />);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
