import { createSlice } from "@reduxjs/toolkit";

const savedData = localStorage.getItem("cart");

const initialState = {
  cartItems: savedData ? JSON.parse(savedData) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newProduct = action.payload;

      const existingProduct = state.cartItems.find((product) => product._id === newProduct._id);

      if (existingProduct) {
        state.cartItems = state.cartItems.map((product) =>
          product._id === existingProduct._id
            ? { ...product, qty: product.qty + newProduct.qty }
            : product
        );
      } else {
        state.cartItems = [...state.cartItems, newProduct];
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    updateCart: (state, action) => {
      const { _id, qty } = action.payload;

      // Find the product in the cart
      const existingProduct = state.cartItems.find((product) => product._id === _id);

      if (existingProduct) {
        // If qty is zero, remove the item from the cart
        if (qty === 0) {
          state.cartItems = state.cartItems.filter((product) => product._id !== _id);
        } else {
          // Update the quantity of the existing product
          state.cartItems = state.cartItems.map((product) =>
            product._id === _id ? { ...product, qty } : product
          );
        }
      }

      // Update local storage
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;
