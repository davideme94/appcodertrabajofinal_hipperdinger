import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

type CartState = { items: Record<string, CartItem> };
const initialState: CartState = { items: {} };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      const map: Record<string, CartItem> = {};
      for (const it of action.payload) map[it.id] = it;
      state.items = map;
    },
    addItem: (state, action: PayloadAction<{ id: string; title: string; price: number }>) => {
      const { id, title, price } = action.payload;
      const found = state.items[id];
      if (found) found.qty += 1;
      else state.items[id] = { id, title, price, qty: 1 };
    },
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const it = state.items[action.payload.id];
      if (!it) return;
      if (it.qty > 1) it.qty -= 1;
      else delete state.items[action.payload.id];
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { hydrateCart, addItem, removeItem, clearCart } = cartSlice.actions;

const selectItemsMap = (state: RootState) => state.cart.items;

export const selectCartItems = createSelector([selectItemsMap], (map) => Object.values(map));
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((acc, it) => acc + it.qty, 0)
);
export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((acc, it) => acc + it.qty * it.price, 0)
);

export default cartSlice.reducer;
