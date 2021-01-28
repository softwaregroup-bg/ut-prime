import React from 'react';
import { fireEvent } from '@testing-library/react';

import { render } from '../test';
import Button from './index';

describe('<Button />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<Button />);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });

    it('triggers sent onClick function', () => {
        const onClick = jest.fn();
        const { getByTestId } = render(<Button data-testid='Button' onClick={onClick} />);
        fireEvent.click(getByTestId('Button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
