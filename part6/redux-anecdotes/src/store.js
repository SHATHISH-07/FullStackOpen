import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers/anecdoteReducer";

const store = configureStore({ reducer });

export default store;
