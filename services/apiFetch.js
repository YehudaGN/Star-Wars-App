const apiFetch = (path, params) => {
  if (params) {
    return fetch(`${path}?${params.key}=${params.value}`);
  } else {
    return fetch(path);
  }
};

export default apiFetch;
