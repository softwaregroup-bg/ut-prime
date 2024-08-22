import { Button as PrimeButton, type ButtonProps as PrimeButtonProps } from 'primereact/button';
import { Calendar as PrimeCalendar } from 'primereact/calendar';
import { Card as PrimeCard, type CardProps } from 'primereact/card';
import { AutoComplete as PrimeAutoComplete, type AutoCompleteProps } from 'primereact/autocomplete';
import type { CalendarProps } from 'primereact/calendar';
import type { DataTableProps as PrimeDataTableProps} from 'primereact/datatable';
import type { DataViewProps } from 'primereact/dataview';
import type { FileUploadProps } from 'primereact/fileupload';
import type { HookParams as TooltipParams } from '../hooks/useTooltip';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import React from 'react';
import Component from '../Component';
import Text from '../Text';
import useTooltip from '../hooks/useTooltip';
import useText from '../hooks/useText';
import Permission from '../Permission';
import {Props as PermissionProps} from '../Permission/Permission.types';
import {confirmPopup as confirmPopupPrime} from 'primereact/confirmpopup';
import {confirmDialog as confirmDialogPrime} from 'primereact/confirmdialog';

export { CascadeSelect } from 'primereact/cascadeselect';
export { Chart } from 'primereact/chart';
export { Checkbox } from 'primereact/checkbox';
export { Chips } from 'primereact/chips';
export { Column } from 'primereact/column';
export { ConfirmPopup } from 'primereact/confirmpopup';
export { ConfirmDialog } from 'primereact/confirmdialog';
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
export { Tooltip } from 'primereact/tooltip';
export { Tree } from 'primereact/tree';
export { TreeSelect } from 'primereact/treeselect';
export { TreeTable } from 'primereact/treetable';
export { TriStateCheckbox } from 'primereact/tristatecheckbox';
export { MultiSelect } from 'primereact/multiselect';
type DataTableProps = PrimeDataTableProps & {emptyMessage?: string | {page: string}}
export type { DataTableProps };
export type { DataViewProps };
export type { FileUploadProps };

function dateRange(timeOnly) {
    const today = timeOnly ? new Date(0) : new Date();
    if (!timeOnly) today.setHours(0, 0, 0, 0);
    return [today, new Date(today.getTime() + (timeOnly ? 0 : 86400000))];
}

function date(eod) {
    const today = new Date();
    if (eod) today.setHours(23, 59, 59, 999); else today.setHours(0, 0, 0, 0);
    return today;
}

export const confirmPopup = ({message, ...params}) => confirmPopupPrime({
    message: message && <Text>{message}</Text>,
    ...params
});
export const confirmDialog = ({message, header, ...params}) => confirmDialogPrime({
    message: message && <Text>{message}</Text>,
    header: header && <Text>{header}</Text>,
    ...params
});

export const DateRange = React.forwardRef<HTMLInputElement, CalendarProps>(function DateRange(props, ref) {
    const [visible, setVisible] = React.useState(false);
    const value = React.useMemo(() => (visible && !props.value) ? dateRange(props.timeOnly) : props.value, [visible, props.value, props.timeOnly]);
    const onVisibleChange = React.useCallback(event => {
        setVisible(event.visible);
    }, [setVisible]);
    return <PrimeCalendar
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

export const Calendar = React.forwardRef<HTMLInputElement, CalendarProps & {eod?: boolean, reactTooltip?: TooltipParams['reactTooltip']}>(function Calendar({tooltip, tooltipOptions, reactTooltip, ...props}, ref) {
    const [visible, setVisible] = React.useState(false);
    const value = React.useMemo(() => (visible && !props.value) ? date(props.eod) : props.value, [visible, props.value, props.eod]);
    const handleShow = React.useCallback(() => setVisible(true), [setVisible]);
    const handleHide = React.useCallback(() => setVisible(false), [setVisible]);
    const tooltipProps = useTooltip({tooltip, tooltipOptions, reactTooltip});
    return <PrimeCalendar
        {...props}
        {...tooltipProps}
        value={value}
        onShow={handleShow}
        onHide={handleHide}
        inputRef={ref}
    />;
});

export const Card = ({title, permission, ...props}: CardProps & Partial<PermissionProps>) => {
    const card = <PrimeCard title={title && <Text>{title}</Text>} {...props}/>;
    return permission == null ? card : <Permission permission={permission}>{card}</Permission>;
};

export type ButtonProps = PrimeButtonProps & Partial<Pick<Parameters<typeof Permission>[0], 'permission'>> & {confirm?: string, reactTooltip?: TooltipParams['reactTooltip']}
const empty = {};
export const Button = ({children, permission, confirm, onClick, tooltip, tooltipOptions = empty, reactTooltip, ...props}: ButtonProps) => {
    const handleClick = React.useCallback(event => onClick ? (confirm ? confirmPopup({
        target: event.currentTarget,
        message: confirm,
        icon: 'pi pi-exclamation-triangle',
        reject: () => {},
        accept: () => onClick(event)
    }) : onClick(event)) : () => {}, [onClick, confirm]);
    const tooltipProps = useTooltip({tooltip, tooltipOptions, reactTooltip});
    const label = useText({text: props.label});
    const button = (
        <PrimeButton
            {...props}
            {...tooltipProps}
            onClick={handleClick}
            label={label}
        >
            {children && (
                <span className="p-button-label p-c">
                    <Text>{children}</Text>
                </span>
            )}
        </PrimeButton>
    );
    return (permission == null) ? button : <Permission permission={permission}>{button}</Permission>;
};
export const DataTable = ({emptyMessage = 'No results found', value, ...props}: DataTableProps) =>
    (typeof emptyMessage === 'object' && emptyMessage?.page && !value?.length)
        ? <Component {...emptyMessage} />
        : <PrimeDataTable emptyMessage={emptyMessage && <Text>{emptyMessage}</Text>} value={value} {...props}/>;
export const AutoComplete = React.forwardRef<PrimeAutoComplete, AutoCompleteProps & {methods: unknown, autocomplete?: string}>(
    function AutoComplete({methods, autocomplete, ...props}, ref) {
        const [suggestions, setSuggestions] = React.useState();
        const complete = React.useCallback(
            async({query}) => methods && autocomplete && setSuggestions((await methods[autocomplete]({query})).suggestions), [methods, autocomplete]);
        return <PrimeAutoComplete {...props} completeMethod={complete} suggestions={suggestions} ref={ref}/>;
    }
);
