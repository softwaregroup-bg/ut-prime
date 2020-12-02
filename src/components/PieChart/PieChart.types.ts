import { PaletteType } from 'devextreme/viz/palette';

export interface IPieChartProps {
    className?: string;
    dataSource: any[];
    title: string;
    palette?: PaletteType;
    argumentField: string;
    valueField: string;
}
