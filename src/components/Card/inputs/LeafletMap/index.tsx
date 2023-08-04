import merge from 'ut-function.merge';
import * as React from 'react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

import Context from '../../../Text/context';
import { Props } from './LMap.types';

import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [24, 36],
    iconAnchor: [12, 36]
});

L.Marker.prototype.options.icon = DefaultIcon;

const defaultOptions = {
    center: { lat: 42.69641881321328, lng: 23.323133750607305 },
    zoom: 12,
    dragging: true,
    touchZoom: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false
};

const Handlers = ({onMapClick, disabled, mapOptions}) => {
    const map = useMapEvents({
        click(e) {
            return onMapClick(e, map);
        }
    });
    React.useEffect(() => {
        if (!map) return;
        if (!disabled) {
            Object.entries(mapOptions).forEach(([k, v]) => {
                if (map[k] && v === true) {
                    if (k === 'zoomControl') {
                        map.addControl(map.zoomControl);
                        return;
                    }
                    map[k].enable();
                }
            });
        } else {
            Object.entries(mapOptions).forEach(([k, v]) => {
                if (map[k] && v === false) {
                    if (k === 'zoomControl') {
                        map.removeControl(map.zoomControl);
                        return;
                    }
                    map[k].disable();
                }
            });
        }
    }, [disabled, map, mapOptions]);
    return null;
};

export default React.forwardRef<object, Props>(function LeafletMap(props, ref) {
    if (typeof ref === 'function') ref({});
    const { options = {}, onChange, value = null, disabled = false } = props;
    const [selectedPosition, setSelectedPosition] = React.useState(value);
    const { configuration: { 'portal.utPrime.LMap': coreConfig = {} } = {} } = React.useContext(Context);

    const {key, region, language, ...mapOptions} = React.useMemo(() => {
        return merge(
            [
                {},
                defaultOptions,
                typeof coreConfig === 'string' ? JSON.parse(coreConfig) : coreConfig,
                options,
                selectedPosition && { center: selectedPosition },
                disabled && { dragging: false, touchZoom: false, doubleClickZoom: false, scrollWheelZoom: false, boxZoom: false, keyboard: false, zoomControl: false }
            ].filter(Boolean)
        );
    }, [options, selectedPosition, coreConfig, disabled]);

    const onMapClick = React.useCallback(
        (event, map) => {
            if (disabled) return;
            map.flyTo(event.latlng, map.getZoom());
            const position = event.latlng;
            setSelectedPosition(position);
            onChange({ value: position });
        },
        [disabled, onChange]
    );

    return (
        <div className="w-full">
            <MapContainer style={{width: '100%', maxWidth: '100%', minHeight: '320px'}} {...(({zoomControl, ...rest}) => rest)(mapOptions)}>
                <Handlers onMapClick={onMapClick} disabled={disabled} mapOptions={mapOptions} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selectedPosition && <Marker position={selectedPosition} />}
            </MapContainer>
            {selectedPosition && (
                <div style={{ marginTop: 'var(--inline-spacing)' }}>
                    {[selectedPosition.lat, selectedPosition.lng].join(', ')}
                </div>
            )}
        </div>
    );
});
