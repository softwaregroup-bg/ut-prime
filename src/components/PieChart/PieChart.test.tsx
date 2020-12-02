import React from 'react';
import { render } from '@testing-library/react';

import PieChart from './index';

describe('<PieChart />', () => {
    it('renders component without breaking', () => {
        const { getByTestId } = render(
            <PieChart
                data-testid="PieChart"
                dataSource={[
                    {
                        country: 'Russia',
                        area: 12,
                    },
                ]}
                title="Area of Countries"
                argumentField="country"
                valueField="area"
            />,
        );

        expect(getByTestId('PieChart')).toMatchSnapshot();
    });
});
