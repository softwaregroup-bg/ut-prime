import React from 'react';
import type { Story, Meta } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import joi from 'joi';
import merge from 'ut-function.merge';
import type { Middleware } from 'redux';

import page from './README.mdx';
import Editor from './index';
import type { Props } from './Editor.types';
import tree from '../test/tree';
import document from '../test/document';
import decorators from '../test/decorator';
import {middleware} from '../Text/Text.mock';
import useToast from '../hooks/useToast';
import unauthenticated from '../test/unauthenticated';
import type {UtError} from '../types';
import Explorer from '../Explorer';

const meta: Meta = {
    title: 'Editor',
    component: Editor,
    parameters: {docs: {page}},
    decorators,
    excludeStories: ['Template'],
    args: {
        state: {},
        middleware: [middleware]
    }
};
export default meta;

export type StoryTemplate = Story<Partial<Props> & {lang?: string, middleware?: Middleware[]}> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

export const Template: Story<Props> = args => {
    const {toast, submit, delay, error} = useToast();
    return (
        <>
            {toast}
            <Editor
                methods={{
                    async handleFieldChange({field, value, event}: {field: unknown, value, event: Event}) {
                        submit({field, value});
                    },
                    async 'portal.customization.get'() {
                        return {};
                    },
                    'editor.submit': submit,
                    'editor.submitError': error('submit error'),
                    'editor.submitDelay': delay
                }}
                onAdd={submit}
                onEdit={submit}
                onCustomization={submit}
                buttons={{
                    save: {
                        successHint: 'saved'
                    }
                }}
                {...args}
            />
        </>
    );
};

export const Basic: StoryTemplate = Template.bind({});
Basic.args = {
    id: 1,
    object: 'tree',
    ...tree,
    layouts: {
        edit: [['edit', 'denied'], ['taxonomy', 'reproduction'], ['morphology', 'links'], 'habitat']
    },
    onDropdown: names => Promise.resolve({
        'tree.type': [{value: 1, label: 'Conifer'}, {value: 2, label: 'Broadleaf'}],
        'tree.habitat': [
            {value: 1, label: 'Forests'},
            {value: 2, label: 'Plantations'},
            {value: 3, label: 'Riverbanks'},
            {value: 4, label: 'Rivers'},
            {value: 5, label: 'Rocky areas'},
            {value: 6, label: 'Urban'},
            {value: 7, label: 'Wetlands'}
        ]
    }),
    onGet: params => Promise.resolve({
        tree: {treeName: 'Oak', treeId: 1, treeType: 1, createdOn: new Date('2023-03-08')}
    })
};

export const Loading: StoryTemplate = Template.bind({});
Loading.args = {
    ...Basic.args,
    onGet: params => new Promise((resolve, reject) => {})
};

export const DropdownError: StoryTemplate = Template.bind({});
DropdownError.args = {
    ...Basic.args,
    onDropdown: unauthenticated
};

export const GetError: StoryTemplate = Template.bind({});
GetError.args = {
    ...Basic.args,
    onGet: unauthenticated
};

export const Design: StoryTemplate = Template.bind({});
Design.args = {
    ...Basic.args,
    design: true
};

export const Tabs: StoryTemplate = Template.bind({});
Tabs.args = {
    ...Basic.args,
    layouts: {
        edit: {
            orientation: 'top',
            items: [{
                id: 'general',
                icon: 'pi pi-user',
                label: 'General',
                widgets: ['edit', 'habitat']
            }, {
                id: 'details',
                label: 'Details',
                icon: 'pi pi-book',
                widgets: ['taxonomy', 'morphology']
            }, {
                id: 'history',
                icon: 'pi pi-clock',
                widgets: ['history']
            }]
        }
    }
};

export const EditorWithExplorer: StoryTemplate = Template.bind({});
EditorWithExplorer.args = {
    ...Basic.args,
    layouts: {
        edit: {
            orientation: 'top',
            items: [{
                id: 'general',
                icon: 'pi pi-user',
                label: 'General',
                widgets: ['edit', 'habitat']
            }, {
                id: 'details',
                label: 'Details',
                icon: 'pi pi-book',
                widgets: ['taxonomy', 'morphology']
            }, {
                id: 'accounts',
                label: 'Accounts',
                icon: 'pi pi-desktop',
                widgets: ['account']
            }, {
                id: 'history',
                icon: 'pi pi-clock',
                widgets: ['history']
            }]
        }
    },
    middleware: [
        _store => next => action => (action.type === 'portal.component.get')
            ? Promise.resolve(function ExplorerComponent(props) {
                return <Explorer
                    fetch={() => Promise.resolve({
                        items: Array.from(Array(50).keys()).map(number => ({id: number, typeTransaction: 'Withdraw / cash out', branchCode: null, transferId: String(1051 + number), channelType: 'atm', transferDateTime: '2021-10-17 10:00:00', retrievalReferenceNumber: null, datetimeTransmission: null, channelId: '1', transferCurrency: 'USD', transferAmount: 100 + number, amountBilling: 7.5, amountSettlement: 107.5 + number, transferIdIssuer: null, transferIdAcquirer: null, transferIdLedger: null, transferIdMerchant: null, issuerTxState: 2, acquirerTxState: 2, ledgerTxState: null, merchantTxState: null, description: null, sourceAccount: `111-${String(111 + number)}`, destinationAccount: `222-${String(222 + number)}`, isError: null, alerts: null}))
                    })}
                    pageSize={22}
                    keyField='id'
                    resultSet='items'
                    schema={{
                        properties: {
                            typeTransaction: {
                                title: 'Transaction type'
                            },
                            branchCode: {
                                title: 'Branch Code'
                            },
                            transferId: {
                                title: 'Transfer ID'
                            },
                            channelType: {
                                title: 'Channel Type'
                            },
                            transferDateTime: {
                                title: 'Transfer Date Time'
                            },
                            retrievalReferenceNumber: {
                                title: 'Retrieval Reference Number'
                            },
                            datetimeTransmission: {
                                title: 'DateTime Transimission'
                            },
                            channelId: {
                                title: 'Channel ID'
                            },
                            transferCurrency: {
                                title: 'Transfer Currency'
                            },
                            transferAmount: {
                                title: 'Transfer Amount'
                            },
                            amountBilling: {
                                title: 'Amount Billing'
                            },
                            amountSettlement: {
                                title: 'Amount Settlement'
                            },
                            transferIdIssuer: {
                                title: 'Transfer ID Issuer'
                            },
                            transferIdAcquirer: {
                                title: 'Transfer ID Acquirer'
                            },
                            transferIdLedger: {
                                title: 'Transfer ID Ledger'
                            },
                            transferIdMerchant: {
                                title: 'Transfer ID Merchant'
                            },
                            issuerTxState: {
                                title: 'Issuer Transaction State'
                            },
                            acquirerTxState: {
                                title: 'Acquirer Transaction State'
                            },
                            ledgerTxState: {
                                title: 'Ledger Transaction State'
                            },
                            merchantTxState: {
                                title: 'Merchant Transaction State'
                            },
                            description: {
                                title: 'Description'
                            },
                            sourceAccount: {
                                title: 'Source Account'
                            },
                            destinationAccount: {
                                title: 'Destination Account'
                            },
                            isError: {
                                title: 'Is Error'
                            },
                            alerts: {
                                title: 'Alerts'
                            }
                        }
                    }}
                    cards = {{
                        browse: {
                            widgets: ['typeTransaction', 'branchCode', 'transferId', 'channelType', 'transferDateTime', 'retrievalReferenceNumber', 'datetimeTransmission', 'channelId', 'transferCurrency', 'transferAmount', 'amountBilling', 'amountSettlement', 'transferIdIssuer', 'transferIdAcquirer', 'transferIdLedger', 'transferIdMerchant', 'issuerTxState', 'acquirerTxState', 'ledgerTxState', 'merchantTxState', 'description', 'sourceAccount', 'destinationAccount', 'isError', 'alerts']
                        }
                    }}
                    {...props}
                />;
            })
            : next(action)
    ]
};
EditorWithExplorer.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 50));
    userEvent.click(canvas.getByText('Accounts'));
};

export const Steps: StoryTemplate = Template.bind({});
Steps.args = {
    ...Basic.args,
    toolbar: false,
    layouts: {
        edit: {
            orientation: 'top',
            type: 'steps',
            items: [{
                id: 'general',
                label: 'General',
                validation: joi.object({
                    tree: joi.object({
                        habitat: joi.array().min(1)
                    }).unknown()
                }).unknown(),
                widgets: ['edit', 'habitat']
            }, {
                id: 'details',
                label: 'Details',
                widgets: ['taxonomy', 'morphology']
            }, {
                id: 'history',
                label: 'History',
                widgets: ['history']
            }]
        }
    }
};

export const StepsDisabledBack: StoryTemplate = Template.bind({});
StepsDisabledBack.args = merge({}, Steps.args,
    {
        layouts: {
            edit: {
                disableBack: true
            }
        }
    }
);
StepsDisabledBack.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId('thumb-next-btn'));
};

export const StepsHiddenBack: StoryTemplate = Template.bind({});
StepsHiddenBack.args = merge({}, Steps.args,
    {
        layouts: {
            edit: {
                hideBack: true
            }
        }
    }
);
StepsHiddenBack.play = StepsDisabledBack.play;

export const Submit: StoryTemplate = Template.bind({});
Submit.args = {
    ...Basic.args,
    layouts: {
        edit: [['edit', 'denied'], ['taxonomy', 'reproduction'], ['morphology', 'links'], ['habitat', 'system']]
    }
};
Submit.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue('Oak'); // wait for the data to be loaded
    await userEvent.type(canvas.getByLabelText('Description'), 'test');
    await userEvent.click(canvas.getByLabelText('save'));
};

export const Files: StoryTemplate = Template.bind({});
Files.args = {
    id: 1,
    object: 'tree',
    ...tree,
    layouts: {
        edit: ['files']
    },
    onDropdown: names => Promise.resolve({}),
    onGet: params => Promise.resolve({
        tree: {treeName: 'Oak', treeId: 1, treeType: 1}
    })
};

Files.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue('Oak'); // wait for the data to be loaded
    await userEvent.clear(canvas.getByLabelText('Name'));
    await userEvent.type(canvas.getByLabelText('Name'), 'test');
    await userEvent.click(canvas.getByLabelText('save'));
};

export const FilesInTab: StoryTemplate = Template.bind({});
FilesInTab.args = {
    id: 1,
    object: 'tree',
    ...tree,
    layouts: {
        edit: {
            orientation: 'top',
            items: [{
                id: 'general',
                icon: 'pi pi-user',
                label: 'General',
                widgets: ['edit', 'habitat']
            }, {
                id: 'details',
                label: 'Details',
                icon: 'pi pi-book',
                widgets: ['files']
            }]
        }
    },
    onDropdown: names => Promise.resolve({}),
    onGet: params => Promise.resolve({
        tree: {treeName: 'Oak', treeId: 1, treeType: 1}
    })
};

FilesInTab.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue('Oak'); // wait for the data to be loaded
    await userEvent.clear(canvas.getByLabelText('Name'));
    await userEvent.type(canvas.getByLabelText('Name'), 'test');
    await userEvent.click(canvas.getByLabelText('save'));
};

export const MRZ: StoryTemplate = Template.bind({});
MRZ.args = {
    id: 1,
    object: 'document',
    ...document,
    onDropdown: names => Promise.resolve({}),
    onGet: params => Promise.resolve({})
};

const serverError = () => {
    const error: UtError = new Error('Server error');
    error.validation = [{
        path: ['params', 'tree', 'treeName'],
        message: 'Duplicate name'
    }, {
        path: ['params', 'tree', 'treeType'],
        message: 'Invalid Type'
    }];
    error.print = 'server validation message';
    throw error;
};

export const ServerValidation: StoryTemplate = Template.bind({});
ServerValidation.args = {
    ...Basic.args,
    onAdd: serverError,
    onEdit: serverError
};
ServerValidation.play = async({canvasElement}) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue('Oak'); // wait for the data to be loaded
    await userEvent.type(canvas.getByLabelText('Description'), 'test');
    await userEvent.click(canvas.getByLabelText('save'));
};

export const Toolbar: StoryTemplate = Template.bind({});
Toolbar.args = {
    ...Basic.args,
    cards: {
        ...Basic.args.cards,
        toolbar: {
            type: 'toolbar',
            widgets: [{
                type: 'submit',
                id: 'button1',
                method: 'editor.submit',
                params: {},
                label: 'Browse'
            }, {
                type: 'submit',
                id: 'button2',
                method: 'editor.submit',
                params: {id: 1},
                label: 'Open'
            }, {
                type: 'submit',
                id: 'button3',
                method: 'editor.submitError',
                params: {},
                label: 'Error'
            }, {
                type: 'submit',
                id: 'button4',
                method: 'editor.submitDelay',
                successHint: 'Done',
                params: {id: 1},
                label: 'Delay'
            }]
        }
    }
};

export const ToolbarBG: StoryTemplate = Template.bind({});
ToolbarBG.args = {
    ...Toolbar.args,
    lang: 'bg'
};
