import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { hydrateCart, selectCartItems } from "../features/cart/cartSlice";
import { setup, loadCart, saveCart } from "../services/db";

export default function PersistCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const hydrated = useRef(false);

  // 1) Setup + hidratar al inicio
  useEffect(() => {
    (async () => {
      try {
        await setup();
        const stored = await loadCart();
        dispatch(hydrateCart(stored));
        hydrated.current = true;
      } catch (e) {
        console.warn("SQLite setup/load error", e);
      }
    })();
  }, [dispatch]);

  // 2) Guardar cada vez que cambia el carrito (después de hidratar)
  useEffect(() => {
    if (!hydrated.current) return;
    saveCart(items).catch((e) => console.warn("SQLite save error", e));
  }, [items]);

  return null; // No renderiza nada
}
