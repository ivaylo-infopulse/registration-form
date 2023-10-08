import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const timeSlice = createSlice({
  name: "timer",
  initialState: { time: "" },
  reducers: {
    timer: (state, action) => {
      state.time = action.payload;
    },
  },
});

export const { timer, setTimer } = timeSlice.actions;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, timeSlice.reducer);

export default persistedReducer;
