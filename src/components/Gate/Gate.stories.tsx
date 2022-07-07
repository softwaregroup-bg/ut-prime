import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import Gate from './index';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Internal/Gate',
    component: Gate,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {
            login: {
                get: item => ({
                    cookieChecked: true,
                    authenticated: true,
                    result: {
                        getIn: () => {}
                    }
                }[item])
            }
        }
    }
};
export default meta;

export const Basic: React.FC = () =>
    <Gate><div className='p-component'>Gate body</div></Gate>;
