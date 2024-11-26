import { createSlice, combineReducers } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdote";

// Anecdote slice
const anecdotesSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteChange(state, action) {
      const id = action.payload.id;
      return state.map((anecdote) =>
        anecdote.id === id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      );
    },
    addNewAnecdote(state, action) {
      state.push(action.payload);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

// Filter slice
const filterSlice = createSlice({
  name: "filter",
  initialState: "",
  reducers: {
    setFilter(state, action) {
      return action.payload;
    },
  },
});

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload; // action.payload is the notification message
    },
    clearNotification() {
      return ""; // Clears the notification
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(anecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdotes = getState().anecdotes;
    const anecdoteToChange = anecdotes.find((a) => a.id === id);
    const updatedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1,
    };

    const updatedAnecdoteFromServer = await anecdoteService.update(
      id,
      updatedAnecdote
    );

    dispatch(voteChange(updatedAnecdoteFromServer));
  };
};

// Export actions
export const { voteChange, addNewAnecdote, appendAnecdote, setAnecdotes } =
  anecdotesSlice.actions;
export const { setFilter } = filterSlice.actions;
export const { setNotification, clearNotification } = notificationSlice.actions;

// Combine reducers
const reducer = combineReducers({
  anecdotes: anecdotesSlice.reducer,
  filter: filterSlice.reducer,
  notification: notificationSlice.reducer,
});

export default reducer;
