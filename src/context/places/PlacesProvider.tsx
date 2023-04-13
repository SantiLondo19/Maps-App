import { useEffect, useReducer } from "react";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
import { getUserLocation } from "../../helpers";
import { searchApi } from "../../apis";
import { Feature, PlacesResponse } from "../../interfaces/places";

export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
  isLoadingPlaces: boolean;
  places: Feature[];
}

const initialState: PlacesState = {
  isLoading: true,
  userLocation: undefined,
  isLoadingPlaces: false,
  places: [],
};

interface PlacesProps {
  children: JSX.Element | JSX.Element[];
}

export const PlacesProvider = ({ children }: PlacesProps) => {
  const [state, dispatch] = useReducer(placesReducer, initialState);

  useEffect(() => {
    getUserLocation().then((lngLat) =>
      dispatch({ type: "setUserLocation", payload: lngLat })
    );
  }, []);

  const searchPlacesByTerm = async (query: string): Promise<Feature[]> => {
    if (query.length === 0) {
      dispatch({type: 'setPlaces', payload: []})
    };
    if (!state.userLocation) throw new Error("No hay ubicación de usuario");
    dispatch({ type: "setLoadingPlaces" });
    const response = await searchApi.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: state.userLocation.join(","),
      },
    });
    dispatch({ type: "setPlaces", payload: response.data.features });

    return response.data.features;
  };

  return (
    <PlacesContext.Provider
      value={{
        ...state,
        // Methods
        searchPlacesByTerm,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};
