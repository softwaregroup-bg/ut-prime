import React from 'react';

import { render } from '../test';
import { Basic } from './Report.stories';

describe('<Report />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<Basic />);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
