import { AnySourceData, LngLatBounds, Map, Marker, Popup } from "mapbox-gl";
import { MapContext } from "./MapContext";
import { useContext, useEffect, useReducer } from "react";
import { mapReducer } from "./mapReducer";
import { PlacesContext } from "../places/PlacesContext";
import { directionsApi } from "../../apis";
import { DirectionsResponse } from "../../interfaces/directions";

export interface MapState {
  isMapReady: boolean;
  map?: Map;
  markers: Marker[];
}

const initialState: MapState = {
  isMapReady: false,
  map: undefined,
  markers: [],
};

interface MapProps {
  children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: MapProps) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);
  const { places } = useContext(PlacesContext);

  useEffect(() => {
    state.markers.forEach((marker) => marker.remove());
    const newMarkers: Marker[] = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup().setHTML(`
        <h6>${place.text_es}</h6>
        <p>${place.place_name_es}</p>`);
      const newMarker = new Marker()
        .setPopup(popup)
        .setLngLat([lng, lat])
        .addTo(state.map!);
      newMarkers.push(newMarker);
    }
    dispatch({ type: "setMarkers", payload: newMarkers });
  }, [places]);

  const getRouteBetweenPoints = async (
    start: [number, number],
    end: [number, number]
  ) => {
    const response = await directionsApi.get<DirectionsResponse>(
      `/${start.join(",")};${end.join(",")}`
    );
    const { distance, duration, geometry } = response.data.routes[0];
    const { coordinates } = geometry;
    let kms = distance / 1000;
    kms = Math.round(kms * 100);
    kms /= 100;
    const minutes = Math.floor(duration / 60);
    console.log({ kms, minutes });
    const bounds = new LngLatBounds(start, start);
    for (const coord of coordinates) {
      const newCoord: [number, number] = [coord[0], coord[1]];
      bounds.extend(newCoord);
    }
    state.map?.fitBounds(bounds),
      {
        padding: 200,
      };
    // polyline
    const sourceData: AnySourceData = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates,
            },
          },
        ],
      },
    };
    // Remover polyline si existe
    if (state.map?.getLayer('RouteString')) {
      state.map.removeLayer('RouteString');
      state.map.removeSource('RouteString');
    }
    state.map?.addSource("RouteString", sourceData);
    state.map?.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-cap": 'round',
        "line-join": "round"
      },
      paint: {
        "line-color": 'black',
        "line-width": 3
      }
    })
  };

  const setMap = (map: Map) => {
    const myLocationPopup = new Popup().setHTML(
      `<h4>Aquí estoy</h4>
      <p>En algún lugar del mundo</p>`
    );

    new Marker({
      color: "red",
    })
      .setLngLat(map.getCenter())
      .addTo(map)
      .setPopup(myLocationPopup);

    dispatch({ type: "setMap", payload: map });
  };

  return (
    <MapContext.Provider
      value={{
        ...state,
        // Methods
        setMap,
        getRouteBetweenPoints,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
