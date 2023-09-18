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
    productPrice: "",
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
      const isDiscount = state.basket.some((item) => item.discount);
      state.totalPrice = state.basket
        .map((prop) =>
          isDiscount
            ? prop.quantity * prop.price * (1 - 0.2)
            : prop.price * prop.quantity
        )
        .reduce((partialSum, a) => partialSum + a, 0);
    },

    buyProduct: (state, action) => {
      state.productToBuy = action.payload;
      const isDiscount = state.productToBuy?.discount;
      state.productPrice = isDiscount
        ? state.productToBuy.price * (1 - 0.2)
        : state.productToBuy?.price;
    },
  },
});

export const { login, logout, addProducts, buyProduct } = userSlice.actions;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
