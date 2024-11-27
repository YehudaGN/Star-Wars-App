  const initialState = {
    people: [],
  };
  
  // Reducer function
  const peopleReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_PEOPLE':
        return {
          ...state,
          people: action.payload, // Update people in the state with the fetched list
        };
      default:
        return state;
    }
  };
  
  export default peopleReducer;
  