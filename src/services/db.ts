import * as SQLite from "expo-sqlite";
import type { CartItem } from "../features/cart/cartSlice";

// Cacheamos la apertura de la DB (API nueva)
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("las_hermanas.db");
  }
  return dbPromise!;
}

/** Crea tablas si no existen */
export async function setup(): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      qty INTEGER NOT NULL
    );`
  );
}

/** Lee todos los items del carrito */
export async function loadCart(): Promise<CartItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<CartItem>(
    "SELECT id, title, price, qty FROM cart_items;"
  );
  return rows ?? [];
}

/** Guarda todo el carrito (transacción simple: truncar + insertar) */
export async function saveCart(items: CartItem[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM cart_items;");
    for (const it of items) {
      await db.runAsync(
        "INSERT OR REPLACE INTO cart_items (id, title, price, qty) VALUES (?, ?, ?, ?);",
        [it.id, it.title, it.price, it.qty]
      );
    }
  });
}
