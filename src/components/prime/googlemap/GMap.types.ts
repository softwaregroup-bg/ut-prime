import React from 'react';

interface GPSValue {
    lat: number;
    lng: number;
}

export interface GMapOptions extends google.maps.MapOptions {
    key?: string;
    region?: string;
}

export interface Props {
    options?: GMapOptions;
    onChange: (params: object) => void;
    value?: GPSValue;
    disabled?: boolean;
}

export interface MapRef {
    getMap(): google.maps.Map;
}

export type ComponentProps = React.FC<Props>;
