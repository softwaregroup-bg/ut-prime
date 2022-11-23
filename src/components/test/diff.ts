import merge from 'ut-function.merge';

export const previous = {
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

export const current = merge({}, previous, {
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
