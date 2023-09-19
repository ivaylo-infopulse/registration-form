import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const initialData = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const initialProducts = [
  {
    image: "",
    price: "",
  },
];

const userSlice = createSlice({
  name: "user",
  initialState: {
    value: initialData,
    basket: initialProducts,
    productToBuy: {},
    totalPrice: "",
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },

    logout: (state) => {
      state.value = initialData;
    },

    addProducts: (state, action) => {
      state.basket = [...action.payload];
    },

    totalCost: (state, action) =>{
      state.totalPrice = action.payload
    },

    buyProduct: (state, action) => {
      state.productToBuy = action.payload;
    },
  },
});

export const { login, logout, addProducts, totalCost, buyProduct } = userSlice.actions;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
