import merge from 'ut-function.merge';
import * as React from 'react';
import { GMap as PrimeGMap } from 'primereact/gmap';
import { Skeleton } from 'primereact/skeleton';
import { loadGoogleMaps, removeGoogleMaps } from './util';

const defaultOptions = {
    map: {
        center: { lat: 42.69641881321328, lng: 23.323133750607305 },
        zoom: 12,
        disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: 'cooperative'
    },
    load: {
        key: 'AIzaSyAUxaWXkn6tidIGY2-XUmsaDLLId-syhF0',
        language: 'bg', // https://developers.google.com/maps/faq#languagesupport
        region: 'BG' // https://developers.google.com/maps/coverage
    }
};

const disableUserInteraction = {
    gestureHandling: 'none'
};

// TODO: unused ref below, but fixed warning.
export const GMap = React.forwardRef(function GMap(props: any, ref) {
    const { options = {}, onChange, value = null, disabled = false } = props;
    const [marker, setMarker] = React.useState(null);
    const [selectedPosition, setSelectedPosition] = React.useState(value);
    const [googleMapsReady, setGoogleMapsReady] = React.useState(false);
    const map = React.useRef(null);

    const mapOptions = React.useMemo(() => {
        return merge([
            {},
            defaultOptions.map,
            options?.map,
            disabled && disableUserInteraction,
            selectedPosition && { center: selectedPosition }
        ].filter(Boolean));
    }, [options?.map, disabled, selectedPosition]);

    React.useEffect(() => {
        loadGoogleMaps(merge({}, defaultOptions.load, options?.load || {}), () => {
            setGoogleMapsReady(true);
        });
        return () => {
            removeGoogleMaps();
        };
    }, [options]);

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
            onChange({ value: selectedPosition });
        },
        [disabled, onChange, selectedPosition]
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
