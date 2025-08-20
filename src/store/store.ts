import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import locationReducer from "../features/location/locationSlice"; // 👈 NUEVO

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    location: locationReducer, // 👈 NUEVO
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
