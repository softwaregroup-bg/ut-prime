import React from 'react';

import { render } from '../test';
import { Basic } from './Report.stories';

describe('<Report />', () => {
    it('render equals snapshot', async() => {
        const { findByTestId } = render(<Basic />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
