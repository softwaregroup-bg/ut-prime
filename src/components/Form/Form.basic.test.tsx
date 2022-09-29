import React from 'react';

import { render } from '../test';
import { Basic, BasicBG, BasicAR } from './Form.stories';
import { config } from 'react-transition-group';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('<Form />', () => {
    it('Basic equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('BasicBG equals snapshot', async() => {
        const { findByTestId } = render(<BasicBG {...BasicBG.args} />, undefined, 'bg');
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('BasicAR equals snapshot', async() => {
        const { findByTestId } = render(<BasicAR {...BasicAR.args} />, undefined, 'ar');
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
