import { Button as PrimeButton, type ButtonProps as PrimeButtonProps } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card as PrimeCard, type CardProps } from 'primereact/card';
import { AutoComplete as PrimeAutoComplete, type AutoCompleteProps } from 'primereact/autocomplete';
import type { CalendarProps } from 'primereact/calendar';
import type { DataTableProps } from 'primereact/datatable';
import type { DataViewProps } from 'primereact/dataview';
import type { FileUploadProps } from 'primereact/fileupload';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import React from 'react';
import Component from '../Component';
import Text from '../Text';
import Permission from '../Permission';
import {confirmPopup} from 'primereact/confirmpopup';

export { Calendar } from 'primereact/calendar';
export { CascadeSelect } from 'primereact/cascadeselect';
export { Chart } from 'primereact/chart';
export { Checkbox } from 'primereact/checkbox';
export { Chips } from 'primereact/chips';
export { Column } from 'primereact/column';
export { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
export { DataView } from 'primereact/dataview';
export { Dialog } from 'primereact/dialog';
export { Dropdown } from 'primereact/dropdown';
export { GMap } from './googlemap/GMap';
export { FileUpload } from 'primereact/fileupload';
export { Image } from 'primereact/image';
export { InputMask } from 'primereact/inputmask';
export { InputNumber } from 'primereact/inputnumber';
export { InputText } from 'primereact/inputtext';
export { InputTextarea } from 'primereact/inputtextarea';
export { ListBox } from 'primereact/listbox';
export { Menubar } from 'primereact/menubar';
export { Menu } from 'primereact/menu';
export { OverlayPanel } from 'primereact/overlaypanel';
export { PanelMenu } from 'primereact/panelmenu';
export { Password } from 'primereact/password';
export { ProgressBar } from 'primereact/progressbar';
export { ProgressSpinner } from 'primereact/progressspinner';
export { RadioButton } from 'primereact/radiobutton';
export { Ripple } from 'primereact/ripple';
export { SelectButton } from 'primereact/selectbutton';
export { Skeleton } from 'primereact/skeleton';
export { Splitter, SplitterPanel } from 'primereact/splitter';
export { Steps } from 'primereact/steps';
export { TabMenu } from 'primereact/tabmenu';
export { TabPanel, TabView } from 'primereact/tabview';
export { Toast } from 'primereact/toast';
export { Toolbar } from 'primereact/toolbar';
export { Tree } from 'primereact/tree';
export { TreeSelect } from 'primereact/treeselect';
export { TreeTable } from 'primereact/treetable';
export { MultiSelect } from 'primereact/multiselect';
export type { DataTableProps };
export type { DataViewProps };
export type { FileUploadProps };

function dateRange(timeOnly) {
    const today = timeOnly ? new Date(0) : new Date();
    if (!timeOnly) today.setHours(0, 0, 0, 0);
    return [today, new Date(today.getTime() + timeOnly ? 0 : 86400000)];
}

export const DateRange = React.forwardRef<HTMLInputElement, CalendarProps>(function DateRange(props, ref) {
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
        inputRef={ref}
    />;
});

export const Card = ({title, ...props}: CardProps) =>
    <PrimeCard title={title && <Text>{title}</Text>} {...props}/>;

export type ButtonProps = PrimeButtonProps & Partial<Pick<Parameters<typeof Permission>[0], 'permission'>> & {confirm?: string}
export const Button = ({children, permission, confirm, onClick, ...props}: ButtonProps) => {
    const handleClick = React.useCallback(event => confirm ? confirmPopup({
        target: event.currentTarget,
        message: <Text>{confirm}</Text>,
        icon: 'pi pi-exclamation-triangle',
        reject: () => {},
        accept: () => onClick(event)
    }) : onClick(event), [onClick, confirm]);
    const button = <PrimeButton {...props} onClick={handleClick}>{children && <span className='p-button-label p-c'><Text>{children}</Text></span>}</PrimeButton>;
    return (permission == null) ? button : <Permission permission={permission}>{button}</Permission>;
};
export const DataTable = ({ emptyMessage = 'No results found', noTable = null, value, ...props }: DataTableProps) => {
    const page = noTable?.page;
    const params = noTable?.params;
    const defaultTable = <PrimeDataTable emptyMessage={emptyMessage && <Text>{emptyMessage}</Text>} value={value} {...props} />;
    return noTable && Object.keys(noTable).length && Array.isArray(value) && !value.length ? <Component page={page} {...params} /> : defaultTable;
};
export const AutoComplete = React.forwardRef<PrimeAutoComplete, AutoCompleteProps & { methods: unknown, autocomplete?: string }>(
    function AutoComplete({ methods, autocomplete, ...props }, ref) {
        const [suggestions, setSuggestions] = React.useState();
        const complete = React.useCallback(
            async({query}) => methods && autocomplete && setSuggestions((await methods[autocomplete]({query})).suggestions), [methods, autocomplete]);
        return <PrimeAutoComplete {...props} completeMethod={complete} suggestions={suggestions} ref={ref}/>;
    }
);
