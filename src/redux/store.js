import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./queries/apiSlice";

import authSliceReducer from "./slices/authSlice";
import cartSliceReducer from "./slices/cartSlice";
import clickSliceReducer from "./slices/clickSlice";
import languageReducer from "./slices/languageSlice";
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    cart: cartSliceReducer,
    click: clickSliceReducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
