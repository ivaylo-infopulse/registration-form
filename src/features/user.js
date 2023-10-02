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

    addProducts: (state, action) => {
      const productsToAdd = action.payload;
      productsToAdd.forEach(({ image, price, id }) => {
        const existingProduct = state.basket.find(
          (product) => product.id === id
        );
        existingProduct
          ? (existingProduct.quantity += 1)
          : state.basket.push({ image, price, id, quantity: 1 });
      });
    },

    deleteProducts: (state, action) => {
      state.basket = action.payload;
    },

    totalCost: (state, action) => {
      state.totalPrice = action.payload;
    },

    buyProduct: (state, action) => {
      state.productToBuy = action.payload;
    },
  },
});

export const {
  login,
  logout,
  addProducts,
  deleteProducts,
  totalCost,
  buyProduct,
} = userSlice.actions;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
