import merge from 'ut-function.merge';
import * as React from 'react';
import { GMap as PrimeGMap } from 'primereact/gmap';
import { Skeleton } from 'primereact/skeleton';

import Context from '../../Text/context';

import { loadGoogleMaps, removeGoogleMaps } from './util';
import { Props } from './GMap.types';

const defaultOptions = {
    center: { lat: 42.69641881321328, lng: 23.323133750607305 },
    zoom: 12,
    disableDefaultUI: true,
    clickableIcons: false,
    gestureHandling: 'cooperative'
};

const disableUserInteraction = {
    gestureHandling: 'none'
};

export const GMap = React.forwardRef<object, Props>(function GMap(props, ref) {
    if (typeof ref === 'function') ref({});
    const { options = {}, onChange, value = null, disabled = false } = props;
    const [googleMapsReady, setGoogleMapsReady] = React.useState(false);
    const [selectedPosition, setSelectedPosition] = React.useState(value);
    const [marker, setMarker] = React.useState(null);
    const map = React.useRef<{getMap(): google.maps.Map}>(null);
    const { configuration: { 'utPrime.GMap': coreConfig = {} } = {}, languageCode = 'bg' } = React.useContext(Context);

    const {key, region, language, ...mapOptions} = React.useMemo(() => {
        return merge(
            [
                {
                    key: '',
                    region: 'BG',
                    language: languageCode
                },
                defaultOptions,
                coreConfig,
                options,
                disabled && disableUserInteraction,
                selectedPosition && { center: selectedPosition }
            ].filter(Boolean)
        );
    }, [options, disabled, selectedPosition, coreConfig, languageCode]);

    React.useEffect(() => {
        loadGoogleMaps({ language, key, region }, () => {
            setGoogleMapsReady(true);
        });
        return () => {
            removeGoogleMaps();
        };
    }, [language, key, region]);

    React.useEffect(() => {
        if (!googleMapsReady || !selectedPosition) return;
        const newMarker = new google.maps.Marker({
            position: selectedPosition
        });
        setMarker(newMarker);
    }, [googleMapsReady, selectedPosition]);

    React.useEffect(() => {
        if (!googleMapsReady) return;
        map.current?.getMap?.().setOptions?.(mapOptions);
    }, [mapOptions, googleMapsReady]);

    const onMapClick = React.useCallback(
        (event) => {
            if (disabled) return;
            const position = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            setSelectedPosition(position);
            onChange({ value: position });
        },
        [disabled, onChange]
    );

    if (!googleMapsReady) {
        return (
            <div className="w-full" style={{ minHeight: '320px' }}>
                <Skeleton width="100%" height="320px" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <PrimeGMap
                ref={map}
                overlays={[marker].filter(Boolean)}
                options={mapOptions}
                className="border-round"
                style={{ minHeight: '320px' }}
                onMapClick={onMapClick}
            />
            {selectedPosition && (
                <div style={{ marginTop: 'var(--inline-spacing)' }}>
                    {[selectedPosition.lat, selectedPosition.lng].join(', ')}
                </div>
            )}
        </div>
    );
});
