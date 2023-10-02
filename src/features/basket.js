import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { applyDiscount } from "../components/productsList/Basket";

const initialProducts = [
  {
    image: "",
    price: "",
  },
];

const basketSlice = createSlice({
  name: "basket",
  initialState: {
    basket: initialProducts,
    productToBuy: {},
    totalPrice: "",
  },
  reducers: {
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
      action.payload.userProducts?.length
        ? (state.basket = action.payload.userProducts.filter(
            (item) => item.id !== action.payload.id
          ))
        : (state.basket = action.payload);
    },

    totalCost: (state, action) => {
      state.totalPrice = action.payload.userProducts
        .map((prop) =>
          action.payload.discount
            ? prop.quantity * applyDiscount(prop.price)
            : prop.price * prop.quantity
        )
        .reduce((partialSum, a) => partialSum + a, 0)
        .toFixed(2);
    },

    buyProduct: (state, action) => {
      state.productToBuy = action.payload;
    },
  },
});

export const { addProducts, deleteProducts, totalCost, buyProduct } =
  basketSlice.actions;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, basketSlice.reducer);

export default persistedReducer;
