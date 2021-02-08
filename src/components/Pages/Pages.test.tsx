import React from 'react';
import {Router} from 'react-router';
import {createHashHistory, createMemoryHistory} from 'history';

import { render } from '../test';
import Pages from './index';

describe('<Pages />', () => {
    it('render equals snapshot', () => {
        const history = (typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory();
        const { getByTestId } = render(
            <Router history={history}>
                <Pages tabs={[]}/>
            </Router>
        );
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
