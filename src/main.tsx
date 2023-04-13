import React from "react";
import ReactDOM from "react-dom/client";
import { MapsApp } from "./MapsApp";

import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_APP_MAP_TOKEN;

if (!navigator.geolocation) {
  alert("Tu navegador no tiene opción de Geolocation");
  throw new Error("Tu navegador no tiene opción de Geolocation");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MapsApp />
  </React.StrictMode>
);
