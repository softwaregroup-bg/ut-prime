import React from 'react';
import { withReadme } from 'storybook-readme';
import Joi from 'joi';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import ThumbIndex from './index';
import Editor from '../Editor';
import {Toast, Toolbar, Button} from '../prime';

export default {
    title: 'ThumbIndex',
    component: ThumbIndex,
    decorators: [withReadme(README)]
};

const state = {
};

const data = {
    identifierType: 1,
    identifier: 'id-123',
    phone: [
        {id: 1, type: 'home', countryCode: '+359', phoneNumber: '123'},
        {id: 2, type: 'work', countryCode: '+359', phoneNumber: '456'}
    ],
    email: [
        { id: 1, type: 'home', emailAddress: 'name@example.com'},
        {id: 2, type: 'work', emailAddress: 'office@example.com'}
    ]
};

const index = [{
    icon: 'pi pi-user',
    items: [{
        label: 'Main',
        cards: ['main', 'reg', 'financial', 'invalid'],
        items: [
            {label: 'Identification'},
            {label: 'Registration'},
            {label: 'Financial data'}
        ]
    }, {
        label: 'Contacts',
        cards: ['address', 'phone', 'email', 'person'],
        items: [
            {label: 'Address'},
            {label: 'Phone & Mail'},
            {label: 'Contact person'}
        ]
    }]
}, {
    icon: 'pi pi-users'
}, {
    icon: 'pi pi-book'
}, {
    icon: 'pi pi-clock'
}];

const identifierTypeEditor = {
    type: 'dropdown',
    options: [
        {value: 1, label: 'Sole Trader'},
        {value: 2, label: 'Ltd.'}
    ]
};

const currencyEditor = {
    type: 'dropdown',
    options: [
        {value: 1, label: 'USD'},
        {value: 2, label: 'EUR'}
    ]
};
const phoneEditor = {
    type: 'table',
    columns: [
        { field: 'type', header: 'Type' },
        { field: 'countryCode', header: 'Country code' },
        { field: 'phoneNumber', header: 'Number' }
    ]
};

const emailEditor = {
    type: 'table',
    columns: [
        { field: 'type', header: 'Type' },
        { field: 'emailAddress', header: 'Email address' }
    ]
};

const fields = {
    identifierType: {title: 'Identifier type *', editor: identifierTypeEditor, validation: Joi.number().integer().required().label('Identifier type')},
    identifier: {title: 'Identifier *', validation: Joi.string().required()},
    clientNumber: {title: 'Client number'},
    legalStatus: {title: 'Legal status'},
    regDocType: {title: 'Document type'},
    regDocNum: {
        title: 'Document number',
        validation: Joi.string()
            .when('regDocType', {
                is: [Joi.string(), Joi.number()],
                then: Joi.required(),
                otherwise: Joi.allow('')
            })
            .label('Document number')
    },
    regIssuer: {title: 'Issuer'},
    regCountry: {title: 'Country'},
    regStart: {title: 'Issuing date', editor: {type: 'date', mask: '99/99/9999'}, validation: Joi.date()},
    regEnd: {title: 'Valid until', editor: {type: 'date', mask: '99/99/9999'}, validation: Joi.date()},
    capital: {title: 'Issued Capital', editor: {type: 'currency'}, validation: Joi.number()},
    capitalCurrency: {title: 'Issued Capital currency', editor: currencyEditor, validation: Joi.number().integer()},
    capitalDate: {title: 'Issued on'},
    capitalCountry: {title: 'Capital country'},
    ownerNationality: {title: 'Capital owner nationality'},
    addressCountry: {title: 'Country'},
    addressCity: {title: 'City'},
    addressZip: {title: 'Post code'},
    addressStreet: {title: 'Street'},
    phone: {title: '', editor: phoneEditor, validation: Joi.any()},
    email: {title: '', editor: emailEditor, validation: Joi.any()},
    personName: {title: 'Name'},
    personPosition: {title: 'Position'}
};

const cards = {
    main: {title: 'Main data', className: 'p-lg-6 p-xl-4', fields: ['identifierType', 'identifier', 'clientNumber', 'legalStatus']},
    reg: {title: 'Registration', className: 'p-lg-6 p-xl-4', fields: ['regDocType', 'regDocNum', 'regIssuer', 'regCountry', 'regStart', 'regEnd']},
    financial: {title: 'Financial data', className: 'p-lg-6 p-xl-4', fields: ['capital', 'capitalCurrency', 'capitalDate', 'capitalCountry', 'ownerNationality']},
    address: {title: 'Address', fields: ['addressCountry', 'addressCity', 'addressZip', 'addressStreet']},
    phone: {title: 'Phone', fields: ['phone']},
    email: {title: 'E-mail', fields: ['email']},
    person: {title: 'Contact person', fields: ['personName', 'personPosition']}
};

export const Basic: React.FC<{}> = () => {
    const [filter, setFilter] = React.useState(index?.[0]?.items?.[0]);
    const toast = React.useRef(null);
    const trigger = React.useRef(null);
    const submit = React.useCallback(formData => toast.current.show({
        severity: 'success',
        summary: 'Submit',
        detail: <pre>{JSON.stringify(formData, null, 2)}</pre>
    }), [toast]);
    return (
        <Wrap state={state}>
            <Toast ref={toast} />
            <Toolbar left={<Button icon='pi pi-save' onClick={() => trigger?.current?.()}/>}/>
            <div className='p-grid' style={{overflowX: 'hidden', width: '100%'}}>
                <ThumbIndex index={index} onFilter={setFilter}/>
                <Editor
                    fields={fields}
                    cards={cards}
                    layout={filter?.cards || []}
                    onSubmit={submit}
                    trigger={trigger}
                    value={data}
                />
            </div>
        </Wrap>
    );
};
