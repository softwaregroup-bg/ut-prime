import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import { render } from '../test';
import Portal from './index';

describe('<Portal />', () => {
    it('render equals snapshot', () => {
        const store = createStore(() => ({
            login: {
                get(name) {
                    return {
                        result: true
                    }[name];
                }
            }
        }));
        const { getByTestId } = render(
            <Provider store={store}>
                <Portal />
            </Provider>,
            {}
        );
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
