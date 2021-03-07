import React from 'react';
import { render, waitFor } from '@testing-library/react';

import App from './index';
import state from '../test/state';

describe('<App />', () => {
    it('render equals snapshot', async() => {
        const { getByTestId } = render(
            <div data-testid="ut-front-test">
                <App
                    portalName='test'
                    state={state}
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
