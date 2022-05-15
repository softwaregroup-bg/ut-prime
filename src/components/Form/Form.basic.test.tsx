import React from 'react';

import { render } from '../test';
import { Basic } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    it('render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
