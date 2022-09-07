import React from 'react';
import type {DataTableProps} from 'primereact/datatable';
import type {DataViewProps} from 'primereact/dataview';

import { Calendar } from 'primereact/calendar';
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
export { DataView } from 'primereact/dataview';
export type {DataTableProps};
export type {DataViewProps};
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
export { MultiSelect } from './multiselect/MultiSelect';
export { PanelMenu } from 'primereact/panelmenu';
export { Password } from 'primereact/password';
export { ProgressSpinner } from 'primereact/progressspinner';
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
export { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

function dateRange(timeOnly) {
    const today = timeOnly ? new Date(0) : new Date();
    if (!timeOnly) today.setHours(0, 0, 0, 0);
    return [today, new Date(today.getTime() + timeOnly ? 0 : 86400000)];
}

export const DateRange = props => {
    const [visible, setVisible] = React.useState(false);
    const value = React.useMemo(() => (visible && !props.value) ? dateRange(props.timeOnly) : props.value, [visible, props.value, props.timeOnly]);
    const onVisibleChange = React.useCallback(event => {
        setVisible(event.visible);
    }, [setVisible]);
    return <Calendar
        showButtonBar
        selectionMode='range'
        showOnFocus={false}
        showIcon
        todayButtonClassName='hidden'
        {...props}
        visible={visible}
        value={value}
        onVisibleChange={onVisibleChange}
    />;
};
