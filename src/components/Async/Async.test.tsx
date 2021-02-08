import React from 'react';
import { act } from 'react-dom/test-utils';

import { render } from '../test';
import Async from './index';

describe('<Async />', () => {
    it('render equals snapshot', async() => {
        let res: (component: React.FC) => void;
        const success = () => new Promise<React.FC>(resolve => { res = resolve; });
        const { getByTestId } = render(<Async component={success} />);
        expect(getByTestId('ut-front-test')).toMatchSnapshot('loading');
        await act(async() => {
            res(() => <div>resolved</div>);
        });
        expect(getByTestId('ut-front-test')).toMatchSnapshot('loaded');
    });
});
