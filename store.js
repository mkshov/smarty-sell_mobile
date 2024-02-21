import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});
