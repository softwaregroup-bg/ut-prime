import React from 'react';
import { type MapContainerProps } from 'react-leaflet';

interface GPSValue {
    lat: number;
    lng: number;
}

export type LMapOptions = MapContainerProps;

export interface Props {
    options?: LMapOptions;
    onChange: (params: object) => void;
    value?: GPSValue;
    disabled?: boolean;
}

export type ComponentProps = React.FC<Props>;
