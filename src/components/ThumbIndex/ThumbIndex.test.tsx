import React from 'react';

import { render } from '../test';
import ThumbIndex from './index';

describe('<ThumbIndex />', () => {
    it('render equals snapshot', () => {
        const onFilter = jest.fn();
        const { getByTestId } = render(<ThumbIndex index={[]} onFilter={onFilter}/>);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
