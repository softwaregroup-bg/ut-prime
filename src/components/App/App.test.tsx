import React from 'react';
import { render, act } from '../test';

import {
    Basic,
    BasicBG,
    BasicAR,
    BasicWithExtraTitleComponentBG,
    BasicWithExtraTitleComponentAR,
    Register,
    RegisterBG,
    RegisterAR,
    RegisterWithTitle,
    RegisterWithTitleBG,
    RegisterWithTitleAR,
    PublicPage
} from './App.stories';

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
    it('BasicWithExtraTitleComponentBG equals snapshot', async() => {
        const { findByTestId } = render(<BasicWithExtraTitleComponentBG {...BasicWithExtraTitleComponentBG.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('BasicWithExtraTitleComponentAR equals snapshot', async() => {
        const { findByTestId } = render(<BasicWithExtraTitleComponentAR {...BasicWithExtraTitleComponentAR.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('RegisterWithTitle equals snapshot', async() => {
        const { findByTestId } = render(<RegisterWithTitle {...RegisterWithTitle.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('RegisterWithTitleBG equals snapshot', async() => {
        const { findByTestId } = render(<RegisterWithTitleBG {...RegisterWithTitleBG.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('RegisterWithTitleAR equals snapshot', async() => {
        const { findByTestId } = render(<RegisterWithTitleAR {...RegisterWithTitleAR.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('PublicPage equals snapshot', async() => {
        const { findByTestId, container } = render(<PublicPage {...PublicPage.args} />);
        await act(() => PublicPage.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
