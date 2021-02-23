import React from 'react';
import { render, waitFor } from '@testing-library/react';

import store from '../test/store';
import App from './index';

describe('<App />', () => {
    it('render equals snapshot', async() => {
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
        await waitFor(() => expect(getByTestId('ut-front-test').querySelector('div.dx-box')).toBeTruthy());
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
