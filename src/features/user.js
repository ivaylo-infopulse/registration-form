import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const initialData = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    value: initialData,
  },
  reducers: {
    login: (state, action) => {
      let userId;
      const isUserExist = action.payload.arrData?.find((user, index) => {
        userId = index;
        return user.name === action.payload.data.name;
      });
      state.value = { isUserExist, userId };
    },

    logout: (state) => {
      state.value = initialData;
    },
  },
});

export const { login, logout } = userSlice.actions;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
