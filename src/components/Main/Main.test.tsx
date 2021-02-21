import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router';
import {createHashHistory, createMemoryHistory} from 'history';

import { render} from '../test';
import Main from './index';
import Context from '../Context';

describe('<Main />', () => {
    it('render equals snapshot', () => {
        const store = createStore(() => ({
            login: {
                get() {}
            }
        }));
        const history = (typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory();
        const { getByTestId } = render(
            <Provider store={store}>
                <Context.Provider
                    value={{portalName: 'test'}}
                >
                    <Router history={history}>
                        <Route component={Main} />
                    </Router>
                </Context.Provider>
            </Provider>
        );
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
