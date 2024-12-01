const apiFetch = (path, params) => {
  return fetch(`${path}?${params.key}=${params.value}`);
};

export default apiFetch;
