import { MapMouseEvent } from "mapbox-gl";
import { useState } from "react";
import Map, { Marker } from "react-map-gl";
import { useTheme } from "./contexts/ThemeProvider";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface IMarker {
  longitude: number;
  latitude: number;
}

const LocationPicker = ({
  marker,
  onMapClick,
  styles
}: {
  marker: IMarker;
  onMapClick(geometry: IMarker): void; styles?: CSSModuleClasses
}) => {
  const {mapboxStyle} = useTheme()
  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
  });

  const handleMapClick = (e: MapMouseEvent) => {
    const { lng: longitude, lat: latitude } = e.lngLat;
    onMapClick({ longitude, latitude });
  };

  return (
    <div>
      <h3 className={`${styles?.formMapPicker}`}>Select a Location</h3>
      <Map
        {...viewState}
        style={{ width: "100%", height: "400px" }}
        mapStyle={mapboxStyle}
        onMove={(event) => setViewState(event.viewState)}
        onClick={handleMapClick}
        mapboxAccessToken={MAPBOX_TOKEN}
        dragPan={true}
        dragRotate={false}
      >
        <Marker longitude={marker.longitude} latitude={marker.latitude} />
      </Map>
    </div>
  );
};

export default LocationPicker;
