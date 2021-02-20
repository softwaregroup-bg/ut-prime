import React from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';

import { Portal } from '../Theme';

import { Styled, StyledType } from './Dashboard.types';

const Dashboard: StyledType = ({ classes, className, ...props }) => {
    const {ut} = useTheme<Portal>();
    const theme = {...classes, ...ut.classes};

    return <div className={clsx(theme.h100pr, className)}>
        <div className={theme.background}>
            <div className={theme.marginTop}>
                {props.children}
                <div className={theme.dashboardText}>{ut.portalName} Dashboard</div>
                <div className={clsx(theme.dashboardBg, theme.dashboardImg)} />
            </div>
        </div>
    </div>;
};

export default Styled(Dashboard);
