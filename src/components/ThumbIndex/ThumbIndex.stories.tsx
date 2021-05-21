import React from 'react';
import { withReadme } from 'storybook-readme';
import Joi from 'joi';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import ThumbIndex from './index';
import Editor from '../Editor';
import {Toast} from '../prime';

export default {
    title: 'ThumbIndex',
    component: ThumbIndex,
    decorators: [withReadme(README)]
};

const state = {
};

const index = [{
    icon: 'pi pi-user',
    items: [{
        label: 'Main',
        expanded: true,
        filter: ['main', 'reg', 'financial'],
        items: [
            {label: 'Identification'},
            {label: 'Registration'},
            {label: 'Financial data'}
        ]
    }, {
        label: 'Contacts',
        filter: ['address', 'phone', 'email', 'person'],
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

const fields = [
    {card: 'main', name: 'identifierType', title: 'Identifier type *', editor: identifierTypeEditor},
    {card: 'main', name: 'identifier', title: 'Identifier *'},
    {card: 'main', name: 'clientNumber', title: 'Client number'},
    {card: 'main', name: 'legalStatus', title: 'Legal status'},
    {card: 'reg', name: 'regDocType', title: 'Document type'},
    {card: 'reg', name: 'regDocNum', title: 'Document number'},
    {card: 'reg', name: 'regIssuer', title: 'Issuer'},
    {card: 'reg', name: 'regCountry', title: 'Country'},
    {card: 'reg', name: 'regStart', title: 'Issuing date', editor: {type: 'date'}},
    {card: 'reg', name: 'regEnd', title: 'Valid until', editor: {type: 'date'}},
    {card: 'financial', name: 'capital', title: 'Issued Capital'},
    {card: 'financial', name: 'capitalCurrency', title: 'Issued Capital currency', editor: currencyEditor},
    {card: 'financial', name: 'capitalDate', title: 'Issued on'},
    {card: 'financial', name: 'capitalCountry', title: 'Capital country'},
    {card: 'financial', name: 'ownerNationality', title: 'Capital owner nationality'},
    {card: 'address', name: 'addressCountry', title: 'Country'},
    {card: 'address', name: 'addressCity', title: 'City'},
    {card: 'address', name: 'addressZip', title: 'Post code'},
    {card: 'address', name: 'addressStreet', title: 'Street'},
    {card: 'phone', name: 'phoneType', title: 'Type'},
    {card: 'phone', name: 'phoneCountry', title: 'Country'},
    {card: 'phone', name: 'phoneNumber', title: 'Phone number'},
    {card: 'email', name: 'emailType', title: 'Type'},
    {card: 'email', name: 'emailAddress', title: 'Email address'},
    {card: 'person', name: 'personName', title: 'Name'},
    {card: 'person', name: 'personPosition', title: 'Position'}

];

const schema = Joi.object({
    identifierType: Joi.number().integer().required(),
    identifier: Joi.string().required(),
    clientNumber: Joi.string().allow(''),
    legalStatus: Joi.string().allow(''),
    regDocType: Joi.string().allow(''),
    regDocNum: Joi.string()
        .when('regDocType', {
            is: [Joi.string(), Joi.number()],
            then: Joi.required(),
            otherwise: Joi.allow('')
        }),
    regIssuer: Joi.string().allow(''),
    regCountry: Joi.string().allow(''),
    regStart: Joi.string().allow(''),
    regEnd: Joi.string().allow(''),
    capital: Joi.string().allow(''),
    capitalCurrency: Joi.number().integer(),
    capitalDate: Joi.string().allow(''),
    capitalCountry: Joi.string().allow(''),
    ownerNationality: Joi.string().allow(''),
    addressCountry: Joi.string().allow(''),
    addressCity: Joi.string().allow(''),
    addressZip: Joi.string().allow(''),
    addressStreet: Joi.string().allow(''),
    phoneType: Joi.string().allow(''),
    phoneCountry: Joi.string().allow(''),
    phoneNumber: Joi.string().allow(''),
    emailType: Joi.string().allow(''),
    emailAddress: Joi.string().allow(''),
    personName: Joi.string().allow(''),
    personPosition: Joi.string().allow('')
});

const cards = [
    {id: 'main', title: 'Main data'},
    {id: 'reg', title: 'Registration'},
    {id: 'financial', title: 'Financial data'},
    {id: 'address', title: 'Address'},
    {id: 'phone', title: 'Phone'},
    {id: 'email', title: 'E-mail'},
    {id: 'person', title: 'Contact person'}
];

export const Basic: React.FC<{}> = () => {
    const [filter, setFilter] = React.useState(index?.[0]?.items?.[0].filter || []);
    const toast = React.useRef(null);
    return (
        <Wrap state={state}>
            <Toast ref={toast} />
            <ThumbIndex index={index} onFilter={setFilter}>
                <Editor
                    style={{flexGrow: 3}}
                    fields={fields}
                    cards={cards.filter(({id}) => filter && filter.includes(id))}
                    onSubmit={form => toast.current.show({
                        severity: 'success',
                        summary: 'Submit',
                        detail: <pre>{JSON.stringify(form, null, 2)}</pre>
                    })}
                    schema={schema}
                />
            </ThumbIndex>
        </Wrap>
    );
};
