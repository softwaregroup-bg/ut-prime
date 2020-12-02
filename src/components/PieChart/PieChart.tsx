import React from 'react';
import classnames from 'classnames';
import DXPieChart, { Series, Label, Connector, Size, Export } from 'devextreme-react/pie-chart';

import { IPieChartProps } from './PieChart.types';
import './PieChart.css';

const PieChart: React.FC<IPieChartProps> = ({
    className,
    dataSource = [],
    title,
    palette = 'Bright',
    argumentField,
    valueField,
    ...rest
}) => {
    return (
        <div className={classnames('utfd-piechart', className)} {...rest}>
            <DXPieChart dataSource={dataSource} palette={palette} title={title}>
                <Series argumentField={argumentField} valueField={valueField}>
                    <Label visible={true}>
                        <Connector visible={true} width={1} />
                    </Label>
                </Series>

                <Size width={500} />
                <Export enabled={true} />
            </DXPieChart>
        </div>
    );
};

export default PieChart;
