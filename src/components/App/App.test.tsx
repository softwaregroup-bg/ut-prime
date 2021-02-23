import React from 'react';
import { render } from '@testing-library/react';

import store from '../test/store';
import App from './index';

describe('<App />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(
            <div data-testid="ut-front-test">
                <App
                    portalName='test'
                    store={store()}
                    theme={{
                        ut: {
                            classes: {}
                        }
                    }}
                />
            </div>
        );
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
