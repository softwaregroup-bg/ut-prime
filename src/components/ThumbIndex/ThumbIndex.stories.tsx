import React from 'react';
import { withReadme } from 'storybook-readme';
import Joi from 'joi';

// @ts-ignore: md file and not a module
import README from './README.md';
import ThumbIndex from './index';
import Form from '../Form';
import {Schema, PropertyEditor} from '../types';
import {Toolbar, Button} from '../prime';
import useToast from '../hooks/useToast';

export default {
    title: 'ThumbIndex',
    component: ThumbIndex,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
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

const items = [{
    icon: 'pi pi-user',
    items: [{
        label: 'Main',
        widgets: ['main', 'reg', 'financial', 'invalid'],
        items: [
            {label: 'Identification'},
            {label: 'Registration'},
            {label: 'Financial data'}
        ]
    }, {
        label: 'Contacts',
        widgets: ['address', 'phone', 'email', 'person'],
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

const identifierTypeEditor: PropertyEditor = {
    type: 'dropdown',
    options: [
        {value: 1, label: 'Sole Trader'},
        {value: 2, label: 'Ltd.'}
    ]
};

const currencyEditor: PropertyEditor = {
    type: 'dropdown',
    options: [
        {value: 1, label: 'USD'},
        {value: 2, label: 'EUR'}
    ]
};
const tableEditor: PropertyEditor = {
    type: 'table'
};

const schema: Schema = {
    properties: {
        identifierType: {title: 'Identifier type *', widget: identifierTypeEditor, validation: Joi.number().integer().required().label('Identifier type')},
        identifier: {title: 'Identifier *', validation: Joi.string().required()},
        clientNumber: {title: 'Client number'},
        legalStatus: {title: 'Legal status'},
        regDoc: {
            properties: {
                type: {title: 'Document type'},
                num: {
                    title: 'Document number',
                    validation: Joi.string()
                        .when('type', {
                            is: [Joi.string(), Joi.number()],
                            then: Joi.required(),
                            otherwise: Joi.allow('')
                        })
                        .label('Document number')
                }
            }
        },
        regIssuer: {title: 'Issuer'},
        regCountry: {title: 'Country'},
        regStart: {title: 'Issuing date', widget: {type: 'date', mask: '99/99/9999'}, validation: Joi.date()},
        regEnd: {title: 'Valid until', widget: {type: 'date', mask: '99/99/9999'}, validation: Joi.date()},
        capital: {title: 'Issued Capital', widget: {type: 'currency'}, validation: Joi.number()},
        capitalCurrency: {title: 'Issued Capital currency', widget: currencyEditor, validation: Joi.number().integer()},
        capitalDate: {title: 'Issued on'},
        capitalCountry: {title: 'Capital country'},
        ownerNationality: {title: 'Capital owner nationality'},
        addressCountry: {title: 'Country'},
        addressCity: {title: 'City'},
        addressZip: {title: 'Post code'},
        addressStreet: {title: 'Street'},
        phone: {
            title: '',
            widget: tableEditor,
            validation: Joi.any(),
            items: {
                properties: {
                    type: {title: 'Type'},
                    countryCode: {title: 'Country code'},
                    phoneNumber: {title: 'Number'}
                }
            }
        },
        email: {
            title: '',
            widget: tableEditor,
            validation: Joi.any(),
            items: {
                properties: {
                    type: {title: 'Type'},
                    emailAddress: {title: 'Email address'}
                }
            }
        },
        personName: {title: 'Name'},
        personPosition: {title: 'Position'}
    }
};

const cards = {
    main: {label: 'Main data', className: 'lg:col-6 xl:col-4', widgets: ['identifierType', 'identifier', 'clientNumber', 'legalStatus']},
    reg: {label: 'Registration', className: 'lg:col-6 xl:col-4', widgets: ['regDoc.type', 'regDoc.num', 'regIssuer', 'regCountry', 'regStart', 'regEnd']},
    financial: {label: 'Financial data', className: 'lg:col-6 xl:col-4', widgets: ['capital', 'capitalCurrency', 'capitalDate', 'capitalCountry', 'ownerNationality']},
    address: {label: 'Address', widgets: ['addressCountry', 'addressCity', 'addressZip', 'addressStreet']},
    phone: {label: 'Phone', widgets: [{name: 'phone', widgets: ['type', 'countryCode', 'phoneNumber']}]},
    email: {label: 'E-mail', widgets: [{name: 'email', widgets: ['type', 'emailAddress']}]},
    person: {label: 'Contact person', widgets: ['personName', 'personPosition']}
};

export const Basic: React.FC<{}> = () => {
    const [filter, setFilter] = React.useState(items?.[0]?.items?.[0]);
    const [trigger, setTrigger] = React.useState<(event: {}) => void>();
    const {toast, submit} = useToast();
    return (
        <>
            {toast}
            <Toolbar left={<Button icon='pi pi-save' onClick={trigger} disabled={!trigger}/>}/>
            <div className='flex' style={{overflowX: 'hidden', width: '100%'}}>
                <ThumbIndex items={items} onFilter={setFilter}/>
                <Form
                    schema={schema}
                    cards={cards}
                    layout={filter?.widgets || []}
                    onSubmit={submit}
                    setTrigger={setTrigger}
                    value={data}
                />
            </div>
        </>
    );
};
