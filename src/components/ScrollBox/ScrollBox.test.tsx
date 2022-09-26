import React from 'react';

import { render } from '../test';
import { Basic } from './ScrollBox.stories';

describe('<ScrollBox />', () => {
    it('Basic render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
