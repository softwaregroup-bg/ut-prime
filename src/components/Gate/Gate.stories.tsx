import React from 'react';
import type { Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import page from './README.mdx';
import Gate from './index';

const meta: Meta = {
    title: 'Internal/Gate',
    component: Gate,
    parameters: {docs: {page}},
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

export const Basic: React.FC<{}> = () =>
    <Gate><div className='p-component'>Gate body</div></Gate>;
