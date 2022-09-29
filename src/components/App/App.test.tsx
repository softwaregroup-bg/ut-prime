import React from 'react';
import { render } from '../test';

import { Basic, BasicBG, BasicAR, Register, RegisterBG, RegisterAR } from './App.stories';

describe('<App />', () => {
    it('Basic equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('BasicBG equals snapshot', async() => {
        const { findByTestId } = render(<BasicBG {...BasicBG.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('BasicAR equals snapshot', async() => {
        const { findByTestId } = render(<BasicAR {...BasicAR.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Register equals snapshot', async() => {
        const { findByTestId } = render(<Register {...Register.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('RegisterBG equals snapshot', async() => {
        const { findByTestId } = render(<RegisterBG {...RegisterBG.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('RegisterAR equals snapshot', async() => {
        const { findByTestId } = render(<RegisterAR {...RegisterAR.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
