import React from 'react';

import { render } from '../test';
import { Basic } from './Scrollbox.stories';

describe('<Scrollbox />', () => {
    it('Basic render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
