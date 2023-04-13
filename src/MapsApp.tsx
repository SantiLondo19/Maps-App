import { MapProvider, PlacesProvider } from "./context";
import { HomeScreen } from "./screens";

import './styles.css'

export const MapsApp = () => {
  return (
    <div>
      <PlacesProvider>
        <MapProvider>
          <HomeScreen />
        </MapProvider>
      </PlacesProvider>
    </div>
  );
};
