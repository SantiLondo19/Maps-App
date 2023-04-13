import { ChangeEvent, useContext, useRef } from "react";
import { PlacesContext } from "../context";
import { SearchResults } from "./SearchResults";

export const SearchBar = () => {
  const debounceRef = useRef<NodeJS.Timeout>();
  const { searchPlacesByTerm } = useContext(PlacesContext);
  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchPlacesByTerm(e.target.value);
    }, 350);
  };

  return (
    <div>
      <div className="search-container">
        <div className=" d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar lugar"
            onChange={onQueryChange}
          />
          <select
            name="lenguaje"
            className="form-select"
            id="lenguaje"
            style={{
              width: "35%",
            }}
            defaultValue={"es"}
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </div>
        <SearchResults />
      </div>
    </div>
  );
};
