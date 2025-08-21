import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: any;
};

type CartState = {
  items: Record<string, CartItem>;
};

const initialState: CartState = {
  items: {},
};

const toMap = (arr: CartItem[]) =>
  arr.reduce<Record<string, CartItem>>((acc, it) => {
    acc[it.id] = { ...it, qty: Math.max(1, it.qty ?? 1) };
    return acc;
  }, {});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** Usado por PersistCart (SQLite) para hidratar el estado desde disco */
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = toMap(action.payload || []);
    },

    /** Agrega N unidades (por defecto 1). Compatible con distintas llamadas */
    addToCart(
      state,
      action: PayloadAction<{ id: string; title: string; price: number; qty?: number; image?: any }>
    ) {
      const { id, title, price, image } = action.payload;
      const qty = Math.max(1, action.payload.qty ?? 1);
      const existing = state.items[id];
      if (existing) existing.qty += qty;
      else state.items[id] = { id, title, price, qty, image };
    },

    /** Alias común en otras pantallas: agrega 1 unidad */
    addItem(
      state,
      action: PayloadAction<{ id: string; title: string; price: number; qty?: number; image?: any }>
    ) {
      const { id, title, price, image } = action.payload;
      const qty = Math.max(1, action.payload.qty ?? 1);
      const existing = state.items[id];
      if (existing) existing.qty += qty;
      else state.items[id] = { id, title, price, qty, image };
    },

    /** Remove por id (payload con objeto {id}) para compatibilidad */
    removeItem(state, action: PayloadAction<{ id: string }>) {
      delete state.items[action.payload.id];
    },

    /** Cambia cantidad explícita (mínimo 1) */
    changeQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const it = state.items[action.payload.id];
      if (it) it.qty = Math.max(1, action.payload.qty);
    },

    /** Vacía carrito */
    clearCart(state) {
      state.items = {};
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  addItem,
  removeItem,
  changeQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// -------- Selectores --------
export const selectCartMap = (state: RootState) => state.cart.items;

export const selectCartItems = createSelector(selectCartMap, (map) =>
  Object.values(map)
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((acc, it) => acc + it.qty, 0)
);

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((acc, it) => acc + it.qty * it.price, 0)
);
