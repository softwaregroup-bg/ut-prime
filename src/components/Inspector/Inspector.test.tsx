import React from 'react';

import { render } from '../test';
import { Basic } from './Inspector.stories';

describe('<Inspector />', () => {
    it('Basic render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
