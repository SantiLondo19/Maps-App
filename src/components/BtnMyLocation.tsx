import { useContext } from "react";
import { MapContext, PlacesContext } from "../context";
import { error } from "console";

export const BtnMyLocation = () => {
  const { map, isMapReady } = useContext(MapContext);
  const { userLocation } = useContext(PlacesContext);
  const onClick = () => {
    if (!isMapReady) throw new Error("Mapa no está listo");
    if (!userLocation) throw new Error("No hay ubicación de usuario");
      map?.flyTo({
          zoom: 17,
          center: userLocation
     })
  
  };
  return (
    <button
      onClick={onClick}
      className="btn btn-primary"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 999,
      }}
    >
      Mi ubicación
    </button>
  );
};
