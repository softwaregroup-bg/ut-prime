import React from 'react';

import { render } from '../test';
import { Basic, Granted, Multiple, Wildcard, AnyDenied, Denied } from './Permission.stories';

describe('<Permission />', () => {
    it('Basic render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Granted render equals snapshot', async() => {
        const { findByTestId } = render(<Granted {...Granted.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Multiple render equals snapshot', async() => {
        const { findByTestId } = render(<Multiple {...Multiple.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Wildcard render equals snapshot', async() => {
        const { findByTestId } = render(<Wildcard {...Wildcard.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('AnyDenied render equals snapshot', async() => {
        const { findByTestId } = render(<AnyDenied {...AnyDenied.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Denied render equals snapshot', async() => {
        const { findByTestId } = render(<Denied {...Denied.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
