import React from 'react';
import type { Meta } from '@storybook/react';
import merge from 'ut-function.merge';

// import page from './README.mdx';
import Json from '.';
import decorators from '../test/decorator';

const previous = {
    'General Info': {
        'First name': 'Super',
        'Last name': 'Admin',
        'National id': null,
        Gender: 'm',
        'User Classification': 1,
        'Phone model': null,
        'Computer model': null,
        'Business Unit': 'Central office',
        'Business Unit Type': true,
        'Lock Status': true
    },
    Addresses: [],
    'Phone Numbers': [],
    Email: [],
    'Assigned Roles': [],
    Credentials: {
        'Set Username': 'user',
        'Access Policy Status': '1',
        'Override User Access Policy': 'Policy 2'
    },
    'External Credentials': [{
        'External System': 'cbs',
        'User Type': 'login',
        Username: 'user'
    }, 'test:test'],
    Documents: []
};
const value = merge({}, previous, {
    'General Info': {
        'Business Unit': null,
        Language: 'English',
        'Lock Status': false
    },
    Credentials: {
        'Override User Access Policy': 'Policy1'
    },
    'External Credentials': [{
        'External System': null,
        'User Type': 'login',
        Username: 'login',
        Active: true
    }, null, 'test:test']
});

const meta: Meta = {
    title: 'Json',
    decorators,
    component: Json,
    args: {
        state: {}
    }
    // parameters: {docs: {page}}
};
export default meta;

export const Diff: React.FC = () =>
    <Json
        value={value}
        previous={previous}
    />;

export const View: React.FC = () =>
    <Json value={value}/>;

export const KeyValue: React.FC = () =>
    <Json keyValue className='w-full' value={[
        ['Country', 'Albania'],
        ['Country', 'Afghanistan'],
        ['city', 'Burgas'],
        ['region', 'West'],
        ['organization', 'Software Group'],
        ['organization', 'Bulgaria'],
        ['exchange']
    ]}
    />;
