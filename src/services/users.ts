import { db } from "./firebase";
import { ref, set } from "firebase/database";
import type { Coords } from "../features/location/locationSlice";

export async function saveUserLocation(uid: string, coords: Coords, address?: string | null) {
  if (!uid || !coords) throw new Error("Faltan datos");
  await set(ref(db, `users/${uid}/location`), {
    lat: coords.lat,
    lng: coords.lng,
    address: address ?? null,
    updatedAt: Date.now(),
  });
}
