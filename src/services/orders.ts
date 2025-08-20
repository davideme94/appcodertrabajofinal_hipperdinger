// src/services/orders.ts
import { db } from "./firebase";
import { ref, push, set, onValue, off } from "firebase/database";
import type { CartItem } from "../features/cart/cartSlice";

export type Order = {
  items: CartItem[];
  total: number;
  createdAt: number; // epoch ms
};

/** Crea una orden bajo orders/{uid}/{orderId} y devuelve el id */
export async function createOrder(uid: string, items: CartItem[], total: number) {
  const ordersRef = ref(db, `orders/${uid}`);
  const newRef = push(ordersRef);
  const order: Order = { items, total, createdAt: Date.now() };
  await set(newRef, order);
  return newRef.key as string;
}

/** Suscripción al historial de órdenes del usuario */
export function subscribeOrders(
  uid: string,
  cb: (orders: (Order & { id: string })[]) => void
) {
  const ordersRef = ref(db, `orders/${uid}`);
  const handler = (snap: any) => {
    const data = (snap.val() || {}) as Record<string, Order>;
    const list = Object.entries(data)
      .map(([id, o]) => ({ id, ...o }))
      .sort((a, b) => b.createdAt - a.createdAt);
    cb(list);
  };
  onValue(ordersRef, handler);
  return () => off(ordersRef, "value", handler);
}
