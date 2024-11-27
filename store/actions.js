export const setPeople = (people) => ({
    type: 'SET_PEOPLE',
    payload: people,
});

// Fetch people from the Star Wars API
export const fetchPeople = () => async (dispatch) => {
    try {
        const response = await fetch('https://swapi.dev/api/people/');
        const data = await response.json();
        dispatch(setPeople(data.results)); // Dispatch the fetched people to the Redux store
    } catch (error) {
        console.error('Error fetching people:', error);
    }
};

