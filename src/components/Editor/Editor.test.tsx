import React from 'react';

import { render } from '../test';
import { Basic, Loading, Design } from './Editor.stories';

describe('<Editor />', () => {
    it('Basic render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Loading render equals snapshot', async() => {
        const { findByTestId } = render(<Loading {...Loading.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Design render equals snapshot', async() => {
        const { findByTestId } = render(<Design {...Design.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
