import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    handleSelectedTimeRange?: (from: number, to: number) => void;
}

export type ComponentProps = React.FC<Props>
