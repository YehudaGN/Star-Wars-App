import apiFetch from "./apiFetch";

const searchPerson = searchTerm => {
  return apiFetch("https://swapi.dev/api/people/", {
    key: "search",
    value: searchTerm,
  });
};

export default searchPerson;
