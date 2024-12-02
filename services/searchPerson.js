import apiFetch from "./apiFetch";

const fetchSpecies = searchTerm => {
  return apiFetch("https://swapi.dev/api/people/", {
    key: "search",
    value: searchTerm,
  });
};

export default fetchSpecies;
