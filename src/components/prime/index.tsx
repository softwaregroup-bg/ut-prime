import React from 'react';
import {Dropdown} from 'primereact/dropdown';
import {MultiSelect} from 'primereact/multiselect';
import {TreeSelect} from 'primereact/treeselect';
import {TreeTable} from 'primereact/treetable';
import {SelectButton} from 'primereact/selectbutton';
import {DataTable} from 'primereact/datatable';
import type {DataTableProps} from 'primereact/datatable';
import {Checkbox} from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { AutoComplete } from 'primereact/autocomplete';

export { AutoComplete } from 'primereact/autocomplete';
export { Button } from 'primereact/button';
export { Calendar } from 'primereact/calendar';
export { Card } from 'primereact/card';
export { CascadeSelect } from 'primereact/cascadeselect';
export { Chart } from 'primereact/chart';
export { Checkbox } from 'primereact/checkbox';
export { Chips } from 'primereact/chips';
export { Column } from 'primereact/column';
export { DataTable } from 'primereact/datatable';
export type {DataTableProps};
export { Dialog } from 'primereact/dialog';
export { Dropdown } from 'primereact/dropdown';
export { FileUpload } from 'primereact/fileupload';
export { Image } from 'primereact/image';
export { InputMask } from 'primereact/inputmask';
export { InputNumber } from 'primereact/inputnumber';
export { InputText } from 'primereact/inputtext';
export { InputTextarea } from 'primereact/inputtextarea';
export { ListBox } from 'primereact/listbox';
export { Menubar } from 'primereact/menubar';
export { MultiSelect } from 'primereact/multiselect';
export { PanelMenu } from 'primereact/panelmenu';
export { Password } from 'primereact/password';
export { RadioButton } from 'primereact/radiobutton';
export { Ripple } from 'primereact/ripple';
export { SelectButton } from 'primereact/selectbutton';
export { Skeleton } from 'primereact/skeleton';
export { Splitter, SplitterPanel } from 'primereact/splitter';
export { TabMenu } from 'primereact/tabmenu';
export { TabView, TabPanel } from 'primereact/tabview';
export { Toast } from 'primereact/toast';
export { Toolbar } from 'primereact/toolbar';
export { Tree } from 'primereact/tree';
export { TreeSelect } from 'primereact/treeselect';
export { TreeTable } from 'primereact/treetable';

const valueTemplate = (option, {optionLabel, name}) => {
    const value = option?.[optionLabel || 'label'];
    return value
        ? <span data-testid={name}>{value}</span>
        : 'empty';
};

export class DropdownTest extends Dropdown {
    // @ts-ignore
    static defaultProps = Object.assign({}, Dropdown.defaultProps, {valueTemplate});

    renderLabel(option) {
        return option
            // @ts-ignore
            ? super.renderLabel(option)
            // @ts-ignore
            : <span className='w-full inline-flex' data-testid={this.props.name}>{super.renderLabel(option)}</span>;
    }
}

export class MultiSelectTest extends MultiSelect {
    renderLabel(...params) {
        // @ts-ignore
        return <span className='w-full inline-flex' data-testid={this.props.name}>{super.renderLabel(...params)}</span>;
    }
};

export class TreeSelectTest extends TreeSelect {
    renderLabel(...params) {
        // @ts-ignore
        return <span className='w-full inline-flex' data-testid={this.props.name}>{super.renderLabel(...params)}</span>;
    }
};

export class TreeTableTest extends TreeTable {
    renderTable(...params) {
        // @ts-ignore
        return <span className='w-full inline-flex' data-testid={this.props.id}>{super.renderTable(...params)}</span>;
    }
};

export class SelectButtonTest extends SelectButton {
    renderItems() {
        // @ts-ignore
        return <span className='w-full inline-flex' data-testid={this.props.id}>{super.renderItems()}</span>;
    }
};

export class DataTableTest extends DataTable {
    renderContent(...params) {
        // @ts-ignore
        return <span className='w-full' data-testid={this.props.id}>{super.renderContent(...params)}</span>;
    }
};

export class CheckboxTest extends Checkbox {
    render(...params) {
        // @ts-ignore
        // eslint-disable-next-line react/jsx-handler-names
        return <span className='w-full' data-testid={this.props.id} onClick={this.onClick}>{super.render(...params)}</span>;
    }
};

export class RadioButtonTest extends RadioButton {
    render(...params) {
        // @ts-ignore
        // eslint-disable-next-line react/jsx-handler-names
        return <span className='w-full' data-testid={this.props.id} onChange={this.onChange}>{super.render(...params)}</span>;
    }
};

export class AutoCompleteTest extends AutoComplete {
    render(...params) {
        // @ts-ignore
        // eslint-disable-next-line react/jsx-handler-names
        return <span className='w-full' data-testid={this.props.id} onChange={this.onChange}>{super.render(...params)}</span>;
    }
}
