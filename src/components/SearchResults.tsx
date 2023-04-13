import { useContext, useState } from "react";
import { MapContext, PlacesContext } from "../context";
import { LoadinPlaces } from "./LoadinPlaces";
import { Feature } from "../interfaces/places";

export const SearchResults = () => {
  const { places, isLoadingPlaces, userLocation } = useContext(PlacesContext);
  const { map, getRouteBetweenPoints } = useContext(MapContext);
  const [activeId, setActiveId] = useState("");
  if (isLoadingPlaces) return <LoadinPlaces />;
  if (places.length === 0) return <></>;

  const onPlaceClicked = (place: Feature) => {
    const [lng, lat] = place.center;
    setActiveId(place.id);
    map?.flyTo({
      zoom: 12,
      center: [lng, lat],
    });
  };
  const getRoute = (place: Feature) => {
    if (!userLocation) return;
    const [lng, lat] = place.center;
    
    getRouteBetweenPoints(userLocation, [lng, lat]);
  }
  return (
    <ul className="list-group mt-3">
      {places.map((place) => (
        <li
          onClick={() => onPlaceClicked(place)}
          key={place.id}
          className={`${
            activeId === place.id ? "active" : ""
          } pointer list-group-item list-group-item-action`}
        >
          <h6>{place.text_es}</h6>
          <p style={{ fontSize: "12px" }}>{place.place_name_es}</p>
          <button
            onClick={() =>getRoute(place)}
            className={`btn ${
              activeId === place.id
                ? "btn-outline-light"
                : "btn-outline-primary"
            }`}
          >
            Direcciones
          </button>
        </li>
      ))}
    </ul>
  );
};
