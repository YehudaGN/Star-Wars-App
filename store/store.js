import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';


// Initial state
const initialState = {
  people: []
};

// Reducer function
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PEOPLE':
      return { ...state, people: action.payload };
    case 'REFRESH':
      return { ...[] };
    default:
      return state;
  }
};

// Create Redux store
const store = configureStore(rootReducer);

export default store;