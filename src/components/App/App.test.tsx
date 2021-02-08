import React from 'react';
import {createStore} from 'redux';

import { render } from '../test';
import App from './index';

describe('<App />', () => {
    it('render equals snapshot', () => {
        const store = createStore(() => ({
            login: {
                get() {}
            }
        }));
        const { getByTestId } = render(
            <App
                menu={[]}
                portalName='test'
                showTab={() => {}}
                store={store}
                theme={{
                    ut: {
                        classes: {}
                    }
                }}
            />
        );
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
