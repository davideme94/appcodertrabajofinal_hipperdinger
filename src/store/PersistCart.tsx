import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { hydrateCart, selectCartItems } from "../features/cart/cartSlice";
import { setup, loadCart, saveCart } from "../services/db";

export default function PersistCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const booted = useRef(false);

  // 1) Al montar: crear tablas y cargar carrito desde SQLite
  useEffect(() => {
    (async () => {
      try {
        await setup();
        const data = await loadCart();
        dispatch(hydrateCart(data));
        booted.current = true;
      } catch (err) {
        console.warn("SQLite setup/load error", err);
      }
    })();
  }, [dispatch]);

  // 2) Guardar en SQLite cuando cambian items (después del boot)
  useEffect(() => {
    if (!booted.current) return;
    (async () => {
      try {
        await saveCart(items);
      } catch (err) {
        console.warn("SQLite save error", err);
      }
    })();
  }, [items]);

  return null;
}
